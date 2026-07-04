import { SPEEDS } from '../utils/estimate';

const ICONS = {
  kayak: (
    <svg viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="26" rx="26" ry="7" fill="currentColor" opacity="0.85"/>
      <ellipse cx="32" cy="24" rx="7" ry="3.5" fill="white" opacity="0.6"/>
      <line x1="4" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="5" cy="10" rx="4" ry="2" fill="currentColor"/>
      <ellipse cx="59" cy="10" rx="4" ry="2" fill="currentColor"/>
    </svg>
  ),
  sup: (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="36" rx="24" ry="6" fill="currentColor" opacity="0.85"/>
      <circle cx="32" cy="14" r="4" fill="currentColor"/>
      <line x1="32" y1="18" x2="32" y2="30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="23" x2="40" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="30" x2="27" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="32" y1="30" x2="37" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="10" x2="46" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="46.5" cy="37" rx="3" ry="1.5" fill="currentColor" transform="rotate(-15 46.5 37)"/>
    </svg>
  ),
  sandolo: (
    <svg viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28 Q32 36 56 28 L52 20 Q32 16 12 20 Z" fill="currentColor" opacity="0.85"/>
      <path d="M56 28 Q60 22 58 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <line x1="44" y1="8" x2="58" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="58" cy="31" rx="4" ry="1.8" fill="currentColor" transform="rotate(30 58 31)"/>
      <circle cx="30" cy="16" r="3.5" fill="currentColor"/>
      <line x1="30" y1="19" x2="30" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  galea: (
    <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 30 Q32 38 60 30 L56 24 Q32 20 8 24 Z" fill="currentColor" opacity="0.85"/>
      <path d="M60 30 L64 27 L60 24" fill="currentColor" opacity="0.85"/>
      <line x1="28" y1="6" x2="28" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 8 Q40 12 38 22 L28 22 Z" fill="currentColor" opacity="0.5"/>
      <line x1="18" y1="26" x2="10" y2="36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="26" y1="27" x2="18" y2="37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="34" y1="27" x2="26" y2="37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="42" y1="26" x2="34" y2="36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
};

const LABELS = {
  kayak: 'Kayak',
  sup: 'SUP',
  sandolo: 'Sandolo',
  galea: 'Galea',
};

export default function Controls({ activity, speedMode, customSpeed, currentMode, customCurrentPct, onChange, onGeolocate, onReset, hasStart, hasEnd }) {
  const speeds = SPEEDS[activity];

  return (
    <div className="controls">

      {/* Activity — always 4 columns */}
      <div className="control-group">
        <label>Activity</label>
        <div className="activity-grid">
          {Object.keys(ICONS).map((val) => (
            <button
              key={val}
              type="button"
              className={`activity-card ${activity === val ? 'active' : ''}`}
              onClick={() => onChange('activity', val)}
              title={LABELS[val]}
            >
              <span className="activity-icon">{ICONS[val]}</span>
              <span className="activity-label">{LABELS[val]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Speed + Sea Current side by side */}
      <div className="twin-groups">
        <div className="control-group">
          <label>Speed</label>
          <div className="speed-row">
            <button
              type="button"
              className={`speed-btn speed-slow ${speedMode === 'slow' ? 'active' : ''}`}
              onClick={() => onChange('speedMode', 'slow')}
            >
              <span className="speed-btn-name">Slow</span>
              <span className="speed-btn-val">{speeds.slow}</span>
            </button>
            <button
              type="button"
              className={`speed-btn speed-fast ${speedMode === 'fast' ? 'active' : ''}`}
              onClick={() => onChange('speedMode', 'fast')}
            >
              <span className="speed-btn-name">Fast</span>
              <span className="speed-btn-val">{speeds.fast}</span>
            </button>
            <button
              type="button"
              className={`speed-btn speed-custom ${speedMode === 'custom' ? 'active' : ''}`}
              onClick={() => onChange('speedMode', 'custom')}
              title="Custom speed"
            >
              <span className="speed-btn-name">✎</span>
            </button>
          </div>
          {speedMode === 'custom' && (
            <div className="custom-speed-wrap">
              <input
                type="number"
                min="1" max="50" step="0.5"
                value={customSpeed}
                onChange={(e) => onChange('customSpeed', e.target.value)}
                className="custom-speed-input"
                placeholder="km/h"
              />
              <span className="custom-speed-unit">km/h</span>
            </div>
          )}
        </div>

        <div className="control-group">
          <label>Sea Current</label>
          <div className="speed-row">
            <button
              type="button"
              className={`speed-btn current-favorable ${currentMode === 'favorable' ? 'active' : ''}`}
              onClick={() => onChange('currentMode', 'favorable')}
            >
              <span className="speed-btn-name">▲</span>
              <span className="speed-btn-val">+15%</span>
            </button>
            <button
              type="button"
              className={`speed-btn current-none ${currentMode === 'none' ? 'active' : ''}`}
              onClick={() => onChange('currentMode', 'none')}
            >
              <span className="speed-btn-name">–</span>
              <span className="speed-btn-val">none</span>
            </button>
            <button
              type="button"
              className={`speed-btn current-against ${currentMode === 'against' ? 'active' : ''}`}
              onClick={() => onChange('currentMode', 'against')}
            >
              <span className="speed-btn-name">▼</span>
              <span className="speed-btn-val">−15%</span>
            </button>
            <button
              type="button"
              className={`speed-btn speed-custom ${currentMode === 'custom' ? 'active' : ''}`}
              onClick={() => onChange('currentMode', 'custom')}
              title="Custom current"
            >
              <span className="speed-btn-name">✎</span>
            </button>
          </div>
          {currentMode === 'custom' && (
            <div className="custom-speed-wrap">
              <input
                type="number"
                min="-50" max="50" step="1"
                value={customCurrentPct}
                onChange={(e) => onChange('customCurrentPct', e.target.value)}
                className="custom-speed-input"
                placeholder="%"
              />
              <span className="custom-speed-unit">%</span>
            </div>
          )}
        </div>
      </div>

      <div className="control-actions">
        <button onClick={onGeolocate}>My location</button>
        <button onClick={onReset} disabled={!hasStart && !hasEnd} className="btn-reset">New trip</button>
      </div>

      <p className="hint">
        {!hasStart && 'Tap the map to set start point'}
        {hasStart && !hasEnd && 'Tap the map to set end point'}
        {hasStart && hasEnd && 'Route set'}
      </p>
    </div>
  );
}
