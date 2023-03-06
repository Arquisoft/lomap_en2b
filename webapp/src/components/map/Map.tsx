import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet-css'
import './Map.css';

export default function Map() {
    return <MapContainer center={[50.847, 4.357]} zoom={12} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
}