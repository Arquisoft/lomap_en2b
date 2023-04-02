import Map from "../../components/map/Map";
import "./addLandmark.css";
import { useRef, useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { LatLng } from "leaflet";

export default function Landmarks() {

    const [coords, setCoords] = useState([0,0]);
    const setCoordinates = () => {
        let latitude : number | undefined = parseFloat((document.getElementById("latitude") as HTMLInputElement).value);
        let longitude : number | undefined = parseFloat((document.getElementById("longitude") as HTMLInputElement).value);
        setCoords([latitude, longitude]);
        (map.current as L.Map).panTo([latitude, longitude]);
    }
    const submit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let name : string | undefined = (document.getElementById("name") as HTMLInputElement).value;
        let category : string | undefined = (document.getElementById("category") as HTMLInputElement)?.value;
        let latitude : number | undefined = parseFloat((document.getElementById("latitude") as HTMLInputElement).value);
        let longitude : number | undefined = parseFloat((document.getElementById("longitude") as HTMLInputElement).value);
        let obj = {
            name : name,
            category : category,
            latitude : latitude,
            longitude : longitude
        };

        // Here goes the access to SOLID
        // Currently waiting to add a standard
    };

    const map = useRef<L.Map>(null);
    const marker = useRef<L.Marker>(null);

    (map.current as L.Map).on("click", function(e) {
        let currentMap = (map.current as L.Map);
        let latLng : LatLng = currentMap.getCenter();
        (document.getElementById("latitude") as HTMLInputElement).value = latLng.lat.toString();
        (document.getElementById("longitude") as HTMLInputElement).value = latLng.lng.toString();
        (marker.current as L.Marker).setLatLng(e.latlng);
    });

    (map.current as L.Map).on("load", function() {
        (marker.current as L.Marker).addTo(map.current as L.Map);
    })

    return <Grid container>
            <Grid item xs = {12}>
            <Typography variant="h1" component="h1" >Add a landmark</Typography>
            </Grid>
            <Grid item xs = {4}>
                <form method = "post" className ="addLandmarkForm" onSubmit={submit}>
                    <Grid container spacing={{ md: 3 }}>
                        <Grid item xs = {12}>
                            <TextField name = "name" id = "name" label="Name of the landmark" />
                        </Grid>
                        <Grid item xs = {12}>
                            <TextField name = "category" id = "category" label="Category of the landmark" />
                        </Grid>
                        <Grid item xs = {12}>
                            <TextField name = "latitude" 
                                id = "latitude" label="Latitude" />
                        </Grid>
                        <Grid item xs = {12}>
                        <TextField name = "longitude" 
                                id = "longitude" label="longitude" />
                        </Grid>
                        <Grid item xs = {5} justifyContent={"flex-start"}>
                            <Button variant = "contained" onClick = {() => {setCoordinates(); debugger;}}>Search coordinates</Button>
                        </Grid>                        
                        <Grid item xs = {8} justifyContent={"flex-end"}>
                            <Button variant = "contained">Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs = {8}>
                <Map map={map} />
            </Grid>
        </Grid>
        ;
}