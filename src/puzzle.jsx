import { words3 } from "../words3";

if (!sessionStorage.getItem("alreadyLoaded")) {
    localStorage.removeItem("playedWords"); 
    sessionStorage.setItem("alreadyLoaded", "true");
}

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

    getDailyWordDate() {
        const dateStr = new Date().toISOString().split('T')[0];
        return JSON.parse(localStorage.getItem("dailyWordDate") || `"${dateStr}"`);
    },

    getDailyWordBoolean() {
        return JSON.parse(localStorage.getItem("dailyCompleted") || "false");
    },

    getDateBasedNumber() {
        const dateStr = new Date().toISOString().split('T')[0];
        console.log("Date string:", dateStr);

        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
            hash = (hash << 5) - hash + dateStr.charCodeAt(i);
            hash |= 0; // 32-bit
        }

        const normalized = Math.abs(hash % 1000) / 1000;
        return Math.floor(normalized * words3.length);
    },

    setDailyWordDate() {
        const currentDate = new Date().toISOString().split('T')[0];
        localStorage.setItem("dailyWordDate", currentDate);
    },

    setDailyWordBooleanTrue() {
        localStorage.setItem("dailyCompleted", "true");
    },

    setDailyWordBooleanFalse() {
        localStorage.setItem("dailyCompleted", "false");
    },

    init() {
        const todayDate = new Date().toISOString().split('T')[0];
        const savedDate = this.getDailyWordDate();
        const played = this.getPlayedWords();
        const availableWords = words3.filter(item => !played.includes(item.word.toLowerCase()));

        const needsDaily = savedDate !== todayDate;

        if (needsDaily) {
            this.setDailyWordBooleanFalse();
        }

        if (needsDaily || !this.getDailyWordBoolean()) {
            const num = this.getDateBasedNumber();
            console.log("Daily word number:", num);
            this.word = words3[num]?.word || "emojidy";
            this.guesses = ["", "", "", "", ""];
            this.currentGuess = 0;
            this.won = false;
            this.lost = false;

            this.setDailyWordDate();
            return;
        }

        // Fallback non-daily logic
        if (availableWords.length === 0) {
            this.resetPlayedWords();
            this.word = "emojidy";
            console.log("No more words left. Resetting progress.");
            location.reload();
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
            if (this.guesses[this.currentGuess].length != 7) return;

            if (this.guesses[this.currentGuess] === this.word.toLowerCase()) {
                this.won = true;
                this.addPlayedWord(this.word.toLowerCase());
                if (!this.getDailyWordBoolean()) {
                    this.setDailyWordBooleanTrue();
                }
            }

            this.currentGuess++;

            if (this.currentGuess === 5 && !this.won) {
                this.lost = true;
                this.addPlayedWord(this.word.toLowerCase());
                if (!this.getDailyWordBoolean()) {
                    this.setDailyWordBooleanTrue();
                }
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
