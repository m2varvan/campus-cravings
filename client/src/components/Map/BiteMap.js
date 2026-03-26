import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import RestaurantDetails from "../Restaurant/RestaurantDetails";

// deleting default marker icons to nicer looking marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const BiteMap = ({ uuid }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedRestaurant, setClickedRestaurant] = useState(null);

  const mapCenter = [43.4723, -80.5373];
  const defaultZoom = 17;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/map/restaurants", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(
          "An error occurred while loading the map data. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return <div className="bitemap-message error">{error}</div>;
  }

  if (loading) {
    return (
      <div className="bitemap-message loading">Loading interactive map...</div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="bitemap-message empty">
        No restaurants available in this area right now.
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.lat, restaurant.lng]}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              <span style={{ fontWeight: "bold" }}>{restaurant.name}</span>
            </Tooltip>

            <Popup>
              <div className="restaurant-popup">
                <h4>{restaurant.name}</h4>

                <button
                  onClick={() => {
                    setClickedRestaurant(restaurant.id);
                  }}
                  style={{
                    cursor: "pointer",
                    padding: "5px 10px",
                    background: "#ffd700",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  View Full Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Dialog to open Restaurant Details */}
      <RestaurantDetails
        restaurant_id={clickedRestaurant}
        open={!!clickedRestaurant}
        handleClose={() => setClickedRestaurant(null)}
        uuid={uuid}
      />
    </div>
  );
};

export default BiteMap;
