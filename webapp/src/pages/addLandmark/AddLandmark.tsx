import Map from "../../components/map/Map";
import "./addLandmark.css";

export default function Landmarks() {

    return <div className="myLandmarksContainer">
        <div className="landMarkTitle">
            <h1>Add a landmark</h1>
        </div>
        <Map clickableSingleMarker={true}/>
        <form>
            <p>
                <label htmlFor="description">Description</label>
            </p>
            <p>
                <textarea id="description" required />
            </p>
            <button>Add the landmark</button>
        </form>

    </div>
}