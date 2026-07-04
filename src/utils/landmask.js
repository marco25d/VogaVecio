let landPolygons = null;
let loadPromise = null;

export function isLoaded() {
  return landPolygons !== null;
}

export function loadLandmask() {
  if (loadPromise) return loadPromise;
  loadPromise = fetch(`${import.meta.env.BASE_URL}ne_50m_land.geojson`)
    .then((r) => r.json())
    .then((data) => {
      landPolygons = data.features.flatMap((f) => {
        const g = f.geometry;
        if (g.type === 'Polygon') return [g.coordinates];
        if (g.type === 'MultiPolygon') return g.coordinates;
        return [];
      });
    });
  return loadPromise;
}

// Ray casting — returns true if point is inside any land polygon
function pointInPolygon(lng, lat, rings) {
  let inside = false;
  for (const ring of rings) {
    const n = ring.length;
    let j = n - 1;
    for (let i = 0; i < n; i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
      j = i;
    }
  }
  return inside;
}

export function isLand(lat, lng) {
  if (!landPolygons) return false;
  for (const poly of landPolygons) {
    if (pointInPolygon(lng, lat, poly)) return true;
  }
  return false;
}

export function classifyRoute(start, end, samples = 60) {
  const points = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const lat = start[0] + (end[0] - start[0]) * t;
    const lng = start[1] + (end[1] - start[1]) * t;
    points.push({ lat, lng, land: isLand(lat, lng) });
  }

  const segments = [];
  let current = { isLand: points[0].land, positions: [[points[0].lat, points[0].lng]] };

  for (let i = 1; i <= samples; i++) {
    const p = points[i];
    if (p.land === current.isLand) {
      current.positions.push([p.lat, p.lng]);
    } else {
      segments.push(current);
      current = { isLand: p.land, positions: [current.positions[current.positions.length - 1], [p.lat, p.lng]] };
    }
  }
  segments.push(current);
  return segments;
}
