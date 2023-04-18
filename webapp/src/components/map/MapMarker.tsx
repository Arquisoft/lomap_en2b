import React from 'react';
import {Landmark} from '../../shared/shareddtypes';
import {Marker, Popup} from 'react-leaflet';

class MapMarker extends React.Component {

    private mark : Landmark;

    constructor(props : any, mark : Landmark) {
        super(props);
        this.mark = mark;
    }
    
    render() {
        return <Marker position = {[this.mark.longitude, this.mark.latitude]}>
            <Popup>
                {this.mark.name} - 
                {this.mark.category}
            </Popup>
        </Marker>
    }
}