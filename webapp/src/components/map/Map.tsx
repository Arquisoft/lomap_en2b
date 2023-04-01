import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import { useRef } from 'react';
import GetCenter from './MapFunctions/GetCenter';

export default function Map(props : any): JSX.Element {
    let map = useRef(null)
    if (props.map !== undefined) {
        map = props.map;
    }

    return <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GetCenter />
        {props.otherComponents}
       </MapContainer>;
}   