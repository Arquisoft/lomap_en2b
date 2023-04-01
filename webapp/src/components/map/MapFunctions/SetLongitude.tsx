import { useLeafletContext } from "@react-leaflet/core";
import { LatLng } from "leaflet";

export default function SetLongitude(newLongitude : number) {
    const map = useLeafletContext().map;
    let currentPos : LatLng = map.getCenter();
    map.panTo([currentPos.lng, newLongitude]);
    return null;
}