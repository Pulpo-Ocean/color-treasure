import type { ChestReward } from '../lib/chestApi';
import './chest-reward.css';

type Props = { reward: ChestReward; onClose: () => void };

const labels: Record<string, string> = { coins: 'Coins', gems: 'Gems', lives: 'Lives', boosters: 'Boosters', stars: 'Stars', fragments: 'Fragments', character_fragments: 'Character fragments' };

export function ChestRewardOverlay({ reward, onClose }: Props) {
  const label = labels[reward.reward_type] ?? reward.reward_type;
  return <div className="chest-overlay" role="dialog" aria-modal="true" aria-label="Chest reward">
    <div className="chest-card"><div className="chest-icon" aria-hidden="true">🧰</div><span className="eyebrow">TREASURE CHEST</span><h2>Treasure found!</h2><div className="chest-reward"><strong>{reward.amount}</strong><span>{label}</span></div>{reward.character_code && <small>{reward.character_code}</small>}<button className="primary-button" onClick={onClose}>Continue</button></div>
  </div>;
}
