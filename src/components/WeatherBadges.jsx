import { classifyWind, classifyWave } from '../utils/weather';

export default function WeatherBadges({ windSpeed, waveHeight, effectiveSpeed, currentPct }) {
  const wind = classifyWind(windSpeed);
  const wave = waveHeight != null ? classifyWave(waveHeight) : null;

  return (
    <div className="weather-badges">
      <div className="weather-badge">
        <span className="badge-icon">💨</span>
        <span className="badge-value">{Math.round(windSpeed)} km/h</span>
        <span className="badge-level" style={{ background: wind.color }}>{wind.label}</span>
      </div>
      {wave && (
        <div className="weather-badge">
          <span className="badge-icon">🌊</span>
          <span className="badge-value">{waveHeight.toFixed(1)} m</span>
          <span className="badge-level" style={{ background: wave.color }}>{wave.label}</span>
        </div>
      )}
      {currentPct && (
        <div className="weather-badge">
          <span className="badge-icon">🌊</span>
          <span className="badge-value">current</span>
          <span className="badge-level" style={{ background: currentPct.startsWith('+') ? '#27ae60' : '#e53935' }}>{currentPct}</span>
        </div>
      )}
      {effectiveSpeed != null && (
        <div className="weather-badge">
          <span className="badge-icon">🚣</span>
          <span className="badge-value">{effectiveSpeed} km/h</span>
          <span className="badge-level" style={{ background: '#0077cc' }}>effective</span>
        </div>
      )}
    </div>
  );
}
