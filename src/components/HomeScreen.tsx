import type { AppScreen } from './BottomNav';
import type { ProgressionState } from '../lib/progressionApi';
import type { ResourceBalances } from '../lib/resourcesApi';

type HomeScreenProps = {
  onNavigate: (screen: AppScreen) => void;
  onPlay: () => void;
  progression: ProgressionState | null;
  resources: ResourceBalances | null;
};

export function HomeScreen({ onNavigate, onPlay, progression, resources }: HomeScreenProps) {
  const currentLevel = progression?.current_level ?? 1;
  const highestCompleted = progression?.highest_completed ?? 0;
  const progressPercent = Math.min(100, (highestCompleted / 100) * 100);
  const value = (key: keyof ResourceBalances) => resources ? resources[key].toLocaleString() : '—';
  return (
    <section className="home-screen">
      <header className="resource-strip" aria-label="Your resources">
        <div><span>◆</span><strong>{value('coins')}</strong><small>Coins</small></div>
        <div><span>◇</span><strong>{value('gems')}</strong><small>Gems</small></div>
        <div><span>♥</span><strong>{value('lives')}</strong><small>Lives</small></div>
      </header>
      <div className="home-hero">
        <span className="eyebrow">CORAL GARDEN</span>
        <h1>Ready for treasure?</h1>
        <p>Clear colorful groups, unlock the reef and rescue your crew.</p>
        <button className="primary-button hero-button" onClick={onPlay}>Play level {currentLevel}</button>
      </div>
      <div className="home-grid">
        <button className="feature-card" onClick={() => onNavigate('map')}><span className="feature-icon">◈</span><strong>World Map</strong><small>Explore 5 zones</small></button>
        <button className="feature-card" onClick={() => onNavigate('collection')}><span className="feature-icon">♢</span><strong>Your Crew</strong><small>Collect sea friends</small></button>
        <button className="feature-card" onClick={() => onNavigate('missions')}><span className="feature-icon">✓</span><strong>Missions</strong><small>Earn daily rewards</small></button>
        <button className="feature-card" onClick={() => onNavigate('events')}><span className="feature-icon">✦</span><strong>Events</strong><small>Limited treasure runs</small></button>
      </div>
      <div className="home-progress">
        <div><span>Adventure progress</span><strong>{highestCompleted} / 100</strong></div>
        <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
      </div>
    </section>
  );
}
