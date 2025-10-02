import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./components/header/header";
import "./PlayGallow.css";

const API_URL = import.meta.env.VITE_API_URL;

const PlayGallow = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [wordGuess, setWordGuess] = useState("");
  const [revealedTips, setRevealedTips] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [results, setResults] = useState({ correct: 0, wrong: 0 });

  const maxWrong = 6;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch(`${API_URL}/gallow/${id}`);
      const data = await res.json();
      setGame(data);
      setStartTime(Date.now());
    };
    fetchGame();
  }, [id]);

  const handleLetterGuess = (letter) => {
    if (isFinished || guessedLetters.includes(letter)) return;
    setGuessedLetters([...guessedLetters, letter]);

    if (!game.keyword.toLowerCase().includes(letter.toLowerCase())) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const handleWordGuess = () => {
    if (isFinished) return;
    if (wordGuess.trim().toLowerCase() === game.keyword.toLowerCase()) {
      setWon(true);
      setIsFinished(true);
    } else {
      setWrongGuesses(maxWrong);
      setWon(false);
      setIsFinished(true);
    }
  };

  const handleTip = () => {
    if (revealedTips.length >= 2) return;
    const nextTip = revealedTips.length === 0 ? game.tip1 : game.tip2;
    setRevealedTips([...revealedTips, nextTip]);
    setWrongGuesses(wrongGuesses + 1);
  };

  const handleFinish = async () => {
    const endTime = Date.now();
    const totalSeconds = Math.floor((endTime - startTime) / 1000);
    setDuration(totalSeconds);

    const correct = won ? 1 : 0;
    const wrong = won ? 0 : 1;
    setResults({ correct, wrong });

    const token = localStorage.getItem("token");
    if (token) {
      const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const user = await profileRes.json();
        setIsLoggedIn(true);

        await fetch(`${API_URL}/gallow/ranking/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            correctAnswers: correct,
            timeInSeconds: totalSeconds,
          }),
        });
      }
    }

    const rankingRes = await fetch(`${API_URL}/gallow/ranking/${id}`);
    const rankingData = await rankingRes.json();
    setRanking(rankingData);

    setIsFinished(true);
  };

  const restartGame = () => {
    if (!game) return;
    setIsFinished(false);
    setWon(false);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setWordGuess("");
    setRevealedTips([]);
    setResults({ correct: 0, wrong: 0 });
    setStartTime(Date.now());
  };

  if (!game) return <p>Carregando jogo...</p>;

  const displayWord = game.keyword
    .split("")
    .map((letter) =>
      guessedLetters.includes(letter.toLowerCase()) || (isFinished && won)
        ? letter
        : "_"
    )
    .join(" ");

  const isLost = wrongGuesses >= maxWrong;

  return (
    <>
      <Header />
      <div className="play-gallow-container">
        <h2>{game.title}</h2>

        {!isFinished ? (
          <div className="gallow-game">
            <div className="gallow-drawing">
              <p>Tentativas: {wrongGuesses}/{maxWrong}</p>
              <div className="stick-figure">
                {wrongGuesses > 0 && <div className="head">⚪</div>}
                {wrongGuesses > 1 && <div className="body">│</div>}
                {wrongGuesses > 2 && <div className="left-arm">╱</div>}
                {wrongGuesses > 3 && <div className="right-arm">╲</div>}
                {wrongGuesses > 4 && <div className="left-leg">╱</div>}
                {wrongGuesses > 5 && <div className="right-leg">╲</div>}
              </div>
            </div>

            <div className="word-display">{displayWord}</div>

            <div className="letter-inputs">
              {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => (
                <button
                  key={l}
                  disabled={guessedLetters.includes(l) || isFinished}
                  onClick={() => handleLetterGuess(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="word-guess">
              <input
                type="text"
                placeholder="Chutar palavra inteira"
                value={wordGuess}
                onChange={(e) => setWordGuess(e.target.value)}
              />
              <button onClick={handleWordGuess}>Chutar</button>
            </div>

            <div className="tips">
              {revealedTips.map((tip, i) => (
                <p key={i}>Dica {i + 1}: {tip}</p>
              ))}
              {revealedTips.length < 2 && (
                <button onClick={handleTip}>Pedir Dica</button>
              )}
            </div>

            {(isLost || displayWord.replace(/ /g, "") === game.keyword) && (
              <div className="end-game">
                <h3>{isLost ? "💀 Você perdeu!" : "🎉 Você venceu!"}</h3>
                <button className="button-finish" onClick={handleFinish}>
                  Finalizar
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="results">
            <h2>Fim do Jogo!</h2>
            <p>✅ Acertos: {results.correct}</p>
            <p>❌ Respostas Erradas: {results.wrong}</p>
            <p>⏱️ Tempo: {formatTime(duration)}</p>
            <button className="button-again" onClick={restartGame}>
              🔄 Jogar Novamente
            </button>

            <div className="ranking">
              <h3>🏆 Ranking</h3>
              {!isLoggedIn && (
                <p style={{ color: "#b00", fontWeight: "bold" }}>
                  🔐 Faça login para aparecer no ranking!
                </p>
              )}
              {ranking.length === 0 ? (
                <p>Nenhum jogador ainda.</p>
              ) : (
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Usuário</th>
                      <th>Acertos</th>
                      <th>Tempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((entry, index) => (
                      <tr key={index}>
                        <td>{index + 1}º</td>
                        <td>{entry.username}</td>
                        <td>{entry.correctanswers}</td>
                        <td>{formatTime(entry.timeinseconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlayGallow;

