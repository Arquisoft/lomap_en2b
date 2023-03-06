import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet-css'
import './Map.css';

export default function Map() {
    return <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[51.505, -0.09]}>
    </Marker>
  </MapContainer>
}