import React from "react";
import {Marker, Popup} from "react-leaflet"
import { Landmark } from "../../shared/shareddtypes";

export default class MapMarker extends React.Component {

    private mark : Landmark;

    constructor(props : any, mark : Landmark) {
        super(props);
        this.mark = mark;
    }
    
    render() {
        <Marker position = {[this.mark.longitude, this.mark.latitude]}>
            <Popup>
                {this.mark.name}
                <br />
                {this.mark.category}
            </Popup>
        </Marker>
    }
}