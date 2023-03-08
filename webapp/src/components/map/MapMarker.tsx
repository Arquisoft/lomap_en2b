import React from "react";
import {Marker, Popup} from "react-leaflet"

export default class MapMarker extends React.Component {

    private position : [number, number] = [0,0];
    private text : string;

    constructor(props : any, coordinates : [number, number], text : string) {
        super(props);
        this.position = coordinates;
        this.text = text;
    }
    
    render() {
        <Marker position = {this.position}>
            <Popup>
                {this.text}
            </Popup>
        </Marker>
    }
}