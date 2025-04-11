import { words2 } from "../word2";
import { words3 } from "../words3";

const puzzle = {
    word: "",
    guesses: ["", "", "", "", ""],
    currentGuess: 0,
    won: false,
    lost: false,

    getPlayedWords() {
        return JSON.parse(localStorage.getItem("playedWords") || "[]");
    },

    addPlayedWord(word) {
        const current = this.getPlayedWords();
        localStorage.setItem("playedWords", JSON.stringify([...new Set([...current, word])]));
    },

    resetPlayedWords() {
        localStorage.removeItem("playedWords");
    },

    init() {
        const played = this.getPlayedWords();
        const availableWords = words3.filter(item => !played.includes(item.word.toLowerCase()));

        if (availableWords.length === 0) {
            this.resetPlayedWords();
            this.word = "emojidy"; // Fallback word
            console.log("No more words left. Resetting progress.");
        } else {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            this.word = availableWords[randomIndex].word;
        }

        this.guesses = ["", "", "", "", ""];
        this.currentGuess = 0;
        this.won = false;
        this.lost = false;
    },

    handleKeyup(e) {
        if (this.won || this.lost) return;

        if (e.key === "Enter") {
            if (this.guesses[this.currentGuess].length != 7) {
                return;
            }

            if (this.guesses[this.currentGuess] === this.word.toLowerCase()) {
                this.won = true;
                this.addPlayedWord(this.word.toLowerCase());
            }

            this.currentGuess++;

            if (this.currentGuess === 5 && !this.won) {
                this.lost = true;
                this.addPlayedWord(this.word.toLowerCase());
            }

            return;
        }

        if (e.key === "Backspace") {
            this.guesses[this.currentGuess] = this.guesses[this.currentGuess].slice(0, -1);
            return;
        }

        if (this.guesses[this.currentGuess].length < 7 && /^[A-Za-z]$/.test(e.key)) {
            this.guesses[this.currentGuess] += e.key.toLowerCase();
        }
    },
};

export default puzzle;
