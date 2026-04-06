import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
const CarMap = ({ cars = [], center }) => {
    const carIcon = (image) =>
  L.icon({
    iconUrl: image,   // 🔥 car image
    iconSize: [40, 40],   // size of image
    iconAnchor: [20, 40], // bottom center
    popupAnchor: [0, -40]
  });
  const carPinIcon = (image) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 60px;
      ">
        
        <!-- Circle Image -->
        <div style="
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          <img 
            src="${image}" 
            style="width:100%; height:100%; object-fit:cover;" 
          />
        </div>

        <!-- Pointer Triangle -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid white;
        "></div>

      </div>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 60], // pointer tip
  });
  const ChangeMapView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center]);

  return null;
};
  return (
   <MapContainer
  center={
    center?.lat && center?.lng
      ? [center.lat, center.lng]
      : [19.0760, 72.8777]
  }
  zoom={13}
  style={{ height: "400px", width: "100%" }}
>
      
      {/* OpenStreetMap Tiles */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

<ChangeMapView center={center} />  {/* 🔥 ADD THIS */}
      {/* Car Markers */}
      {cars && cars.length > 0 && cars.map((car, index) => (
  car.coordinates && (
    <Marker
      key={car._id || index}   // ✅ ADD THIS
      position={[car.coordinates.lat, car.coordinates.lng]}
      icon={carPinIcon(car.image)}
    >
           <Popup>
  <b>{car.brand} {car.model}</b><br />
  📍 {car.location}
</Popup>
          </Marker>
        )
      ))}

    </MapContainer>
  );
};

export default CarMap;