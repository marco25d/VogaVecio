function bearing([lat1, lon1], [lat2, lon2]) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export async function fetchWeather(lat, lon, signal) {
  const [windRes, marineRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`,
      { signal }
    ),
    fetch(
      `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height`,
      { signal }
    ).catch(() => null),
  ]);

  if (!windRes.ok) throw new Error('Weather unavailable');
  const windData = await windRes.json();
  const windSpeed = windData.current.wind_speed_10m;
  const windDirection = windData.current.wind_direction_10m;

  let waveHeight = null;
  if (marineRes?.ok) {
    const marineData = await marineRes.json();
    waveHeight = marineData.current?.wave_height ?? null;
  }

  return { windSpeed, windDirection, waveHeight };
}

// Levels: label, upper bound, color
const WIND_THRESHOLDS = [
  { label: 'Very low', max: 10,       color: '#27ae60' },
  { label: 'Low',      max: 20,       color: '#8bc34a' },
  { label: 'Medium',   max: 35,       color: '#ff9800' },
  { label: 'High',     max: 50,       color: '#f44336' },
  { label: 'Extreme',  max: Infinity, color: '#b71c1c' },
];

const WAVE_THRESHOLDS = [
  { label: 'Very low', max: 0.3,      color: '#27ae60' },
  { label: 'Low',      max: 0.75,     color: '#8bc34a' },
  { label: 'Medium',   max: 1.5,      color: '#ff9800' },
  { label: 'High',     max: 2.5,      color: '#f44336' },
  { label: 'Extreme',  max: Infinity, color: '#b71c1c' },
];

export function classifyWind(speedKmh) {
  return WIND_THRESHOLDS.find((t) => speedKmh < t.max);
}

export function classifyWave(heightM) {
  return WAVE_THRESHOLDS.find((t) => heightM < t.max);
}

const DANGER = new Set(['High', 'Extreme']);

export function isDangerous(windSpeed, waveHeight) {
  if (DANGER.has(classifyWind(windSpeed)?.label)) return true;
  if (waveHeight != null && DANGER.has(classifyWave(waveHeight)?.label)) return true;
  return false;
}

// Returns a speed multiplier based on wind angle relative to route direction.
export function computeWindFactor(windSpeed, windDirection, start, end) {
  const routeBearing = bearing(start, end);
  const windToward = (windDirection + 180) % 360;
  let diff = Math.abs(routeBearing - windToward);
  if (diff > 180) diff = 360 - diff;
  // cos: 1 = tailwind, -1 = headwind
  const cosAngle = Math.cos((diff * Math.PI) / 180);
  const influence = Math.min(windSpeed / 40, 1);
  return 1 + cosAngle * influence * (cosAngle > 0 ? 0.15 : 0.25);
}

// Returns a speed multiplier based on wave height.
export function computeWaveFactor(waveHeight) {
  if (waveHeight == null) return 1;
  return Math.max(0.6, 1 - (waveHeight / 4) * 0.4);
}
