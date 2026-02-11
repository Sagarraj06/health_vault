import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Maps = () => {
  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8">
      {/* Header Section */}
      <div className="py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Nearby <span className="text-primary">Medical Centers</span></h2>
        <p className="text-gray-400 text-sm mt-2">See the nearby clinics and medical centers</p>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-6xl h-[60vh] border border-white/[0.06] rounded-2xl overflow-hidden shadow-lg mb-12">
        <MapContainer
          center={[40.7128, -74.006]} // New York City coordinates
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[40.73061, -73.935242]}>
            <Popup>Clinic in New York</Popup>
          </Marker>
          <Marker position={[40.712776, -74.005974]}>
            <Popup>Another Clinic</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Maps;
