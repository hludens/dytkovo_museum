import type { Game } from "./Types";
interface GameGridProps {
  games: Game[]|undefined
  setGameName: (key: string) => void;
}

function GameGrid( {games,setGameName}: GameGridProps) {

  function handleClick(game: Game) {
    setGameName(game.url);
  }
  if(!games) return null;
  return (
    <section className="game-grid">
      {games.map((game, idx) => (
        <a
          key={idx}
          onClick={() => handleClick(game)}
          className="game-card"
        >
          <img src={game.screenshot} alt={game.title} />
          <div className="overlay">
            <span>{game.title}</span>
          </div>
        </a>
      ))}
    </section>
  );
}

export default GameGrid; 