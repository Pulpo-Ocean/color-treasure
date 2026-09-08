import { ScreenShell } from './ScreenShell';
import type { AppScreen } from './BottomNav';

type PlaceholderScreenProps = { title: string; subtitle: string; onBack: () => void; onNavigate: (screen: AppScreen) => void };

export function PlaceholderScreen({ title, subtitle, onBack, onNavigate }: PlaceholderScreenProps) {
  return (
    <ScreenShell title={title} subtitle={subtitle} onBack={onBack}>
      <div className="feature-panel">
        <div className="feature-panel-icon">✦</div>
        <h3>Coming to the reef</h3>
        <p>This screen is intentionally scaffolded in this lot. Its server-backed system will be implemented in its dedicated lot.</p>
        <button className="primary-button" onClick={() => onNavigate('home')}>Back to Home</button>
      </div>
    </ScreenShell>
  );
}
