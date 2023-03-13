import { MapContainer, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import 'leaflet-css'
import './Map.css';
import L, { marker } from 'leaflet';

export default function Map(props : any) : JSX.Element{

    let clickableSingleMarker : boolean = props.clickableSingleMarker
    clickableSingleMarker = (clickableSingleMarker == undefined) ? false : clickableSingleMarker;
    let marker : L.Marker;

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
        </MapContainer>;
}