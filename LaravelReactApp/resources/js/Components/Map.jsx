import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Circle } from 'react-leaflet';

const Map = ({ posts }) => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef();
  const markerClusterGroup = useRef(L.markerClusterGroup());

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        () => {
          setUserLocation([44.3167, 23.8000]); // Craiova
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.addLayer(markerClusterGroup.current);
    }
  }, [posts]);

  useEffect(() => {
    if (posts.length > 0) {
      markerClusterGroup.current.clearLayers();
      posts.forEach((post) => {
        if (post.latitude && post.longitude) {
          const marker = L.marker([post.latitude, post.longitude]);
          marker.bindPopup(
            `<strong>${post.user?.name}</strong><br />${post.content}`
          );
          markerClusterGroup.current.addLayer(marker);
        }
      });
    }
  }, [posts]);

  if (!userLocation) return <div>Can't get your location...</div>;

  return (
    <MapContainer
      center={userLocation}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <Circle
        center={userLocation}
        radius={4000}
        color="blue"
        fillColor="blue"
        fillOpacity={0.2}
      />
    </MapContainer>
  );
};

export default Map;