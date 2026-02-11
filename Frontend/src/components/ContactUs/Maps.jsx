import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Maps = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-surface">
      <div className="py-12 px-6 md:px-12">
        <h1 className="text-center text-2xl md:text-4xl lg:text-5xl text-text font-heading font-bold leading-relaxed tracking-wide">Contact</h1>
        <p className="text-center text-text-light mb-8">See The Nearby Clinics and Medical Centers</p>
      </div>
      <div className="w-full max-w-6xl px-6"></div>
      <div className="w-full max-w-6xl mx-6 h-[calc(100vh-200px)] border border-border rounded-2xl overflow-hidden shadow-sm">
        <MapContainer center={[40.7128, -74.006]} zoom={12} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
          <Marker position={[40.73061, -73.935242]}><Popup>Clinic in New York</Popup></Marker>
          <Marker position={[40.712776, -74.005974]}><Popup>Another Clinic</Popup></Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Maps;
