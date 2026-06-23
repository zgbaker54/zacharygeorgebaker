import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import {GetWordOfTheDay} from './utils/utils'
import { Box, Button } from '@mui/material';
import './styles/Global.css';


export default function Gallery7LettersContent(): React.ReactElement {

    const numberOfGuesses = 7
    const numberOfLetters = 7

    interface GuessSequence {
        date: string;
        guesses: Guess[];
    }
    interface Guess {
        letters: string[];
        submitted: boolean;
        validWord: boolean | null;
    }

    let [wordOfTheDay, setWordOfTheDay] = useState<string | null>(null)
    let [currentDay, setCurrentDay] = useState<string | null>(null)
    let [errorMessage, setErrorMessage] = useState<string | null>(null)
    let [guessSequence, setGuessSequence] = useState<GuessSequence | null>(null)
    let [currentGuessNumber, setCurrentGuessNumber] = useState<number | null>(null)

    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    // make page un-scrollable
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

    useEffect(() => {
        GetWordOfTheDay().then(
            (result) => {
                setWordOfTheDay(result.wordOfTheDay)
                setCurrentDay(result.date)
            },
            (error) => {
                setErrorMessage(`Error loading Word Of The Day: ${error}`)
            }
        )
    }, [])

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

    useEffect(() => {
        console.log("guessSequence", guessSequence)
        if (guessSequence === null) { return }
        if (currentDay === null) { return }
        storeGuessSequence(currentDay)
        // get current guess number
        if (guessSequence.guesses.length === 0) {
            initGuessInSequence()
            return
        }
        if (guessSequence.guesses.length === numberOfGuesses) {
            // TODO: exit condition for game
            return
        }
        if (guessSequence.guesses[guessSequence.guesses.length - 1]?.submitted === false) {
            setCurrentGuessNumber(guessSequence.guesses.length - 1)
            return
        }
        initGuessInSequence()
    }, [guessSequence])

    function getGuessSequenceKey(date: string): string {
        return `7LettersGuessSequence-${currentDay}`
    }
    
    function storeGuessSequence(date: string) {
        if (guessSequence !== null) {
            window.localStorage.setItem(getGuessSequenceKey(date), JSON.stringify(guessSequence))
        }
    }

    function retrieveGuessSequence(date: string): GuessSequence | null {
        const guessSequenceString = window.localStorage.getItem(getGuessSequenceKey(date))
        if (!guessSequenceString) { return null }
        return JSON.parse(guessSequenceString) as GuessSequence

    }

    function resetGuessSequence() {
        if (currentDay === null) { return }
        setGuessSequence({
            date: currentDay,
            guesses: [],
        })
    }

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

    function typeLetter(letter: string) {
        if (guessSequence === null) { return }
        if (currentGuessNumber === null) { return }
        if (letter.length !== 1) { return }
        let newGuessSequence = structuredClone(guessSequence)
        const currentGuessLetters = newGuessSequence.guesses[currentGuessNumber]?.letters
        if (!currentGuessLetters) { return }
        if (currentGuessLetters.length >= numberOfLetters) { return }
        currentGuessLetters.push(letter)
        setGuessSequence(newGuessSequence)
    }

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

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Backspace") {
            typeBackspace()

        } else if (/^[a-zA-Z]$/.test(e.key)) {
            typeLetter(e.key)
        }
    }

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

    const guessRows = <div
        className='_7LettersGuessRows'
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e)}
    >
        {Array.from({ length: numberOfGuesses }).map((_, guessNumber) => {
            return <div
                className='_7LettersGuessRow'
                key={`7LettersGuessRow${guessNumber}`}
            >
                {Array.from({ length: numberOfLetters}).map((_, letterNumber) => {
                    return <div
                        className={`
                            _7LettersGuessSlot
                            ${currentGuessNumber === guessNumber ? "_7LettersGuessSlotActive" : ""}
                            ${(currentGuessNumber ? currentGuessNumber : 0) < guessNumber ? "_7LettersGuessSlotInactive" : ""}
                        `}
                        key={`7LettersGuessSlot${letterNumber}`}
                    >
                        {guessSequence?.guesses[guessNumber]?.letters[letterNumber]?.toUpperCase()}
                    </div>
                })}
            </div>
        })}
    </div>
    
    const header = <div className='_7LettersHeader'>
        HEADER
        <button
            onClick={() => {
                submitCurrentGuess()
            }}
        >
            SUMBIT
        </button>
        <div>
            {wordOfTheDay}
        </div>
        <div>
            {currentDay}
        </div>
        <div>
            {JSON.stringify(guessSequence)}
        </div>
        <button
            onClick={() => {
                resetGuessSequence()
            }}
        >
            reset guess sequence
        </button>
    </div>

    const keyboardRow1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    const keyboardRow2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    const keyboardRow3 = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];

    const isSpecialKey = (key: string) => key === 'ENTER' || key === '⌫';

    const keyboard = <div className='_7LettersKeyboardDiv'>
        {[keyboardRow1, keyboardRow2, keyboardRow3].map((keyboardRow, rowNum) => {
            return <div
                className={`_7LettersKeyboardRow row${rowNum}`}
                key={rowNum}
            >
                {rowNum === 1 && <div className="keyboard-spacer" />}
                {keyboardRow.map((key) => {
                    return <button
                        className={`_7LettersKeyboardKey ${isSpecialKey(key) ? "specialKey" : ""}`}
                        key={key}
                        onClick={() => {
                            if (key === '⌫') {
                                typeBackspace()
                                return
                            }
                            if (key === 'ENTER') {
                                // TODO: handle submission
                            }
                            typeLetter(key)
                        }}
                    >
                        {key}
                    </button>
                })}
            </div>
        })}
    </div>

    let content = <div className='_7LettersContent'>
        {header}
        {guessRows}
        {keyboard}
    </div>

    return content;
}