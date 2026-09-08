export type AppScreen = 'home' | 'map' | 'levels' | 'collection' | 'missions' | 'events' | 'shop' | 'game';

type BottomNavProps = { screen: AppScreen; onNavigate: (screen: AppScreen) => void };
const items: Array<{ id: AppScreen; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'map', label: 'Map', icon: '◈' },
  { id: 'levels', label: 'Levels', icon: '◆' },
  { id: 'collection', label: 'Crew', icon: '♢' },
  { id: 'missions', label: 'Missions', icon: '✓' },
  { id: 'shop', label: 'Shop', icon: '◇' },
];
export function BottomNav({ screen, onNavigate }: BottomNavProps) {
  return <nav className="bottom-nav" aria-label="Main navigation">{items.map((item) => <button key={item.id} className={screen === item.id ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(item.id)} aria-current={screen === item.id ? 'page' : undefined}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>;
}
