import { useMap } from "react-leaflet";

export default function GetCenter() {
    const map = useMap();
    navigator.geolocation.getCurrentPosition((pos) => {
            let position : [number, number] = [pos.coords.latitude, pos.coords.longitude];
            map.panTo(position, {animate: true});
        }
    );
    return null;
}