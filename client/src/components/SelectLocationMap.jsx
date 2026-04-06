import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";


const ChangeMapView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center); // 🔥 THIS FIXES EVERYTHING
  }, [center]);

  return null;
};
const carIcon = new L.Icon({
  iconUrl: "/car-marker.png", // put image in public folder
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const LocationMarker = ({ setCoordinates, setCity, setAddress }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      // set marker
      setPosition([lat, lng]);

      // save coordinates
      setCoordinates({ lat, lng });

      try {
        // 🔥 Reverse Geocoding (FREE)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();

        // extract city
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "";

        // extract full address
        const address = data.display_name;

        setCity(city);
        setAddress(address);

      } catch (error) {
        console.log("Error fetching location:", error);
      }
    },
  });

  return position ? <Marker position={position} icon={carIcon} /> : null;
};

const SelectLocationMap = ({ setCoordinates, setCity, setAddress, mapCenter }) => {
  return (
    <MapContainer
  key={mapCenter.join(",")} 
       center={mapCenter}
  zoom={13}
  style={{ height: "300px", width: "100%", borderRadius: "10px" }}
>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  {/* 🔥 THIS LINE IS CRITICAL */}
  <ChangeMapView center={mapCenter} />

  <LocationMarker 
    setCoordinates={setCoordinates}
    setCity={setCity}
    setAddress={setAddress}
  />
</MapContainer>
  );
};

export default SelectLocationMap;