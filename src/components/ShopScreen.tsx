import type { AppScreen } from './BottomNav';
import { GEM_PACKS } from '../lib/shopCatalog';
import type { ResourceBalances } from '../lib/resourcesApi';

type ShopScreenProps = {
  onBack: () => void;
  onNavigate: (screen: AppScreen) => void;
  resources: ResourceBalances | null;
};

export function ShopScreen({ onBack, onNavigate, resources }: ShopScreenProps) {
  return (
    <section className="screen-shell shop-screen">
      <header className="screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Back to home">‹</button>
        <div><span className="eyebrow">TREASURE STORE</span><h2>Shop</h2><p>Choose your resources. Purchases are always verified server-side.</p></div>
        <div className="header-spacer" />
      </header>
      <div className="shop-balance" aria-label="Gem balance"><span>◇</span><strong>{resources?.gems.toLocaleString() ?? '—'}</strong><small>Gems available</small></div>
      <div className="shop-section"><div className="shop-section-title"><span>GEM PACKS</span><small>One-time purchases</small></div><div className="shop-grid">{GEM_PACKS.map((pack) => <article className={`shop-card${pack.featured ? ' featured' : ''}`} key={pack.productId}><div className="shop-card-icon">◇</div><div className="shop-card-copy"><strong>{pack.title}</strong><span>+{pack.gems.toLocaleString()} Gems</span></div>{pack.featured && <b className="shop-badge">BEST VALUE</b>}<button className="shop-buy" disabled title="Billing provider integration is the next server validation gate">{pack.price}</button></article>)}</div></div>
      <div className="shop-trust"><strong>🔒 Server-verified economy</strong><span>The client never grants Gems. A future purchase flow will verify the provider transaction, grant once, and reconcile refunds or voids.</span></div>
      <button className="shop-secondary" onClick={() => onNavigate('home')}>Back to adventure</button>
    </section>
  );
}
