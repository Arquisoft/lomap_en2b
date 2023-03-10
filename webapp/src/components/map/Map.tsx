import React from 'react';
import { Landmark } from '../../shared/shareddtypes';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';

class MapMarker extends React.Component {

    private mark : Landmark;

    constructor(props : any, mark : Landmark) {
        super(props);
        this.mark = mark;
    }
    
    render() {
        <Marker position = {[this.mark.longitude, this.mark.latitude]}>
            <Popup>
                {this.mark.name} - 
                {this.mark.category}
            </Popup>
        </Marker>
    }
}

export default function Map() {
    return <MapContainer center={[50.847, 4.357]} zoom={12} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            </MapContainer>
}