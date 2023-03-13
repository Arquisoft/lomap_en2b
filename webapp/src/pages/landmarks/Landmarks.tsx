import Map from "../../components/map/Map";
import "./landmarks.css";

export default function Landmarks() {

    return <div className = "myLandmarksContainer">
        <div className = "landMarkTitle"><h1>My landmarks</h1></div>
        
        <Map/>

    </div>
}