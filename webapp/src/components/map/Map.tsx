import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import { useRef } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { LatLng } from 'leaflet';

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
        {props.otherComponents}
       </MapContainer>;
}

export function GetCenter(props? : any) {
    const map = useLeafletContext().map;
    navigator.geolocation.getCurrentPosition((pos) => {
            let position : [number, number] = [pos.coords.latitude, pos.coords.longitude];
            map.panTo(position, {animate: true});
            if (props.onCenter != undefined) {
                props.onCenter();
            }
        }
    );
    
    return null;
}