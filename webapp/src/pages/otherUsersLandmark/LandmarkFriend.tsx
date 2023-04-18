import {
    Button, Checkbox,
    FormControl, FormControlLabel,
    Grid, Input,
    InputLabel, MenuItem, Select,
    TextField,
    Typography
} from "@mui/material";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import React, {useRef, useState} from "react";
import "../../components/map/stylesheets/addLandmark.css"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useParams} from "react-router-dom";
import {Landmark, LandmarkCategories, User} from "../../shared/shareddtypes";
import {useQuery} from "@tanstack/react-query";
import {makeRequest} from "../../axios";

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const [isCommentEnabled, setIsCommentEnabled] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<L.Marker>(null);

    return  <Grid container>
                <Grid item xs = {12}>
                    <Typography variant="h1" component="h1" textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >See friends' landmarks</Typography>
                </Grid>
                <Grid item xs = {6} className = "leftPane">
                    <LandmarkFilter />
                    { isCommentEnabled ? <AddCommentForm /> : null}
                    { isCommentEnabled ? <AddScoreForm /> : null }
                </Grid>
                <Grid item xs = {8} className = "rightPane  ">
                    <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LandmarkPlacer commFunction={setIsCommentEnabled} markerFunction={setSelectedMarker}/>
                    </MapContainer>;
                </Grid>
            </Grid>
        ;
}

function AddScoreForm() : JSX.Element {
    return <form method = "post" action="/landmarks/scores">
                <Grid container rowSpacing={4}>
                    <Typography variant="h2" style={{color:"#FFF", fontSize:32}}>Add a comment</Typography>
                    <FormControl fullWidth>
                        <TextField id = "comment" name = "comment" multiline rows = {3} maxRows = {6} style={{color:"#FFF", fontSize:32}}/>
                    </FormControl>
                    <Grid item>
                        <Button variant="contained">Comment</Button>
                    </Grid>
                </Grid>
            </form>
    ;
}

function AddCommentForm() : JSX.Element {
    return <form method = "post" action="/landmarks/comments">
                <Grid container rowSpacing={4}>
                    <Typography variant="h2" style={{color:"#FFF", fontSize:32}}>Add a score</Typography>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="score" style={{color:"#FFF"}}>Score  </InputLabel>
                        <Input type="number" name = "score"
                               id = "score" inputProps={{min: 0, max: 10}} style={{color:"#FFF"}}/>
                    </FormControl>
                    <Grid item>
                        <Button variant="contained">Score</Button>
                    </Grid>
                </Grid>;
            </form>;
}

function LandmarkPlacer(props : any) : JSX.Element {

    const setIsCommentEnabled = props.commFunction;
    const setSelectedMarker = props.markerFunction;
    const clickHandler : any = (e : any) => {
        setIsCommentEnabled(true);
        setSelectedMarker(e.target);
        return null;
    };

    // TODO: Retrieve all the landmarks. The array that follows is a temporal placeholder.
    let landmarks : JSX.Element[] = [].map(element => {
        <Marker position={element.position} icon={markerIcon} eventHandlers={{click(e): {clickHandler(e)}}}>
            <Popup>
                {element.text}
            </Popup>
        </Marker>
    });
    return {landmarks};
}

function LandmarkFilter(props : any) : JSX.Element {

    const uuid = useParams().id;
    const [landmarks,setLandmarks] = useState<Landmark[]>([]);
    const { isLoading, error, data:friends } = useQuery(["results"], () =>

        makeRequest.get("/solid/" + uuid + "/friends").then((res) => {
            let landmks:Landmark[] = [];
            for (let i = 0; i < res.data.length; i++) {


                makeRequest.post("/landmarks/friend",{webId: res.data[i].solidURL}).then((res1) => {
                        for (let i = 0; i < res1.data.length; i++) {
                            let landmark = new Landmark(res1.data[i].name, res1.data[i].latitude, res1.data[i].longitude,res1.data[i].category);
                            landmks.push(landmark);
                        }
                    }
                )
            }
            setLandmarks(landmks);
            console.log(landmks);
        })
    );

    // TODO: Import here the users that are friends with the logged one
    const loadUsers = () => {
        let userList : User[] = [];
        let userItems : JSX.Element[] = userList.map(key => {
            return <MenuItem value = {key.toString()}>{key}</MenuItem>;
        });

        userItems.push(<MenuItem key = "all" value = "all">All users</MenuItem>);
        return  <Select id = "userFilter" name = "userFilter" defaultValue={"all"} label="User filter" style={{color:"#FFF"}}>
            {userItems}
        </Select>;
    }
    const loadCategories = () => {
        let categoryList : string[] = Object.values(LandmarkCategories);
        let categories : JSX.Element[] = categoryList.map(key => {
            return <Grid item xs = {4}>
                <FormControlLabel control={<Checkbox defaultChecked />} label={key} />
            </Grid>
        });

        return  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {categories}
        </Grid>;
    }
    return <form method = "get" action = "/landmarks/filter">
               <Grid container rowGap={4} spacing = {5}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="userFilter" style={{color:"#FFF"}}>User</InputLabel>
                        {loadUsers()}
                    </FormControl>
                    <FormControl fullWidth>
                        <Typography style={{color:"#FFF"}}>Category</Typography>
                        {loadCategories()}
                    </FormControl>
               </Grid>
            </form>;
}