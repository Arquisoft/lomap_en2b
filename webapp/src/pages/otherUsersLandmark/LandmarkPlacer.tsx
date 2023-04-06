import { Marker, Popup } from "react-leaflet";


export default function LandmarkPlacer(props : any) : JSX.Element {
    let map : L.Map = props.any;
    if (map == undefined || map == null) {
        throw "The map is undefined";
    }

    // TODO: Retrieve all the landmarks. The array that follows is a temporal placeholder.
    let landmarks : any[] = [];
    return <div>
        {
            landmarks.forEach(element => {
                <Marker position={element.position} >
                    <Popup>
                        {element.name}
                    </Popup>
                </Marker>
            })
        }
    </div>
}