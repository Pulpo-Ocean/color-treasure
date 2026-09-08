import { useMemo, useState } from 'react';
import { ScreenShell } from './ScreenShell';

type LevelSelectProps = { currentLevel: number; completedLevels: number[]; onBack: () => void; onPlay: (level: number) => void };
const zones = ['Coral Garden', 'Sunken Ruins', 'Pirate Wreck', 'Crystal Reef', 'Lost Treasure'];
const objective = (level: number) => level <= 20 ? 'Clear tiles' : level <= 30 ? 'Collect shells' : level <= 40 ? 'Collect shells' : level <= 60 ? 'Break coral' : level <= 70 ? 'Unlock treasure' : level <= 80 ? 'Complete objectives' : 'Rescue creatures';
const obstacles = (level: number) => level <= 10 ? [] : level <= 20 ? ['Ice', 'Locked'] : level <= 25 ? ['Blocker'] : level <= 30 ? ['Chain'] : level <= 40 ? ['Timed bomb'] : level <= 50 ? ['Double blocker'] : level <= 60 ? ['Moving blocker'] : level <= 70 ? ['Treasure lock'] : level <= 80 ? ['Special rules'] : ['Expert chain'];
const difficulty = (level: number) => level <= 5 ? 'Tutorial' : level <= 10 ? 'Easy' : level <= 20 ? 'Easy+' : level <= 40 ? 'Normal' : level <= 60 ? 'Hard' : level <= 80 ? 'Very Hard' : 'Expert';

export function LevelSelectScreen({ currentLevel, completedLevels, onBack, onPlay }: LevelSelectProps) {
  const [zone, setZone] = useState(Math.min(4, Math.max(0, Math.floor((currentLevel - 1) / 20))));
  const [selected, setSelected] = useState(currentLevel);
  const completed = useMemo(() => new Set(completedLevels), [completedLevels]);
  const start = zone * 20 + 1;
  const levels = Array.from({ length: 20 }, (_, i) => start + i);
  const locked = (level: number) => level > currentLevel && !completed.has(level);
  const select = (level: number) => { if (!locked(level)) setSelected(level); };
  return <ScreenShell title="Levels" subtitle="Choose your next treasure challenge." onBack={onBack}>
    <div className="level-select">
      <div className="zone-tabs">{zones.map((name, i) => <button key={name} className={zone === i ? 'selected' : ''} onClick={() => setZone(i)} disabled={i * 20 + 1 > currentLevel && !completed.has(i * 20 + 1)}>{name}</button>)}</div>
      <div className="level-grid">{levels.map(level => <button key={level} className={`level-node${level === selected ? ' selected' : ''}${completed.has(level) ? ' completed' : ''}${locked(level) ? ' locked' : ''}`} onClick={() => select(level)} disabled={locked(level)} aria-label={`Level ${level}${locked(level) ? ', locked' : ''}`}>{locked(level) ? '🔒' : completed.has(level) ? '✓' : level}</button>)}</div>
      <section className="level-intro-card">
        <div className="level-intro-top"><span>LEVEL {selected}</span><b>{difficulty(selected)}</b></div>
        <h3>{objective(selected)}</h3>
        <p>{zones[Math.floor((selected - 1) / 20)]} · {obstacles(selected).length ? obstacles(selected).join(' · ') : 'No obstacles'}</p>
        <div className="intro-stats"><div><small>OBJECTIVE</small><strong>{objective(selected)}</strong></div><div><small>STATUS</small><strong>{completed.has(selected) ? 'Completed' : selected === currentLevel ? 'Next up' : 'Replay'}</strong></div></div>
        <button className="primary-button intro-play" onClick={() => onPlay(selected)}>{completed.has(selected) ? 'Replay level' : 'Play level'}</button>
      </section>
      <p className="level-note">Unlocks and completion status come from server progression. This screen never grants or advances levels locally.</p>
    </div>
  </ScreenShell>;
}
