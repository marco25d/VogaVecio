export default function Result({ result }) {
  if (!result) return null;
  return (
    <div className="result">
      <span className="result-dist">{result.distanceKm} km</span>
      <span className="result-sep">—</span>
      <span className="result-time">{result.time}</span>
    </div>
  );
}
