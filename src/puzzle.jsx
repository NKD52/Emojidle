import { words2 } from "../word2";
import { words3 } from "../words3";


const puzzle = {
    word: "",
    guesses: ["", "", "", "", ""],
    currentGuess: 0,
    won: false,
    lost: false,

    init() {
        const randomIndex = Math.floor(Math.random() * words3.length);
        
        this.word = words3[randomIndex].word;
        this.guesses = ["", "", "", "", ""];
        this.currentGuess = 0;
        this.won = false;
        this.lost = false;
    },

    handleKeyup(e) {

        if (this.won || this.lost) return;

        

        if (e.key === "Enter") {
            if(this.guesses[this.currentGuess].length!=7){
                return
            }
            if (this.guesses[this.currentGuess] === this.word.toLowerCase()) {
                this.won = true;
            }
            this.currentGuess++;
            if (this.currentGuess === 5) {
                this.lost = true;
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
