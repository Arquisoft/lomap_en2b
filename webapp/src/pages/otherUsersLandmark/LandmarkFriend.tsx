import "./addLandmark.css";
import "../../components/map/stylesheets/addLandmark.css"
import { Grid } from "@mui/material";
import Map from "../../components/map/Map";
import { useRef } from "react";
import * as LFF from "./LandmarkFriendFunctions";

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const isCommentEnabled = useRef<boolean>(false);

    return  <Grid container>
                <Grid item xs = {6} >
                    <LFF.LandmarkFilter />
                    <LFF.LandmarkAddComment isCommentEnabled={isCommentEnabled}/>
                </Grid>
                <Grid item xs = {6}>
                    <Map map = {map}>
                        <LFF.LandmarkPlacer isCommentEnabled={isCommentEnabled}/>
                    </Map>
                </Grid>
            </Grid>
        ;
}