import { clsx } from "clsx";

export default function Guess(props) {
    const letterElements = Array(7).fill(null).map((_, index) => {
        const letter = props.word[index] || "";
        const guessLetter = props.guess[index] || "";

        const checkGuess = letter.toLowerCase() === guessLetter.toLowerCase();
        const inWord = props.word.includes(guessLetter);

        
        const newColor = checkGuess 
            ? "#48a02d"   
            : inWord 
            ? "#FCBA29"   
            : "#323232";  

        const bgColor = clsx({
            "letter-chips": true,
            "animated": props.isGuessed, 
        });

        return (
            <span 
                key={index} 
                className={bgColor} 
                style={{ 
                    animationDelay: `${index * 0.2}s`, 
                    "--new-color": newColor 
                }}
            >
                {guessLetter}
            </span>
        );
    });

    return <>{letterElements}</>;
}
