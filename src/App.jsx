import { useState, useCallback, useEffect, useRef } from 'react';
import Map from './components/Map';
import Controls from './components/Controls';
import Result from './components/Result';
import WeatherBadges from './components/WeatherBadges';
import Warning from './components/Warning';
import { estimate, SPEEDS } from './utils/estimate';
import { fetchWeather, computeWindFactor, computeWaveFactor, isDangerous } from './utils/weather';
import './App.css';

export default function App() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [activity, setActivity] = useState('kayak');
  const [speedMode, setSpeedMode] = useState('slow');
  const [customSpeed, setCustomSpeed] = useState(5);
  const [currentMode, setCurrentMode] = useState('none');
  const [customCurrentPct, setCustomCurrentPct] = useState(0);
  const [flyTo, setFlyTo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!start || !end) { setWeather(null); return; }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const midLat = (start[0] + end[0]) / 2;
    const midLon = (start[1] + end[1]) / 2;

    setWeatherLoading(true);
    setWeatherError(null);

    fetchWeather(midLat, midLon, controller.signal)
      .then((data) => { setWeather(data); setWeatherLoading(false); })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setWeatherError('Weather data unavailable');
        setWeatherLoading(false);
      });
  }, [start, end]);

  const handleChange = useCallback((field, value) => {
    if (field === 'activity') setActivity(value);
    if (field === 'speedMode') setSpeedMode(value);
    if (field === 'customSpeed') setCustomSpeed(value);
    if (field === 'currentMode') setCurrentMode(value);
    if (field === 'customCurrentPct') setCustomCurrentPct(value);
  }, []);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return alert('Geolocation not available');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setStart(pos);
        setFlyTo(pos);
      },
      () => alert('Could not get your location')
    );
  }, []);

  const handleReset = useCallback(() => {
    setStart(null);
    setEnd(null);
    setFlyTo(null);
    setWeather(null);
    setWeatherError(null);
  }, []);

  const baseSpeed =
    speedMode === 'slow' ? SPEEDS[activity].slow :
    speedMode === 'fast' ? SPEEDS[activity].fast :
    parseFloat(customSpeed) || 1;

  const currentFactor =
    currentMode === 'favorable' ? 1.15 :
    currentMode === 'against'   ? 0.85 :
    currentMode === 'custom'    ? 1 + (parseFloat(customCurrentPct) || 0) / 100 :
    1;
  const currentPctDisplay =
    currentMode === 'favorable' ? '+15%' :
    currentMode === 'against'   ? '−15%' :
    currentMode === 'custom'    ? `${parseFloat(customCurrentPct) >= 0 ? '+' : ''}${customCurrentPct}%` :
    null;

  const windFactor = weather && start && end ? computeWindFactor(weather.windSpeed, weather.windDirection, start, end) : 1;
  const waveFactor = weather ? computeWaveFactor(weather.waveHeight) : 1;
  const result = start && end ? estimate(start, end, baseSpeed, currentFactor, windFactor, waveFactor) : null;
  const dangerous = weather ? isDangerous(weather.windSpeed, weather.waveHeight) : false;

  return (
    <div className="app">
      <header className="app-header">
        <h1>VogaVecio</h1>
        <Result result={result} />
        {weatherLoading && <span className="weather-loading">Fetching weather…</span>}
      </header>

      {(weather || weatherError) && (
        <div className="weather-bar">
          {weather && (
            <WeatherBadges
              windSpeed={weather.windSpeed}
              waveHeight={weather.waveHeight}
              effectiveSpeed={result?.effectiveSpeed}
              currentPct={currentPctDisplay}
            />
          )}
          {weatherError && <span className="weather-err">{weatherError}</span>}
        </div>
      )}

      {dangerous && <Warning activity={activity} />}

      <div className="app-body">
        <div className="map-wrap">
          <Map
            start={start}
            end={end}
            onSetStart={setStart}
            onSetEnd={setEnd}
            flyTo={flyTo}
          />
        </div>
        <Controls
          activity={activity}
          speedMode={speedMode}
          customSpeed={customSpeed}
          currentMode={currentMode}
          customCurrentPct={customCurrentPct}
          onChange={handleChange}
          onGeolocate={handleGeolocate}
          onReset={handleReset}
          hasStart={!!start}
          hasEnd={!!end}
        />
      </div>
    </div>
  );
}
