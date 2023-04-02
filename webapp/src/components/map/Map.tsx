import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import { useRef } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import L, { LeafletMouseEvent } from 'leaflet';

export default function Map(props : any): JSX.Element {
    let map = useRef(null);
    if (props.map !== undefined) {
        map = props.map;
    }

    return <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        < GetCenter />
       </MapContainer>;
}

export function GetCenter() {
    const map = useLeafletContext().map;
    navigator.geolocation.getCurrentPosition((pos) => {
            let position : [number, number] = [pos.coords.latitude, pos.coords.longitude];
            map.panTo(position, {animate: true});
        }
    );
    
    return null;
}

export function SingleMarker(props : any) {
    props.map.on("click", (e : LeafletMouseEvent) => {
        if (props.marker == null) {
            props.marker = new L.Marker(e.latlng);
            props.marker.addTo(props.map);
        } else {
            props.marker.setLatLng(e.latlng);
        }
        (document.getElementById("latitude") as HTMLInputElement).value = e.latlng.lat.toPrecision(4).toString();
        (document.getElementById("latitude") as HTMLInputElement).value = e.latlng.lng.toPrecision(4).toString();
    });
    return null;
}