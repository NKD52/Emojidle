import { clsx } from "clsx"


export default function Guess(props){
    
    const letterElements = Array(7).fill(null).map((_, index) => {
        const letter = props.word[index] || "";
        const guessLetter = props.guess[index] || "";
    
        const checkGuess = letter.toLowerCase() === guessLetter.toLowerCase();
        const inWord = props.word.includes(guessLetter);
        
        const bgColor = clsx({
            'guessed-letter': props.isGuessed && checkGuess,
        'in-letter': props.isGuessed && inWord,
        'letter-chips': true,
        'animated': props.isGuessed,
        });
    
        return (
            <span key={index} className={bgColor}>
                {guessLetter}
            </span>
        );
    });
    
    

    return(
        <>
            {letterElements}
        </>        
    )
}