import { useEffect, useState } from 'react';
import type { AvailableChest, ChestReward } from '../lib/chestApi';
import { getAvailableChests, openChest } from '../lib/chestApi';
import { ChestRewardOverlay } from './ChestRewardOverlay';

type GameResultOverlayProps = { result: 'WIN' | 'FAIL'; level: number; rewards?: Record<string, unknown>; onRetry: () => void; onNext: () => void; onBack: () => void };

export function GameResultOverlay({ result, level, rewards, onRetry, onNext, onBack }: GameResultOverlayProps) {
  const win = result === 'WIN';
  const coins = typeof rewards?.coins === 'number' ? rewards.coins : null;
  const stars = typeof rewards?.stars === 'number' ? rewards.stars : null;
  const fragments = typeof rewards?.fragments === 'number' ? rewards.fragments : null;
  const [availableChest, setAvailableChest] = useState<AvailableChest | null>(null);
  const [chestReward, setChestReward] = useState<ChestReward | null>(null);
  const [chestBusy, setChestBusy] = useState(false);
  const [chestError, setChestError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!win) return () => { cancelled = true; };
    void getAvailableChests()
      .then((chests) => {
        if (!cancelled) setAvailableChest(chests.find((chest) => chest.chest_code === 'basic_chest') ?? null);
      })
      .catch((cause) => {
        if (!cancelled) setChestError(cause instanceof Error ? cause.message : 'Unable to load treasure chest.');
      });
    return () => { cancelled = true; };
  }, [win, level]);

  const claimChest = async () => {
    if (chestBusy || !availableChest) return;
    setChestBusy(true);
    setChestError(null);
    try {
      const result = await openChest(availableChest.chest_code, availableChest.claim_key);
      setChestReward(result.reward_payload);
      setAvailableChest(null);
    } catch (cause) {
      setChestError(cause instanceof Error ? cause.message : 'Unable to open chest.');
    } finally {
      setChestBusy(false);
    }
  };

  return <div className="result-overlay" role="dialog" aria-modal="true" aria-label={win ? 'Level complete' : 'Level failed'}>
    <div className="result-card">
      <div className="result-orb" aria-hidden="true">{win ? '✦' : '↻'}</div>
      <span className="eyebrow">LEVEL {level}</span>
      <h2>{win ? 'Treasure secured!' : 'Almost there!'}</h2>
      <p>{win ? 'Great dive. Your progress has been saved.' : 'The sea is still waiting. Give it another try.'}</p>
      {win && (coins !== null || stars !== null || fragments !== null) && <div className="reward-row">
        {coins !== null && <div><strong>◆ {coins}</strong><small>Coins</small></div>}
        {stars !== null && <div><strong>★ {stars}</strong><small>Stars</small></div>}
        {fragments !== null && <div><strong>◈ {fragments}</strong><small>Fragments</small></div>}
      </div>}
      {win && availableChest && <>
        <button className="primary-button" onClick={() => void claimChest()} disabled={chestBusy}>
          {chestBusy ? 'Opening…' : 'Open treasure chest'}
        </button>
        {chestError && <div className="error-banner" role="alert">{chestError}</div>}
      </>}
      {win && !availableChest && chestError && <div className="error-banner" role="alert">{chestError}</div>}
      <div className="result-actions">
        {win ? <><button className="primary-button" onClick={onNext} disabled={level >= 100}>Next level</button><button className="secondary-button" onClick={onBack}>Back to levels</button></> : <><button className="primary-button" onClick={onRetry}>Try again</button><button className="secondary-button" onClick={onBack}>Back to levels</button></>}
      </div>
    </div>
    {chestReward && <ChestRewardOverlay reward={chestReward} onClose={() => setChestReward(null)} />}
  </div>;
}
