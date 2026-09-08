import { ScreenShell } from './ScreenShell';
import type { AppScreen } from './BottomNav';

type WorldMapScreenProps = { currentLevel: number; completedLevels: number[]; onBack: () => void; onNavigate: (screen: AppScreen) => void; onPlay: (level: number) => void };
type Zone = { name: string; range: [number, number]; icon: string; description: string };
const zones: Zone[] = [
  { name: 'Coral Garden', range: [1, 20], icon: '✦', description: 'Discover the first treasures.' },
  { name: 'Sunken Ruins', range: [21, 40], icon: '◇', description: 'Ancient secrets below the reef.' },
  { name: 'Pirate Wreck', range: [41, 60], icon: '⚓', description: 'Follow the lost pirate trail.' },
  { name: 'Crystal Reef', range: [61, 80], icon: '✧', description: 'Enter the glowing deep.' },
  { name: 'Lost Treasure', range: [81, 100], icon: '♛', description: 'The final treasure awaits.' },
];

export function WorldMapScreen({ currentLevel, completedLevels, onBack, onPlay }: WorldMapScreenProps) {
  const completed = new Set(completedLevels);
  return <ScreenShell title="World Map" subtitle="Five zones. One treasure adventure." onBack={onBack}>
    <div className="world-map">
      {zones.map((zone, index) => {
        const unlocked = currentLevel >= zone.range[0];
        const zoneCompleted = zone.range.every((_, i) => completed.has(zone.range[0] + i));
        const active = unlocked && !zoneCompleted;
        const levelToPlay = zoneCompleted ? zone.range[1] : Math.max(zone.range[0], Math.min(currentLevel, zone.range[1]));
        const doneCount = zone.range.filter((level) => completed.has(level)).length;
        const percent = (doneCount / (zone.range[1] - zone.range[0] + 1)) * 100;
        return <article key={zone.name} className={`zone-card${active ? ' active' : ''}${unlocked ? '' : ' locked'}${zoneCompleted ? ' completed' : ''}`}>
          <div className="zone-marker"><span>{unlocked ? zone.icon : '🔒'}</span></div>
          <div className="zone-content">
            <div className="zone-top"><span className="zone-number">ZONE {index + 1}</span><strong>{zone.range[0]}–{zone.range[1]}</strong></div>
            <h3>{zone.name}</h3><p>{zone.description}</p>
            <div className="zone-progress"><span><i style={{ width: `${percent}%` }} /></span><small>{zoneCompleted ? 'Complete' : unlocked ? `${doneCount}/${zone.range[1] - zone.range[0] + 1} complete` : 'Locked'}</small></div>
            {unlocked && <button className="zone-button" onClick={() => onPlay(levelToPlay)}>{active ? `Play level ${levelToPlay}` : 'Replay finale'}</button>}
          </div>
        </article>;
      })}
    </div>
    <div className="map-note"><strong>Progression serveur</strong><span>Only levels completed by the authenticated player unlock the next progression step.</span></div>
  </ScreenShell>;
}
