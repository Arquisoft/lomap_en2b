import Map, { SingleMarker } from "../../components/map/Map";
import markerIcon from "leaflet/dist/images/marker-icon.png"
import "./addLandmark.css";
import "../../components/map/stylesheets/addLandmark.css"
import { useRef } from "react";
import { Button, MenuItem, Grid, Input, InputLabel, Select, Typography, FormControl } from "@mui/material";
import React from "react";
import L from "leaflet";
import { LandmarkCategories } from "../../shared/shareddtypes";
import { makeRequest } from "../../axios";
import { useSession } from "@inrupt/solid-ui-react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
export default function AddLandmark() {

    let coords : [number, number] = [0,0];
    const setCoordinates = (latitude : number, longitude : number) => {
        coords = [latitude, longitude];
        (map.current as L.Map).panTo([latitude, longitude]);
        
        // Manual delete to create the effect of moving the marker, 
        // since scoping the variable outside the function and updating it does not seem to work
        let markerNode : ChildNode = (document.querySelector("img[alt='Marker'") as ChildNode);
        if (markerNode) markerNode.remove();
        new L.Marker([latitude, longitude]).setIcon(L.icon({iconUrl: markerIcon})).addTo(map.current as L.Map);
        (document.getElementById("latitude") as HTMLParagraphElement).textContent = latitude.toFixed(3);
        (document.getElementById("longitude") as HTMLParagraphElement).textContent = longitude.toFixed(3);
    }
    const {session} = useSession();

    const submit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Collect everything
        let name : string | undefined = (document.getElementById("name") as HTMLInputElement).value;
        let category : string | undefined = (document.getElementById("category") as HTMLInputElement)?.value;
        let latitude : number = coords[0];
        let longitude : number = coords[1];
        let obj = {
            name : name,
            category : category,
            latitude : latitude,
            longitude : longitude,
            webID: session.info.webId
        };

        await makeRequest.post("/landmarks/", obj);

        // Here goes the access to SOLID
    };

    const map = useRef<L.Map>(null);
    let selectItems : JSX.Element[] = Object.keys(LandmarkCategories).map(key => {
        return <MenuItem value = {key}>{key}</MenuItem>;
    });

    const MapEvents = () => {
        useMapEvents(
            {
                click(e) {
                    setCoordinates(e.latlng.lat, e.latlng.lng);
                }
            }
        );
        return null;
    }

    return <Grid container>
            <Grid item xs = {12}>
            <Typography variant="h1" component="h1" textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >Add a landmark</Typography>
            </Grid>
            <Grid item xs = {4} className = "leftPane">
                <form method = "post" className ="addLandmarkForm" onSubmit={submit}>
                    <Grid container spacing={3} rowGap={8}>
                        <FormControl fullWidth>
                            <InputLabel style={{color:"#FFF"}}>Name of the landmark</InputLabel>
                            <Input id = "name" name = "name" style={{color:"#FFF"}}></Input>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="category" style={{color:"#FFF"}}>Category of the landmark</InputLabel>
                            <Select id = "category" name = "category" defaultValue={"Other"} label="Category of the landmark" style={{color:"#FFF"}}>
                                {selectItems}
                            </Select>
                        </FormControl>
                        <Grid container rowGap = {4}>
                            <FormControl fullWidth>
                                <Typography style={{color:"#FFF"}}>Latitude:  </Typography>
                                <Typography id = "latitude" style={{color:"#FFF"}}/>
                            </FormControl>
                            <FormControl fullWidth>
                                <Typography style={{color:"#FFF"}}>Longitude:  </Typography>
                                <Typography id = "longitude" style={{color:"#FFF"}}/>
                            </FormControl>                  
                        </Grid>
                        <Grid item justifyContent="flex-end">
                            <Button type = "submit" variant = "contained" >Save new landmark</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs = {8} className = "rightPane  ">
                <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />
            </MapContainer>;
            </Grid>
        </Grid>
        ;
}