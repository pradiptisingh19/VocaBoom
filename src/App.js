import React, { useState, useEffect } from 'react';
import './App.css';

//const WORDS = ['plant', 'train', 'crate', 'flame', 'brush'];
const MAX_ATTEMPTS = 6;

const GuessBox = ({ letter, color }) => (
  <span className="guess-box" style={{ backgroundColor: color }}>
    {letter?.toUpperCase() || ''}
  </span>
);
const GuessRow = ({ word = '', answer }) => {
  const getColor = (letter, index) => {
    if (!answer) return '';
    if (answer[index] === letter) return 'green';
    else if (answer.includes(letter)) return 'gold';
    return 'gray';
  };

  const boxes = word
    ? word.split('').map((char, idx) => (
        <GuessBox key={idx} letter={char} color={getColor(char, idx)} />
      ))
    : Array.from({ length: 5 }).map((_, idx) => (
        <GuessBox key={idx} letter="" color="" />
      ));

  return <div className="guess-row">{boxes}</div>;
};

const Guesses = ({ guesses, answer }) => {
  return (
    <div className="guesses">
      {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
        <GuessRow key={i} word={guesses[i]} answer={answer} />
      ))}
    </div>
  );
};
function App() {
  const [answer, setAnswer] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('https://api.datamuse.com/words?sp=?????&max=1000')
      .then((res) => res.json())
      .then((data) => {
        const wordList = data.map((item) => item.word.toLowerCase());
        const filteredWords = wordList.filter((word) => /^[a-z]{5}$/.test(word));
        const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
        setAnswer(randomWord);
      })
      .catch((err) => {
        console.error('Failed to fetch words:', err);
        setAnswer('plant'); 
      });
  }, []);

  const handleGuess = () => {
    if (input.length !== 5 || gameOver) return;
    const newGuesses = [...guesses, input.toLowerCase()];
    setGuesses(newGuesses);
    setInput('');

    if (input.toLowerCase() === answer) {
      setStatus('You guessed it right! 🎉');
      setGameOver(true);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setStatus(`Game Over! The word was "${answer}"`);
      setGameOver(true);
    }
  };

  return (
    <div className="game-container">
      <h1>Guess The Word!</h1>

      <Guesses guesses={guesses} answer={answer} />

      {!gameOver && (
        <div className="input-area">
          <input
            type="text"
            maxLength={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Enter 5-letter word"
          />
          <button onClick={handleGuess}>Guess</button>
        </div>
      )}

      {status && <p className="status">{status}</p>}

      {gameOver && (
        <button className="restart" onClick={() => window.location.reload()}>
          Restart
        </button>
      )}
    </div>
  );
}

export default App;
