import type { ReactNode } from 'react';

type ScreenShellProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
};

export function ScreenShell({ title, subtitle, onBack, children }: ScreenShellProps) {
  return (
    <section className="screen-shell">
      <header className="screen-header">
        {onBack ? <button className="icon-button" onClick={onBack} aria-label="Back">‹</button> : <span className="header-spacer" />}
        <div>
          <span className="eyebrow">COLOR TREASURE</span>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <span className="header-spacer" />
      </header>
      {children}
    </section>
  );
}
