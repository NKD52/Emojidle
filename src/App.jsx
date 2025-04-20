import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import Confetti from "react-confetti";
import Guess from "./Guess";
import puzzle from "./puzzle";
import { words3 } from "../words3";

export default function AssemblyEndgame() {
    const [guesses, setGuesses] = useState([...puzzle.guesses]);
    const [currentGuess, setCurrentGuess] = useState(puzzle.currentGuess);
    const [lost, setLost] = useState(puzzle.lost);
    const [won, setWon] = useState(puzzle.won);
    const [message, setMessage] = useState("");

    const myRef = useRef(null);

    useEffect(() => {
        if (myRef.current) {
            myRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [won]);

    function addGuessLetter(letter) {
        setMessage("");

        if (letter === "↪") {
            if (puzzle.guesses[puzzle.currentGuess].length !== 7) {
                setMessage("Not enough letters");
                return;
            }
            puzzle.handleKeyup({ key: "Enter" });
        } else if (letter === "⌫") {
            puzzle.handleKeyup({ key: "Backspace" });
        } else if (/^[A-Za-z]$/.test(letter)) {
            puzzle.handleKeyup({ key: letter });
        }

        setGuesses([...puzzle.guesses]);
        setCurrentGuess(puzzle.currentGuess);
        setLost(puzzle.lost);
        setWon(puzzle.won);
    }

    function DailyTitle() {
        const [title, setTitle] = useState("Emojidle");
        const [fade, setFade] = useState(false);

        useEffect(() => {
            const alreadyPlayed = puzzle.getDailyWordBoolean();

            if (!alreadyPlayed) {
                const timer1 = setTimeout(() => setFade(true), 5000);
                const timer2 = setTimeout(() => {
                    const newTitle = puzzle.getDailyWordBoolean() ? "Emojidle" : "Daily Word";
                    setTitle(newTitle);
                    setFade(false);
                }, 5500);

                return () => {
                    clearTimeout(timer1);
                    clearTimeout(timer2);
                };
            } else {
                const newTitle = puzzle.getDailyWordBoolean() ? "Emojidle" : "Emojidle";
                setTitle(newTitle);
            }
        }, []);

        return <h1 className={`fade ${fade ? "fade-out" : ""}`} aria-label="Game Title">{title}</h1>;
    }

    useEffect(() => {
        puzzle.init();
        setGuesses([...puzzle.guesses]);
        setCurrentGuess(puzzle.currentGuess);

        const handleKeyupBound = (e) => {
            setMessage("");

            if (e.key === "Enter" && puzzle.guesses[puzzle.currentGuess].length !== 7) {
                if (e) {
                    e.preventDefault();
                    e.target.blur();
                }
                setMessage("Not enough letters");
                return;
            }

            puzzle.handleKeyup(e);
            setGuesses([...puzzle.guesses]);
            setCurrentGuess(puzzle.currentGuess);
            setLost(puzzle.lost);
            setWon(puzzle.won);
        };

        window.addEventListener("keyup", handleKeyupBound);
        return () => window.removeEventListener("keyup", handleKeyupBound);
    }, []);

    const alphabet = "a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.↪.⌫";
    const keyboardElements = alphabet.split('.').map((letter) => (
        <button
            disabled={won || lost}
            className="new-game"
            onClick={() => addGuessLetter(letter)}
            key={letter}
            aria-label={
                letter === "↪"
                    ? "Enter"
                    : letter === "⌫"
                    ? "Backspace"
                    : `Letter ${letter.toUpperCase()}`
            }
        >
            {letter.toUpperCase()}
        </button>
    ));

    const emojiWord = words3.find(
        (item) => item.word.toLowerCase() === puzzle.word.toLowerCase()
    );

    return (
        <main role="main">
            {puzzle.won && <Confetti recycle={false} numberOfPieces={1000} aria-hidden="true" />}

            <header role="banner">
                <div className="headerH1">{DailyTitle()}</div>
                <p className="header-desc">Guess the word within 5 attempts!</p>
                <p className="emoji" aria-label={`Emoji clue: ${emojiWord?.emoji.join(" ")}`}>
                    {emojiWord?.emoji.join(" ")}
                </p>
            </header>

            <section className="guess-comp" aria-label="Guess Grid">
                {guesses.map((_, i) => (
                    <Guess
                        key={i}
                        word={puzzle.word}
                        guess={guesses[i] || ""}
                        isGuessed={i < currentGuess}
                    />
                ))}
            </section>

            {(message||puzzle.lost||puzzle.won) && <footer role="contentinfo">
                {message&&<h1 aria-live="polite">{message}</h1>}
                {puzzle.lost && <h1>You lost, the word was {puzzle.word}</h1>}
                {puzzle.won && <h1>You Won, Champion!</h1>}
            </footer>}

            <section ref={myRef} className="keyboard" aria-label="Virtual Keyboard">
                {keyboardElements}
            </section>

            {(lost || won) && (
                <button
                    className="play-again"
                    onClick={() => {
                        puzzle.init();
                        setGuesses([...puzzle.guesses]);
                        setCurrentGuess(puzzle.currentGuess);
                        setWon(puzzle.won);
                        setLost(puzzle.lost);
                    }}
                    aria-label="Play Again"
                >
                    Play Again
                </button>
            )}
        </main>
    );
}
