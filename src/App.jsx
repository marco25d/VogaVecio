import { useState, useCallback, useEffect, useRef } from 'react';
import appLogo from './assets/icon_vogavecio.png';
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
        <img src={appLogo} alt="VogaVecio" className="app-logo" />
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
          {!start && (
            <div className="map-intro">
              <div className="map-intro-header">
                <svg className="map-intro-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#0077cc" strokeWidth="2"/>
                  <line x1="12" y1="11" x2="12" y2="17" stroke="#0077cc" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7.5" r="1.2" fill="#0077cc"/>
                </svg>
              </div>
              <p className="map-intro-it">
                Imposta un punto di <strong>partenza</strong> e di <strong>arrivo</strong> tra due coste
                e scopri quanto tempo ci vuole per effettuare la traversata — calcolato in base
                alle condizioni meteo di <strong>vento</strong> e <strong>moto ondoso</strong>,
                alle <strong>correnti</strong> e alle configurazioni che imposti per il viaggio.
              </p>
              <hr className="map-intro-divider" />
              <p className="map-intro-en">
                Set a <strong>start</strong> and <strong>end</strong> point between two coastlines
                and find out how long the crossing will take — estimated from live <strong>wind</strong> and <strong>wave</strong> conditions,
                <strong> sea current</strong>, and the settings you choose for your trip.
              </p>
              <hr className="map-intro-divider" />
              <p className="map-intro-hint">
                ⚠️ The route is sampled at fixed intervals. Only water segments are counted toward distance and time. Minor inaccuracies near coastlines are expected due to the resolution of the land detection dataset.
              </p>
            </div>
          )}
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
