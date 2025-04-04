import { useEffect, useState,useRef } from "react";
import { clsx } from "clsx";
import Confetti from "react-confetti";
import Guess from "./Guess";
import puzzle from "./puzzle";
import { words2 } from "../word2";
import { words3 } from "../words3";

import { emojiList } from "../emoji";

export default function AssemblyEndgame() {
    const [guesses, setGuesses] = useState([...puzzle.guesses]);
    const [currentGuess, setCurrentGuess] = useState(puzzle.currentGuess);
    const [lost, setLost] = useState(puzzle.lost)
    const [won, setWon] = useState(puzzle.won)

    const myRef = useRef(null)
    
    useEffect(()=>{
        if(myRef.current){
            myRef.current.scrollIntoView({ behavior: "smooth" });
        }
    },[won])
   
    function addGuessLetter(letter){
        if (puzzle.guesses[puzzle.currentGuess].length < 7 && /^[A-Za-z]$/.test(letter)) {
            puzzle.guesses[puzzle.currentGuess] += letter.toLowerCase();
            setGuesses([...puzzle.guesses]);
        setCurrentGuess(puzzle.currentGuess);
        setLost(puzzle.lost);
        setWon(puzzle.won)
        }
    }

    useEffect(() => {
        puzzle.init();
        setGuesses([...puzzle.guesses]);
        setCurrentGuess(puzzle.currentGuess);

        const handleKeyupBound = (e) => {
            puzzle.handleKeyup(e);
            setGuesses([...puzzle.guesses]); 
        
            setCurrentGuess(puzzle.currentGuess);
            setLost(puzzle.lost);
        setWon(puzzle.won)

        
        };

        window.addEventListener("keyup", handleKeyupBound);
        return () => window.removeEventListener("keyup", handleKeyupBound);
    }, []);


    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const keyboardElements = alphabet.split("").map((letter) => (
        <button className="new-game" onClick = {()=>{addGuessLetter(letter)}} key={letter}>{letter.toUpperCase()}</button>
    ));
    return (
        <main>
            {
                puzzle.won && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }
            <header>
                <h1>Emojidle</h1>
                <p>Guess the word within 5 attempts!</p>
                <p className="emoji">{    words3.find(item => item.word.toLowerCase() === puzzle.word.toLowerCase())?.emoji.join(" ") || "Word not found"
                }</p>
            </header>

            <section className="guess-comp">
                {guesses.map((_, i) => (
                    <Guess key={i} word={puzzle.word} guess={guesses[i] || ""} isGuessed={i < currentGuess} />
                ))}
            </section>

            <footer>
                <h1>{puzzle.lost ? `You lost, the word was ${puzzle.word}` : ""}</h1>
                <h1>{puzzle.won ? "You Won, Champion!" : ""}</h1>
                
            </footer>
            <section ref = {myRef} className="keyboard">{keyboardElements} </section>
            {(lost||won) && <button className="play-again" onClick={() => { puzzle.init(); setGuesses([...puzzle.guesses]); setCurrentGuess(puzzle.currentGuess), setWon(puzzle.won),setLost(puzzle.lost) }}>Play Again</button>}

            {/* <p>Word: {puzzle.word}</p>
            <p>Guesses: {JSON.stringify(guesses)}</p> */}
            
        </main>
    );
}
