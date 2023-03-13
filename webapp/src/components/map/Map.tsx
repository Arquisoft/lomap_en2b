import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import L from 'leaflet';
import React from 'react';

export default class Map extends React.Component {

    private clickableSingleMarker : boolean;

    constructor(props : any, clickableSingleMarker? : boolean) {
        super(props);
        this.clickableSingleMarker = (clickableSingleMarker == undefined) ? false : clickableSingleMarker;
    }

    render() {
        let marker : L.Marker;
        let clickableSingleMarker : boolean = this.clickableSingleMarker;

        function AddSingleMarker() {
            const map = useMapEvents({
                click: (e) => {
                    if (!clickableSingleMarker) {
                        map.removeLayer(marker);
                    }
                    const { lat, lng } = e.latlng;
                    marker = L.marker([lat, lng]).addTo(map);
                    clickableSingleMarker = false;
                }
            });
            return null;
        }

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
            <AddSingleMarker />
            </MapContainer>

    }
}