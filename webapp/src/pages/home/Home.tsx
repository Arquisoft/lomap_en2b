import {useEffect, useState} from "react";
import "../../map/stylesheets/home.css";
import "./home.css"
import {useSession} from "@inrupt/solid-ui-react";
import {Landmark} from "../../shared/shareddtypes";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import { getLandmarksPOD } from "../../solidHelper/solidLandmarkManagement";
import markerIcon from "leaflet/dist/images/marker-icon.png"
import { Icon } from "leaflet";
import {makeRequest} from "../../axios";

function Home(): JSX.Element {
    const {session} = useSession();
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);
    const [generatedLandmarks, setGeneratedLandmarks] = useState<JSX.Element[]>([]);

    useEffect( () => { 
        if (session.info.webId !== undefined && session.info.webId !== "") {
            makeRequest.post("/users/",{solidURL: session.info.webId});
        }
        doGetLandmarks();

        async function getLandmarks(){
            let fetchedLandmarks : Landmark[] | undefined = await getLandmarksPOD(session.info.webId);
            if (fetchedLandmarks === undefined) return null;
            console.log(session.info.webId);
            setLandmarks(fetchedLandmarks);
        }

        async function doGetLandmarks() {
            await getLandmarks();
            let array : JSX.Element[] = [];
            landmarks.forEach(landmark => {
                let element =  <Marker position={[landmark.latitude, landmark.longitude]} icon={new Icon({iconUrl: markerIcon})}>
                        <Popup>
                                {landmark.name} - {landmark.category}
                        </Popup>
                    </Marker>;
                array.push(element);
                console.log(array);
                }
            );
            
            setGeneratedLandmarks(array);
            }
        doGetLandmarks();
    }, [session.info.webId, landmarks]);

    return (
        <div className="homeContainer">
            <h1>Home</h1>
            <MapContainer center={[50.847, 4.357]} zoom={13}
                          scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { generatedLandmarks }
            </MapContainer>;
        </div>
    );
}

export default Home;