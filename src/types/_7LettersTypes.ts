export interface WordOfTheDayConfirmation {
    wordOfTheDayPresent: boolean;
    date: string;
}
export interface WordOfTheDay {
    wordOfTheDay: string;
    date: string;
}
export type LetterState = "exact" | "misplaced" | "wrong" | null;
export interface GuessSequence {
    date: string;
    guesses: Guess[];
}
export interface Guess {
    letters: GuessLetter[];
    submitted: boolean;
    validWord: boolean | null;
}
export interface GuessLetter {
    letter: string;
    evaluation: LetterState;
}
export type _7LettersAnnotate7LettersGuessSequenceSuccessResponse = {guessSequence: GuessSequence, snackbarMessage: string}
export type _7LettersAnnotate7LettersGuessSequenceErrorResponse = {error: string}