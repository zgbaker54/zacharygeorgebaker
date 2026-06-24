import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { GetWordOfTheDay, _7LettersIsValidWord } from './utils/utils'
import { useNavigate } from 'react-router-dom';
import './styles/Global.css';

// ── Keyboard layout ──────────────────────────────────────────────────
const keyboardRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const keyboardRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const keyboardRow3 = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];

const isSpecialKey = (key: string) => key === 'ENTER' || key === '⌫';

// ── Types ────────────────────────────────────────────────────────────
type LetterState = "exact" | "misplaced" | "wrong" | null;
interface GuessSequence {
    date: string;
    guesses: Guess[];
}
interface Guess {
    letters: GuessLetter[];
    submitted: boolean;
    validWord: boolean | null;
}
interface GuessLetter {
    letter: string;
    evaluation: LetterState;
}

// ── Component ────────────────────────────────────────────────────────
export default function Gallery7LettersContent(): React.ReactElement {

    const navigate = useNavigate();

    const numberOfGuesses = 7
    const numberOfLetters = 7
    const tutorialStorageKey = '7LettersTutorialSeen'

    // ── State ────────────────────────────────────────────────────────
    let [wordOfTheDay, setWordOfTheDay] = useState<string | null>(null)
    let [currentDay, setCurrentDay] = useState<string | null>(null)
    let [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)
    let [guessSequence, setGuessSequence] = useState<GuessSequence | null>(null)
    let [currentGuessNumber, setCurrentGuessNumber] = useState<number | null>(null)
    let [isSolved, setIsSolved] = useState<boolean>(false)
    let [showResult, setShowResult] = useState<boolean>(false)
    let [showTutorial, setShowTutorial] = useState<boolean>(!window.localStorage.getItem(tutorialStorageKey))
    let [showMenu, setShowMenu] = useState<boolean>(false)

    const snackbarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const snackBarTimeoutMs = 3000

    // ── Helpers: persistence ─────────────────────────────────────────

    /** Build the localStorage key for a given date. */
    function getGuessSequenceKey(date: string): string {
        return `7LettersGuessSequence-${currentDay}`
    }

    /** Persist the current guess sequence to localStorage. */
    function storeGuessSequence(date: string) {
        if (guessSequence !== null) {
            window.localStorage.setItem(getGuessSequenceKey(date), JSON.stringify(guessSequence))
        }
    }

    /** Load a previously saved guess sequence from localStorage. */
    function retrieveGuessSequence(date: string): GuessSequence | null {
        const guessSequenceString = window.localStorage.getItem(getGuessSequenceKey(date))
        if (!guessSequenceString || guessSequenceString === 'undefined') { return null }
        try {
            return JSON.parse(guessSequenceString) as GuessSequence
        } catch (error) {
            console.error("Corrupted localstorage data found:", error)
            return null
        }
    }

    /** Reset the guess sequence to a fresh empty state for the current day. */
    function resetGuessSequence() {
        window.localStorage.removeItem(tutorialStorageKey)
        if (currentDay === null) { return }
        setGuessSequence({
            date: currentDay,
            guesses: [],
        })
    }

    /** Append a new empty guess row to the sequence (up to the max number of guesses). */
    function initGuessInSequence() {
        if (guessSequence === null) { return }
        if (guessSequence.guesses.length >= numberOfGuesses) { return }
        let newGuessSequence = structuredClone(guessSequence)
        newGuessSequence.guesses.push({
            letters: [],
            submitted: false,
            validWord: null,
        })
        setGuessSequence(newGuessSequence)
    }

    // ── Helpers: input handling ──────────────────────────────────────

    /** Append a letter to the current guess (up to the word length). */
    function typeLetter(letter: string) {
        if (guessSequence === null) { return }
        if (currentGuessNumber === null) { return }
        if (letter.length !== 1) { return }
        let newGuessSequence = structuredClone(guessSequence)
        const currentGuessLetters = newGuessSequence.guesses[currentGuessNumber]?.letters
        if (!currentGuessLetters) { return }
        if (currentGuessLetters.length >= numberOfLetters) { return }
        currentGuessLetters.push({ letter: letter, evaluation: null })
        setGuessSequence(newGuessSequence)
    }

    /** Remove the last letter from the current guess. */
    function typeBackspace() {
        if (guessSequence === null) { return }
        if (currentGuessNumber === null) { return }
        let newGuessSequence = structuredClone(guessSequence)
        const currentGuessLetters = newGuessSequence.guesses[currentGuessNumber]?.letters
        if (!currentGuessLetters) { return }
        if (currentGuessLetters.length === 0) { return }
        currentGuessLetters.pop()
        setGuessSequence(newGuessSequence)
    }

    /** Mark the current guess as submitted (triggers validation in the effect). */
    function submitCurrentGuess() {
        if (guessSequence === null) { return }
        if (currentGuessNumber === null) { return }
        let newGuessSequence = structuredClone(guessSequence)
        const currentGuess = newGuessSequence.guesses[currentGuessNumber]
        if (currentGuess === undefined) { return }
        if (currentGuess.letters.length !== numberOfLetters) { return }
        currentGuess.submitted = true
        setGuessSequence(newGuessSequence)
    }

    /** Route keyboard events to the appropriate input handler. */
    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Backspace") {
            typeBackspace()
        } else if (e.key === "Enter") {
            submitCurrentGuess()
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            typeLetter(e.key.toUpperCase())
        }
    }

    // ── Helpers: validation & annotation ─────────────────────────────

    /**
     * Check all guesses that are marked `submitted` but haven't been
     * validated yet.  Calls the backend for each one and updates the
     * guess with the result + letter annotations.
     */
    async function validateSubmissions(): Promise<GuessSequence | null> {
        if (guessSequence === null) { return null }
        let newGuessSequence = structuredClone(guessSequence)
        for (let [guessIdx, guess] of newGuessSequence.guesses.entries()) {
            if (guess.submitted === true && guess.validWord === null) {
                const isValidWord = await _7LettersIsValidWord(guess.letters.map((x) => x.letter).join(''))
                if (isValidWord) {
                    newGuessSequence.guesses[guessIdx]!.validWord = true
                    newGuessSequence.guesses[guessIdx]!.letters = annotateLetters(newGuessSequence.guesses[guessIdx]!.letters)
                } else {
                    setSnackbarMessage(`Invalid word: ${guess.letters.map((x) => x.letter).join('')}`)
                    newGuessSequence.guesses[guessIdx]!.submitted = false
                }
                return newGuessSequence
            }
        }
        return null
    }

    /**
     * Compare a guess against the answer and mark each letter as
     * "exact", "misplaced", or "wrong".
     */
    function annotateLetters(guessLetters: GuessLetter[]): GuessLetter[] {
        if (wordOfTheDay === null) { return guessLetters }
        let answer = wordOfTheDay.split('')
        let newGuessLetters = structuredClone(guessLetters)
        // exact matches
        let exactIndexes: number[] = []
        for (let [idx, guessLetter] of newGuessLetters.entries()) {
            if (guessLetter.letter === answer[idx]) {
                newGuessLetters[idx]!.evaluation = 'exact'
                exactIndexes.push(idx)
            }
        }
        answer = answer.map((letter, idx) => {
            return exactIndexes.includes(idx) ? '' : letter
        })
        // misplaced | wrong
        for (let [idx, guessLetter] of newGuessLetters.entries()) {
            if (exactIndexes.includes(idx)) { continue }
            if (answer.includes(guessLetter.letter)) {
                newGuessLetters[idx]!.evaluation = 'misplaced'
            } else {
                newGuessLetters[idx]!.evaluation = 'wrong'
            }
        }
        return newGuessLetters
    }

    // return the letter state of the provided key based on the current guessSequence
    function getLetterState(key: string): LetterState {
        if (guessSequence === null) { return null }
        let foundWrongState: boolean = false
        let foundMisplacedState: boolean = false
        for (let guess of guessSequence.guesses) {
            if (guess.submitted !== true || guess.validWord !== true) {
                continue
            }
            for (let guessLetter of guess.letters) {
                if (guessLetter.letter !== key) { continue }
                if (guessLetter.evaluation === 'exact') {
                    return 'exact'
                } else if (guessLetter.evaluation === 'misplaced') {
                    foundMisplacedState = true
                } else if (guessLetter.evaluation === 'wrong') {
                    foundWrongState = true
                }
            }
        }
        return foundMisplacedState ? 'misplaced' : foundWrongState ? 'wrong' : null
    }

    // ── Effects ──────────────────────────────────────────────────────

    /** Lock the page scroll while the game is open. */
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        const originalHeight = document.body.style.height;
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100svh';
        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.height = originalHeight;
        };
    }, []);

    /** Fetch the word of the day from the backend on mount. */
    useEffect(() => {
        GetWordOfTheDay().then(
            (result) => {
                setWordOfTheDay(result.wordOfTheDay.toUpperCase())
                setCurrentDay(result.date)
            },
            (error) => {
                window.alert(`Whoops. There was an error loading the Word Of The Day 😕 Go bother Zach to fix it. (${error})`)
            }
        )
    }, [])

    /** Auto-dismiss the snackbar after a timeout. */
    useEffect(() => {
        if (snackbarMessage === null) { return }
        if (snackbarTimeoutRef.current) {
            clearTimeout(snackbarTimeoutRef.current)
        }
        snackbarTimeoutRef.current = setTimeout(() => {
            setSnackbarMessage(null)
        }, snackBarTimeoutMs)
    }, [snackbarMessage])

    /** Restore a saved game or start a fresh one once the word is loaded. */
    useEffect(() => {
        if (wordOfTheDay === null) { return }
        if (currentDay === null) { return }
        const storedGuessSequence = retrieveGuessSequence(currentDay)
        if (!storedGuessSequence) {
            resetGuessSequence()
        } else {
            setGuessSequence(storedGuessSequence)
        }
    }, [wordOfTheDay, currentDay])

    /**
     * Core game-loop effect: runs whenever the guess sequence changes.
     * Persists to localStorage, validates pending submissions, checks
     * win/loss conditions, and advances to the next guess row.
     */
    useEffect(() => {
        (async () => {
            if (guessSequence === null) { return }
            if (currentDay === null) { return }
            storeGuessSequence(currentDay)

            // No guesses yet → initialise the first row.
            if (guessSequence.guesses.length === 0) {
                initGuessInSequence()
                return
            }

            // Validate any newly-submitted guesses.
            const validatedSubmissions = await validateSubmissions()
            if (validatedSubmissions) {
                setGuessSequence(validatedSubmissions)
                return
            }

            // Check if the player has solved the puzzle.
            for (let guess of guessSequence.guesses) {
                if (guess.submitted !== true || guess.validWord !== true) { continue }
                if (guess.letters.every(letter => letter.evaluation === 'exact')) {
                    setIsSolved(true)
                    setShowResult(true)
                    return
                }
            }
            setIsSolved(false)

            // Check if the player is out of guesses.
            if (guessSequence.guesses.filter(guess => guess.submitted === true && guess.validWord === true).length === numberOfGuesses) {
                setShowResult(true)
                return
            }

            // Stay on the current row if it hasn't been submitted yet.
            if (guessSequence.guesses[guessSequence.guesses.length - 1]?.submitted === false) {
                setCurrentGuessNumber(guessSequence.guesses.length - 1)
                return
            }

            // Otherwise advance to the next row.
            initGuessInSequence()
        })()
    }, [guessSequence])

    // ── Render: guess grid ───────────────────────────────────────────

    const guessRows = <div
        className='_7LettersGuessRows'
        tabIndex={0}
    >
        {Array.from({ length: numberOfGuesses }).map((_, guessNumber) => {
            return <div
                className='_7LettersGuessRow'
                key={`7LettersGuessRow${guessNumber}`}
            >
                {Array.from({ length: numberOfLetters }).map((_, letterNumber) => {
                    return <div
                        className={`
                            _7LettersGuessSlot
                            ${
                                guessSequence?.guesses[guessNumber]?.letters[letterNumber]?.evaluation === 'exact' ? "exact" :
                                guessSequence?.guesses[guessNumber]?.letters[letterNumber]?.evaluation === 'misplaced' ? "misplaced" :
                                guessSequence?.guesses[guessNumber]?.letters[letterNumber]?.evaluation === 'wrong' ? "wrong" :
                                currentGuessNumber === guessNumber ? "_7LettersGuessSlot" :
                                (currentGuessNumber ? currentGuessNumber : 0) < guessNumber ? "_7LettersGuessSlotInactive" :
                                ""
                            }
                        `}
                        key={`7LettersGuessSlot${letterNumber}`}
                    >
                        {guessSequence?.guesses[guessNumber]?.letters[letterNumber]?.letter.toUpperCase()}
                    </div>
                })}
            </div>
        })}
    </div>

    // ── Render: header ───────────────────────────────────────────────

    const header = <div className='_7LettersHeader'>
        <button
            className='_7LettersHeaderBackButton'
            onClick={() => navigate('/gallery')}
        >
            ← Back
        </button>
        <span className='_7LettersHeaderTitle'>7 LETTERS</span>
        <div className='_7LettersHeaderRight'>
            <span className='_7LettersHeaderDate'>{currentDay}</span>
            <div className='_7LettersHeaderMenuContainer'>
                <button
                    className='_7LettersHeaderMenuButton'
                    onClick={() => setShowMenu(!showMenu)}
                >
                    ⋯
                </button>
                {showMenu && <div className='_7LettersHeaderMenuDropdown'>
                    <button
                        className='_7LettersHeaderMenuItem'
                        onClick={() => {
                            setShowTutorial(true)
                            setShowMenu(false)
                        }}
                    >
                        How to Play
                    </button>
                    <button
                        className='_7LettersHeaderMenuItem'
                        onClick={() => {
                            const code = window.prompt('Enter admin code:')
                            if (code?.trim().toLowerCase() === 'zgb') {
                                resetGuessSequence()
                            }
                            setShowMenu(false)
                        }}
                    >
                        Admin: Reset Guess Sequence
                    </button>
                </div>}
            </div>
        </div>
    </div>

    // ── Render: on-screen keyboard ───────────────────────────────────

    const keyboard = <div className='_7LettersKeyboardDiv'>
        {[keyboardRow1, keyboardRow2, keyboardRow3].map((keyboardRow, rowNum) => {
            return <div
                className={`_7LettersKeyboardRow row${rowNum}`}
                key={rowNum}
            >
                {rowNum === 1 && <div className="keyboard-spacer" />}
                {keyboardRow.map((key) => {
                    return <button
                        className={`
                            _7LettersKeyboardKey
                            ${isSpecialKey(key) ? "specialKey" : ""}
                            ${getLetterState(key)}
                        `}
                        key={key}
                        onClick={() => {
                            if (key === '⌫') {
                                typeBackspace()
                                return
                            }
                            if (key === 'ENTER') {
                                submitCurrentGuess()
                            }
                            typeLetter(key)
                        }}
                    >
                        {key}
                    </button>
                })}
                {rowNum === 1 && <div className="keyboard-spacer" />}
            </div>
        })}
    </div>

    // ── Render: snackbar ─────────────────────────────────────────────

    const snackbar = <div
        className='_7LettersSnackbar'
    >
        {snackbarMessage}
    </div>

    // ── Render: tutorial overlay ─────────────────────────────────────

    function dismissTutorial() {
        window.localStorage.setItem(tutorialStorageKey, 'true')
        setShowTutorial(false)
    }

    const tutorialView = showTutorial ? <div
        className='_7LettersTutorialOverlay'
        onClick={dismissTutorial}
    >
        <div
            className='_7LettersTutorialModal'
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className='_7LettersTutorialCloseButton'
                onClick={dismissTutorial}
            >
                ✕
            </button>
            <div className='_7LettersTutorialTitle'>
                How to Play
            </div>
            <div className='_7LettersTutorialSubtitle'>
                Guess the 7-letter word in 7 tries.
            </div>
            <div className='_7LettersTutorialSection'>
                <div className='_7LettersTutorialExample'>
                    <div className='_7LettersTutorialRow'>
                        <div className='_7LettersTutorialSlot exact'>S</div>
                        <div className='_7LettersTutorialSlot'>C</div>
                        <div className='_7LettersTutorialSlot'>O</div>
                        <div className='_7LettersTutorialSlot'>R</div>
                        <div className='_7LettersTutorialSlot'>I</div>
                        <div className='_7LettersTutorialSlot'>N</div>
                        <div className='_7LettersTutorialSlot'>G</div>
                    </div>
                </div>
                <div className='_7LettersTutorialLabel'>
                    <strong>S</strong> is in the correct position.
                </div>
            </div>
            <div className='_7LettersTutorialSection'>
                <div className='_7LettersTutorialExample'>
                    <div className='_7LettersTutorialRow'>
                        <div className='_7LettersTutorialSlot'>B</div>
                        <div className='_7LettersTutorialSlot misplaced'>A</div>
                        <div className='_7LettersTutorialSlot'>N</div>
                        <div className='_7LettersTutorialSlot'>A</div>
                        <div className='_7LettersTutorialSlot'>N</div>
                        <div className='_7LettersTutorialSlot'>A</div>
                        <div className='_7LettersTutorialSlot'>S</div>
                    </div>
                </div>
                <div className='_7LettersTutorialLabel'>
                    <strong>A</strong> is in the word but in the wrong position.
                </div>
            </div>
            <div className='_7LettersTutorialSection'>
                <div className='_7LettersTutorialExample'>
                    <div className='_7LettersTutorialRow'>
                        <div className='_7LettersTutorialSlot'>H</div>
                        <div className='_7LettersTutorialSlot'>E</div>
                        <div className='_7LettersTutorialSlot'>L</div>
                        <div className='_7LettersTutorialSlot wrong'>P</div>
                        <div className='_7LettersTutorialSlot'>I</div>
                        <div className='_7LettersTutorialSlot'>N</div>
                        <div className='_7LettersTutorialSlot'>G</div>
                    </div>
                </div>
                <div className='_7LettersTutorialLabel'>
                    <strong>P</strong> is not in the word.
                </div>
            </div>
        </div>
    </div> : null

    // ── Render: result overlay ───────────────────────────────────────

    const resultView = showResult ? <div
        className='_7LettersResultOverlay'
        onClick={() => setShowResult(false)}
    >
        <div
            className='_7LettersResultModal'
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className='_7LettersResultCloseButton'
                onClick={() => setShowResult(false)}
            >
                ✕
            </button>
            <div className='_7LettersResultTitle'>
                {isSolved ? 'You Won!' : 'You Lost'}
            </div>
            <div className='_7LettersResultAnswer'>
                The answer was: <strong>{wordOfTheDay}</strong>
            </div>
            <div className='_7LettersResultPlayAgain'>
                Come back tomorrow for a new puzzle!
            </div>
        </div>
    </div> : null

    // ── Render: top-level assembly ───────────────────────────────────

    let content = <div
        className='_7LettersContent'
        onKeyDown={(e) => handleKeyDown(e)}
    >
        {header}
        {guessRows}
        {keyboard}
        {snackbarMessage ? snackbar : null}
        {resultView}
        {tutorialView}
    </div>

    return content;
}