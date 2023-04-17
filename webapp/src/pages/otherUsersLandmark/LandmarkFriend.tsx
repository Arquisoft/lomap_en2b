import { Grid, Typography } from "@mui/material";
import Map from "../../components/map/Map";
import React, { useRef } from "react";
import * as LFF from "./LandmarkFriendFunctions";
import "../../components/map/stylesheets/addLandmark.css"
import {MapContainer, TileLayer} from "react-leaflet";

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const isCommentEnabled = useRef<boolean>(true); // TODO: Changes to true when selecting a landmark

    return  <Grid container>
                <Grid item xs = {12}>
                    <Typography variant="h1" component="h1" textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >See friends' landmarks</Typography>
                </Grid>
                <Grid item xs = {6} className = "leftPane">
                    <form method = "get" action = "/landmarks/filter">
                        <LFF.LandmarkFilter />
                    </form>
                    <form method = "post" action="/landmarks/comments">
                        <LFF.LandmarkAddComment isCommentEnabled={isCommentEnabled}/>
                    </form>
                    <form method = "post" action="/landmarks/scores">
                        <LFF.LandmarkAddScore isCommentEnabled={isCommentEnabled}/>
                    </form>
                </Grid>
                <Grid item xs = {8} className = "rightPane  ">
                    <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LFF.LandmarkPlacer isCommentEnabled={isCommentEnabled}/>
                    </MapContainer>;
                </Grid>
            </Grid>
        ;
}