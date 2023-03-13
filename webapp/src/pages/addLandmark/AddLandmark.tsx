import Map from "../../components/map/Map";
import "./addLandmark.css";
import { useState } from "react";

export default function Landmarks() {

    const submit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return <div className="myLandmarksContainer">
                <div className="landMarkTitle">
                    <h1>Add a landmark</h1>
                </div>
                <form method = "post" className ="addLandmarkForm" onSubmit={submit}>
                    <p>
                        <label htmlFor="name">Name</label>
                    </p>
                    <p>
                        <input type="text" name="name" id="name" required />
                    </p>
                    <p>
                        <label htmlFor="category">Category</label>
                    </p>
                    <p>
                        <input type="text" name="category" id="category" required />
                    </p>
                    <p>
                        <label htmlFor="latitude">Latitude</label>
                    </p>
                    <p>
                        <input type="number" name="latitude" id="latitude" required />
                    </p><p>
                        <label htmlFor="longitude">Longitude</label>
                    </p>
                    <p>
                        <input type="number" name="longitude" id="longitude" required />
                    </p>
                    <button>Add the landmark</button>
                </form>
            </div>
    
}