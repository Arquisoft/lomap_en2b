import { useLeafletContext } from "@react-leaflet/core";
import * as L from "leaflet";

export default function SetLatitude(newLatitude : number) {
    const map = useLeafletContext().map;
    let currentPos : L.LatLng = map.getCenter();
    map.panTo([newLatitude, currentPos.lng]);

    // FIXME: https://legacy.reactjs.org/docs/hooks-rules.html
    return null;
}    