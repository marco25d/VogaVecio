import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issue with Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow, iconRetinaUrl: iconUrl });

const startIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'marker-start',
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ start, end, onSetStart, onSetEnd }) {
  useMapEvents({
    click(e) {
      const pos = [e.latlng.lat, e.latlng.lng];
      if (!start) onSetStart(pos);
      else if (!end) onSetEnd(pos);
    },
  });
  return null;
}

function FlyTo({ center }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Map({ start, end, onSetStart, onSetEnd, flyTo }) {
  return (
    <MapContainer
      center={[41.9, 12.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler start={start} end={end} onSetStart={onSetStart} onSetEnd={onSetEnd} />
      {flyTo && <FlyTo center={flyTo} />}
      {start && <Marker position={start} icon={startIcon} />}
      {end && <Marker position={end} icon={endIcon} />}
      {start && end && <Polyline positions={[start, end]} color="#0077cc" weight={3} dashArray="6 4" />}
    </MapContainer>
  );
}
