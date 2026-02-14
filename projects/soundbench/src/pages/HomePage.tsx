import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="sb-home">
      <h1 className="sb-home__title">SoundBench</h1>
      <p className="sb-home__subtitle">Offline audio processing tools for the browser.</p>

      <div className="sb-home__tools">
        <Link to="/normalizer" className="sb-tool-card" style={{ textDecoration: 'none' }}>
          <div className="sb-tool-card__icon" style={{ background: 'var(--sb-color-norm)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16l6-6 4 4 8-8" />
              <path d="M15 6h5v5" />
            </svg>
          </div>
          <h3 className="sb-tool-card__name">Normalizer</h3>
          <p className="sb-tool-card__desc">Loudness normalization and brickwall limiting. Upload audio, process to LUFS/peak targets, download WAV.</p>
        </Link>
      </div>
    </div>
  );
}
