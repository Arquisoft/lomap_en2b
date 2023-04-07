import "./addLandmark.css";
import "../../components/map/stylesheets/addLandmark.css"
import { Grid } from "@mui/material";
import Map from "../../components/map/Map";
import { useRef } from "react";
import LandmarkFilter from "./LandmarkFilter";
import LandmarkAddComment from "./LandmarkAddComment";
import LandmarkPlacer from "./LandmarkPlacer";

export default function OtherUsersLandmark() : JSX.Element{

    const map = useRef<L.Map>(null);
    const isCommentEnabled = useRef<boolean>(false);

    return  <Grid container>
                <Grid item xs = {6} >
                    <LandmarkFilter />
                    <LandmarkAddComment isCommentEnabled={isCommentEnabled}/>
                </Grid>
                <Grid item xs = {6}>
                    <Map map = {map}>
                        <LandmarkPlacer isCommentEnabled={isCommentEnabled}/>
                    </Map>
                </Grid>
            </Grid>
        ;
}