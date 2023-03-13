import Map from "../../components/map/Map";
import "./addLandmark.css";
import { useState } from "react";

export default function Landmarks() {


    return <div className="myLandmarksContainer">
                <div className="landMarkTitle">
                    <h1>Add a landmark</h1>
                </div>
                <Map clickableSingleMarker={true}/>
                <form method = "post" className ="addLandmarkForm" onSubmit={submit}>
                    <p>
                        <label htmlFor="name">Name</label>
                    </p>
                    <p>
                        <input type="text" name="name" id="name" required />
                    </p>
                    <p>
                        <label htmlFor="description">Description</label>
                    </p>
                    <p>
                        <textarea name="description" id="description" required />
                    </p>
                    <button>Add the landmark</button>
                </form>
            </div>
    
}