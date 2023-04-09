import { Grid, Typography } from "@mui/material";
import Map from "../../components/map/Map";
import { useRef } from "react";
import * as LFF from "./LandmarkFriendFunctions";
import "../../components/map/stylesheets/addLandmark.css"

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const isCommentEnabled = useRef<boolean>(false); // TODO: Changes to true when selecting a landmark

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
                </Grid>
                <Grid item xs = {6} className = "rightPane">
                    <Map map = {map}>
                        <LFF.LandmarkPlacer isCommentEnabled={isCommentEnabled}/>
                    </Map>
                </Grid>
            </Grid>
        ;
}