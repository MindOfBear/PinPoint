import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Map = ({ posts }) => {
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef();

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

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      if (userLocation) {
        const circle = L.circle(userLocation, {
          radius: 3000,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.2,
        }).addTo(map);

        return () => {
          map.removeLayer(circle);
        };
      }
    }, [userLocation, posts, map]);

    return null;
  };

  if (!userLocation) return <div className="text-white">Can't get your location...</div>;

  return (
    <MapContainer
      center={userLocation}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapEvents />

      {posts.map((post) =>
        post.latitude && post.longitude ? (
          <Marker key={post.id} position={[post.latitude, post.longitude]}>
            <Popup>
              <strong>{post.user?.name}</strong> <br />
              {post.content}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default Map;