export const SPEEDS = {
  kayak:   { slow: 4, fast: 9 },
  sup:     { slow: 3, fast: 7 },
  sandolo: { slow: 3, fast: 5 },
  galea:   { slow: 7, fast: 12 },
};



export function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

// currentFactor: numeric multiplier, e.g. 1.15 for favorable, 0.85 for against
export function estimate(start, end, speedKmh, currentFactor = 1, windFactor = 1, waveFactor = 1) {
  const distanceKm = haversineKm(start, end);
  const effectiveSpeed = speedKmh * currentFactor * windFactor * waveFactor;
  return {
    distanceKm: distanceKm.toFixed(1),
    time: formatTime(distanceKm / effectiveSpeed),
    effectiveSpeed: Math.round(effectiveSpeed * 10) / 10,
  };
}
