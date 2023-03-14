import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import L from 'leaflet';
import React from 'react';

export default function Map(): JSX.Element {
    function GetCenter() {
        const map = useMap();
        navigator.geolocation.getCurrentPosition((pos) => {
                let position : [number, number] = [pos.coords.latitude, pos.coords.longitude];
                map.panTo(position, {animate: true});
            }
        );
        return null;
    }

    return <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GetCenter />
ç        </MapContainer>;
}   