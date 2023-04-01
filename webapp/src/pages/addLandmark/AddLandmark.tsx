import Map from "../../components/map/Map";
import "./addLandmark.css";
import { useRef, useState } from "react";
import { Button, Container, Divider, Grid, TextField, Typography } from "@mui/material";
import SetLatitude from "../../components/map/MapFunctions/SetLatitude";
import SetLongitude from "../../components/map/MapFunctions/SetLongitude";
import React from "react";

export default function Landmarks() {

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

    const map = useRef(null);

    const numericFunction = (e : React.ChangeEvent<HTMLInputElement>, func : Function) => {
        let number : number = parseFloat(e.target.value);
        if (number == undefined) {
            e.target.value = e.target.value.substring(0, e.target.value.length - 2);
        } else {
            React.createElement(func(number, map));
        }
    }

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
                                id = "latitude" label="Latitude"  
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                 numericFunction(e, SetLatitude)}} />
                        </Grid>
                        <Grid item xs = {12}>
                        <TextField name = "longitude" 
                                id = "longitude" label="longitude"  
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                numericFunction(e, SetLongitude)}} />
                        </Grid>                        
                        <Grid item xs = {12} justifyContent={"flex-end"}>
                            <Button variant = "contained">Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs = {8}>
                <Map map={map}/>
            </Grid>
        </Grid>
        ;
}