import { clsx } from "clsx";

export default function Guess(props) {
    const { word, guess, isGuessed } = props;
    const wordLetters = word.toLowerCase().split("");
    const guessLetters = guess.toLowerCase().split("");

    const colors = Array(word.length).fill("#323232"); // default background
    const usedLetterCount = {}; // to track how many times a letter has been matched

    // First pass: correct letters (green)
    wordLetters.forEach((letter, i) => {
        if (guessLetters[i] === letter) {
            colors[i] = "#48a02d"; // green
            usedLetterCount[letter] = (usedLetterCount[letter] || 0) + 1;
        }
    });

    // Build frequency map for target word
    const wordFreq = {};
    wordLetters.forEach((l) => {
        wordFreq[l] = (wordFreq[l] || 0) + 1;
    });

    // Second pass: misplaced letters (yellow)
    wordLetters.forEach((letter, i) => {
        const gLetter = guessLetters[i];
        if (
            gLetter !== letter &&
            wordFreq[gLetter] &&
            (usedLetterCount[gLetter] || 0) < wordFreq[gLetter]
        ) {
            colors[i] = "#FCBA29"; // yellow
            usedLetterCount[gLetter] = (usedLetterCount[gLetter] || 0) + 1;
        }
    });

    const letterElements = Array(word.length).fill(null).map((_, index) => {
        const guessLetter = guess[index] || "";

        const bgColor = clsx({
            "letter-chips": true,
            "animated": isGuessed,
        });

        return (
            <span
                key={index}
                className={bgColor}
                style={{
                    animationDelay: `${index * 0.2}s`,
                    "--new-color": colors[index],
                }}
            >
                {guessLetter}
            </span>
        );
    });

    return <>{letterElements}</>;
}
