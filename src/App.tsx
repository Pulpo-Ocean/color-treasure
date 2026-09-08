import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type TileColor = 'coral' | 'sun' | 'lagoon' | 'violet' | 'mint' | 'azure';
type Tile = { id: number; color: TileColor };

const palette: Record<TileColor, string> = {
  coral: '#ff6b6b', sun: '#ffd166', lagoon: '#2ec4b6',
  violet: '#9b5de5', mint: '#80ed99', azure: '#4dabf7',
};

const seed: TileColor[] = [
  'coral','coral','sun','lagoon','lagoon','azure','violet','coral',
  'sun','sun','lagoon','azure','violet','violet','mint','azure',
  'azure','coral','mint','sun','lagoon','lagoon','violet','coral',
  'azure','mint','mint','sun','coral','azure','violet','lagoon',
  'sun','sun','mint','coral','azure','azure','violet','mint',
  'lagoon','coral','sun','mint','violet','azure','lagoon','coral',
  'coral','sun','sun','lagoon','mint','azure','violet','violet',
  'azure','mint','coral','lagoon','sun','azure','lagoon','mint',
];

function App() {
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(20);
  const [tiles, setTiles] = useState<Tile[]>(() => seed.map((color, id) => ({ id, color })));
  const [selected, setSelected] = useState<number | null>(null);

  const groups = useMemo(() => {
    const result = new Map<TileColor, number[]>();
    tiles.forEach((tile, index) => result.set(tile.color, [...(result.get(tile.color) ?? []), index]));
    return result;
  }, [tiles]);

  const resetLevel = () => {
    setMoves(20);
    setTiles(seed.map((color, id) => ({ id, color })));
    setSelected(null);
  };

  const handleTile = (index: number) => {
    if (moves <= 0) return;
    const group = groups.get(tiles[index].color) ?? [];
    if (group.length < 2) return;
    setSelected(index);
    setMoves((value) => value - 1);
    setTiles((current) => current.filter((_, i) => !group.includes(i)));
  };

  const nextLevel = () => {
    setLevel((value) => value + 1);
    resetLevel();
  };

  return (
    <main className="game-shell">
      <header className="hud">
        <div><span className="eyebrow">COLOR TREASURE</span><h1>Coral Garden</h1></div>
        <div className="resource-pill" aria-label="Coins"><span className="coin">◆</span><strong>1,250</strong></div>
      </header>
      <section className="level-card" aria-label="Level information">
        <div><span className="label">LEVEL</span><strong>{level}</strong></div>
        <div className="objective"><span className="shell">◈</span><span>Clear the coral</span></div>
        <div className="moves"><span className="label">MOVES</span><strong>{moves}</strong></div>
      </section>
      <section className="board-wrap" aria-label={`Level ${level} game board`}>
        <div className="board">
          {tiles.map((tile, index) => (
            <button key={tile.id} className={`tile ${selected === index ? 'selected' : ''}`}
              style={{ '--tile-color': palette[tile.color] } as CSSProperties}
              onClick={() => handleTile(index)} aria-label={`Color tile ${tile.color}`}><span /></button>
          ))}
        </div>
      </section>
      <footer className="controls">
        <button className="secondary-button" onClick={resetLevel}>Restart</button>
        <button className="primary-button" onClick={nextLevel}>Next level</button>
      </footer>
      <p className="status">Mobile-first foundation • server-authoritative gameplay connection comes next.</p>
    </main>
  );
}

export default App;
