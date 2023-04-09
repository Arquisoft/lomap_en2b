import Map from "../../components/map/Map";
import markerIcon from "leaflet/dist/images/marker-icon.png"
import "./addLandmark.css";
import "../../components/map/stylesheets/addLandmark.css"
import { useRef, useState } from "react";
import { Button, MenuItem, Grid, Input, InputLabel, Select, Typography, FormControl } from "@mui/material";
import React from "react";
import L from "leaflet";
import { LandmarkCategories } from "../../shared/shareddtypes";

export default function AddLandmark() {

    const [coords, setCoords] = useState([0,0]);
    let setCoordinates = () => {
        let latitude : number | undefined = parseFloat((document.getElementById("latitude") as HTMLInputElement).value);
        let longitude : number | undefined = parseFloat((document.getElementById("longitude") as HTMLInputElement).value);
        setCoords([latitude, longitude]);
        (map.current as L.Map).panTo([latitude, longitude]);
        
        // Manual delete, since scoping the variable outside the function and updating it does not seem to work
        let markerNode : ChildNode = (document.querySelector("img[alt='Marker'") as ChildNode);
        if (markerNode) markerNode.remove();
        new L.Marker([latitude, longitude]).setIcon(L.icon({iconUrl: markerIcon})).addTo(map.current as L.Map);
    }

    const submit = (e : React.FormEvent<HTMLFormElement>) => {
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
            longitude : longitude
        };

        // Here goes the access to SOLID
    };
    const map = useRef<L.Map>(null);
    let selectItems : JSX.Element[] = Object.keys(LandmarkCategories).map(key => {
        return <MenuItem value = {key}>{key}</MenuItem>;
    });

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
                                <InputLabel htmlFor="latitude" style={{color:"#FFF"}}>Latitude  </InputLabel>
                                <Input type="number" name = "latitude" 
                                    id = "latitude" style={{color:"#FFF"}}/>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="longitude" style={{color:"#FFF"}}>Longitude  </InputLabel>
                                <Input type="number" name = "longitude" 
                                    id = "longitude" style={{color:"#FFF"}}/>
                            </FormControl>
                            <FormControl>
                                <Button variant = "contained" onClick = {() => {setCoordinates();}}>Search coordinates</Button>
                            </FormControl>                        
                        </Grid>
                        <Grid item justifyContent="flex-end">
                            <Button variant = "contained" >Save new landmark</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs = {8} className = "rightPane  ">
                <Map map={map}>
                </Map>
            </Grid>
        </Grid>
        ;
}