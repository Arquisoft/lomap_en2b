import {useEffect, useState} from "react";
import "../../map/stylesheets/home.css";
import "./home.css"
import {useSession} from "@inrupt/solid-ui-react";
import {makeRequest} from "../../axios";
import {Landmark} from "../../shared/shareddtypes";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

function Home(): JSX.Element {
    const {session} = useSession();
    const [landmarks, setLandmarks] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (session.info.webId !== undefined && session.info.webId !== "") {
            console.log(session.info.webId);
            makeRequest.post("/users/", {solidURL: session.info.webId});
        }

        async function fetchLandmarks() {
            let landmks: Landmark[] = [];
            makeRequest.post("/main/landmarks/friend", {webId: session.info.webId?.split("#")[0]}).then((res1) => {
                for (let i = 0; i < res1.data.length; i++) {
                    let landmark = new Landmark(res1.data[i].name, res1.data[i].latitude, res1.data[i].longitude, res1.data[i].category);
                    landmks.push(landmark);
                }
                setLandmarks(loadLandmarks(landmks));
            });

        }

        fetchLandmarks();
    }, [session, landmarks, setLandmarks]);

    function loadLandmarks(data: Landmark[]) {
        let results = data.map((landmark) => {
            return (
                <Marker position={[landmark.latitude, landmark.longitude]}>
                    <Popup>
                        <h3>{landmark.name}</h3>

                    </Popup>
                </Marker>
            );
        });

        return results;
    }

    return (
        <div className="homeContainer">
            <h1>Home</h1>
            <MapContainer center={[50.847, 4.357]} zoom={13}
                          scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {landmarks}
            </MapContainer>;
        </div>
    );
}

export default Home;