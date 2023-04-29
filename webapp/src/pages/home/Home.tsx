import {useEffect, useState} from "react";
import "../../map/stylesheets/home.css";
import "./home.css"
import {useSession} from "@inrupt/solid-ui-react";
import {Landmark} from "../../shared/shareddtypes";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import { getLocations } from "../addLandmark/solidLandmarkManagement";
import markerIcon from "leaflet/dist/images/marker-icon.png"
import { Icon } from "leaflet";

function Home(): JSX.Element {
    const {session} = useSession();
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);

    async function getLandmarks() {
        let fetchedLandmarks : Landmark[] | undefined = await getLocations(session.info.webId);
        console.log(fetchedLandmarks);
        if (fetchedLandmarks === undefined) return null;;
    
        await setLandmarks(fetchedLandmarks);
        console.log(landmarks);
    }

    return (
        <div className="homeContainer">
            <h1>Home</h1>
            <MapContainer center={[50.847, 4.357]} zoom={13}
                          scrollWheelZoom={true} whenReady={async () => {
                            await getLandmarks();
                          }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {landmarks.map(landmark => {
                    return <Marker position={[landmark.longitude, landmark.latitude]} icon={new Icon({iconUrl: markerIcon})}>
                            <Popup>
                                    {landmark.name} - {landmark.category}
                            </Popup>
                        </Marker>;
                        }
                    )
                }
            </MapContainer>;
        </div>
    );
}

export default Home;