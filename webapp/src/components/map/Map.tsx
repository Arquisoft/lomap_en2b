import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import React from 'react';
import L from 'leaflet';

function GetCenter() {
    const map = useMap();
    navigator.geolocation.getCurrentPosition((pos) => {
        let position : [number, number] = [pos.coords.latitude, pos.coords.longitude];
        map.panTo(position, {animate: true});
    }
    );
    return null;
}

function AddSingleMark(singleMarker : boolean) {
    if (singleMarker) {
        const map = useMapEvents({
            click: (e) => {
              const { lat, lng } = e.latlng;
              L.marker([lat, lng]).addTo(map);
            }
          });
    }
    return null;
  }

export default function Map ({clickableSingleMarker}: {clickableSingleMarker? : boolean}){

    clickableSingleMarker = (clickableSingleMarker == undefined) ? false : clickableSingleMarker;
    return <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GetCenter />
        <AddSingleMark singleMarker={clickableSingleMarker} />
        </MapContainer>;
}