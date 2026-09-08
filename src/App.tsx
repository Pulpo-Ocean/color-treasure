import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { applyMove, startLevel, type GameState } from './lib/gameApi';
import './styles.css';

type TileColor = 'coral' | 'sun' | 'lagoon' | 'violet' | 'mint' | 'azure';
const palette: Record<TileColor, string> = { coral: '#ff6b6b', sun: '#ffd166', lagoon: '#2ec4b6', violet: '#9b5de5', mint: '#80ed99', azure: '#4dabf7' };
const colorByValue: Record<number, TileColor> = { 1: 'coral', 2: 'sun', 3: 'lagoon', 4: 'violet', 5: 'mint', 6: 'azure' };
const EMPTY_BOARD = Array.from({ length: 64 }, () => 0);
const OBJECTIVE_LABELS: Record<string, string> = { clear_tiles: 'Clear tiles', collect_shells: 'Collect shells', unlock_treasure: 'Unlock treasure', rescue_creatures: 'Rescue creatures', break_coral: 'Break coral', mixed: 'Complete objectives' };
const OBSTACLE_LABELS: Record<string, string> = { locked_tiles: 'Locked', ice: 'Ice', color_blockers: 'Blocker', chains: 'Chain', timed_bombs: 'Bomb', double_blockers: 'Double blocker', moving_blockers: 'Moving blocker', treasure_locks: 'Treasure lock', expert_chains: 'Expert chain' };

function obstacleAt(state: Record<string, unknown>, cell: number) {
  for (const [type, raw] of Object.entries(state)) {
    if (!Array.isArray(raw)) continue;
    const hit = raw.find((item) => item && typeof item === 'object' && Number((item as Record<string, unknown>).cell) === cell);
    if (hit) return { type, data: hit as Record<string, unknown> };
  }
  return null;
}

function specialAt(specialState: unknown[], cell: number) {
  return specialState.find((item) => item && typeof item === 'object' && Number((item as Record<string, unknown>).cell) === cell) as Record<string, unknown> | undefined;
}

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLevel = useCallback(async (levelId: number) => {
    if (levelId < 1 || levelId > 100) return;
    setLoading(true); setError(null);
    try { setGame(await startLevel(levelId)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to start the level.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadLevel(1); }, [loadLevel]);

  const handleCell = async (cellIndex: number) => {
    if (!game || busy || game.result !== 'CONTINUE') return;
    setBusy(true); setError(null);
    try {
      const special = specialAt(game.special_state, cellIndex + 1);
      setGame(await applyMove(game.session_id, game.move_count + 1, special ? 'activate_special' : 'clear_group', cellIndex + 1));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Move rejected by the game server.'); }
    finally { setBusy(false); }
  };

  const level = game?.level_id ?? 1;
  const board = game?.board_state?.length === 64 ? game.board_state : EMPTY_BOARD;
  const movesRemaining = Math.max(0, (game?.moves_limit ?? 0) - (game?.move_count ?? 0));
  const objectiveLabel = game?.objective ? (OBJECTIVE_LABELS[game.objective] ?? game.objective.replaceAll('_', ' ')) : 'Loading objective';
  const progress = game?.objective_progress ?? 0;
  const target = game?.objective_target;
  const obstacles = game?.obstacle_state ?? {};
  const obstacleCount = useMemo(() => Object.values(obstacles).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : 0), 0), [obstacles]);
  const resultLabel = game?.result === 'WIN' ? 'Treasure secured!' : game?.result === 'FAIL' ? 'Try again' : null;

  return <main className="game-shell">
    <header className="hud"><div><span className="eyebrow">COLOR TREASURE</span><h1>Coral Garden</h1></div><div className="resource-pill" aria-label="Coins"><span className="coin">◆</span><strong>—</strong></div></header>
    <section className="level-card" aria-label="Level information"><div><span className="label">LEVEL</span><strong>{level}</strong></div><div className="objective"><span className="shell">◈</span><span>{objectiveLabel}{target ? ` ${progress}/${target}` : ''}</span></div><div className="moves"><span className="label">MOVES</span><strong>{movesRemaining}</strong></div></section>
    <section className="board-wrap" aria-label={`Level ${level} game board`} aria-busy={loading || busy}>
      {loading ? <div className="game-message">Loading level…</div> : <div className="board">
        {board.map((value, index) => {
          const color = colorByValue[value];
          const obstacle = obstacleAt(obstacles, index + 1);
          const special = specialAt(game?.special_state ?? [], index + 1);
          const specialType = String(special?.type ?? '');
          const obstacleLabel = obstacle ? OBSTACLE_LABELS[obstacle.type] ?? obstacle.type.replaceAll('_', ' ') : '';
          const style = { '--tile-color': color ? palette[color] : 'transparent' } as CSSProperties;
          return <button key={index} className={`tile${obstacle ? ' obstacle' : ''}${special ? ' special' : ''}`} style={style} onClick={() => void handleCell(index)} disabled={busy || !color || game?.result !== 'CONTINUE'} aria-label={`${color ? `Color tile ${color}` : 'Empty cell'}${obstacle ? `, ${obstacleLabel}` : ''}${special ? `, ${specialType}` : ''}, cell ${index + 1}`}>
            <span />{obstacle && <b className="obstacle-badge">{obstacleLabel.slice(0, 1)}</b>}{special && <b className="special-badge">{specialType === 'line' ? '↔' : specialType === 'cross' ? '+' : specialType === 'bomb' ? '✦' : '🌈'}</b>}
          </button>;
        })}
      </div>}
    </section>
    <div className="board-meta"><span>{obstacleCount} obstacle{obstacleCount === 1 ? '' : 's'}</span><span>•</span><span>{game?.special_state?.length ?? 0} special{(game?.special_state?.length ?? 0) === 1 ? '' : 's'}</span></div>
    {resultLabel && <div className="result-banner" role="status">{resultLabel}</div>}
    {error && <div className="error-banner" role="alert">{error}</div>}
    <footer className="controls"><button className="secondary-button" onClick={() => void loadLevel(level)} disabled={loading || busy}>Restart</button><button className="primary-button" onClick={() => void loadLevel(level + 1)} disabled={loading || busy || game?.result !== 'WIN' || level >= 100}>Next level</button></footer>
    <p className="status">Server-authoritative gameplay • board, obstacles, specials, moves, objectives and rewards are validated by Color Treasure.</p>
  </main>;
}
export default App;
