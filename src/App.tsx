import { useCallback, useEffect, useState } from 'react';
import { applyMove, startLevel, type GameState } from './lib/gameApi';
import './styles.css';

type TileColor = 'coral' | 'sun' | 'lagoon' | 'violet' | 'mint' | 'azure';

const palette: Record<TileColor, string> = {
  coral: '#ff6b6b',
  sun: '#ffd166',
  lagoon: '#2ec4b6',
  violet: '#9b5de5',
  mint: '#80ed99',
  azure: '#4dabf7',
};

const colorByValue: Record<number, TileColor> = {
  1: 'coral',
  2: 'sun',
  3: 'lagoon',
  4: 'violet',
  5: 'mint',
  6: 'azure',
};

const EMPTY_BOARD = Array.from({ length: 64 }, () => 0);

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLevel = useCallback(async (levelId: number) => {
    setLoading(true);
    setError(null);
    try {
      const state = await startLevel(levelId);
      setGame(state);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start the level.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLevel(1);
  }, [loadLevel]);

  const handleCell = async (cellIndex: number) => {
    if (!game || busy || game.result !== 'CONTINUE') return;

    setBusy(true);
    setError(null);
    try {
      // Server expects 1-based board cells. The client does not calculate groups,
      // gravity, cascades, objectives or rewards: the authoritative engine does.
      const next = await applyMove(game.session_id, game.move_count + 1, 'clear_group', cellIndex + 1);
      setGame(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Move rejected by the game server.');
    } finally {
      setBusy(false);
    }
  };

  const level = game?.level_id ?? 1;
  const board = game?.board_state?.length === 64 ? game.board_state : EMPTY_BOARD;
  const movesLimit = 20;
  const movesRemaining = Math.max(0, movesLimit - (game?.move_count ?? 0));
  const resultLabel = game?.result === 'WIN' ? 'Treasure secured!' : game?.result === 'FAIL' ? 'Try again' : null;

  return (
    <main className="game-shell">
      <header className="hud">
        <div>
          <span className="eyebrow">COLOR TREASURE</span>
          <h1>Coral Garden</h1>
        </div>
        <div className="resource-pill" aria-label="Coins"><span className="coin">◆</span><strong>1,250</strong></div>
      </header>

      <section className="level-card" aria-label="Level information">
        <div><span className="label">LEVEL</span><strong>{level}</strong></div>
        <div className="objective"><span className="shell">◈</span><span>Clear the coral</span></div>
        <div className="moves"><span className="label">MOVES</span><strong>{movesRemaining}</strong></div>
      </section>

      <section className="board-wrap" aria-label={`Level ${level} game board`} aria-busy={loading || busy}>
        {loading ? (
          <div className="game-message">Loading level…</div>
        ) : (
          <div className="board">
            {board.map((value, index) => {
              const color = colorByValue[value];
              return (
                <button
                  key={index}
                  className="tile"
                  style={{ '--tile-color': color ? palette[color] : 'transparent' } as React.CSSProperties}
                  onClick={() => void handleCell(index)}
                  disabled={busy || !color || game?.result !== 'CONTINUE'}
                  aria-label={color ? `Color tile ${color}, cell ${index + 1}` : `Empty cell ${index + 1}`}
                >
                  <span />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {resultLabel && <div className="result-banner" role="status">{resultLabel}</div>}
      {error && <div className="error-banner" role="alert">{error}</div>}

      <footer className="controls">
        <button className="secondary-button" onClick={() => void loadLevel(level)} disabled={loading || busy}>Restart</button>
        <button className="primary-button" onClick={() => void loadLevel(level + 1)} disabled={loading || busy || game?.result !== 'WIN'}>Next level</button>
      </footer>
      <p className="status">Server-authoritative gameplay • moves, board state, objectives and rewards are validated by Color Treasure.</p>
    </main>
  );
}

export default App;
