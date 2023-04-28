import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import React, {useEffect, useRef, useState} from "react";
import "../../map/stylesheets/addLandmark.css"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useParams} from "react-router-dom";
import {Landmark, LandmarkCategories, User} from "../../shared/shareddtypes";
import {useQuery} from "@tanstack/react-query";
import {makeRequest} from "../../axios";
import L from "leaflet";
import { getLocations } from "../addLandmark/solidLandmarkManagement";
import { useSession } from "@inrupt/solid-ui-react";

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const [isCommentEnabled, setIsCommentEnabled] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<L.Marker | null>(null);
    const [landmarksReact, setLandmarksReact] = useState<JSX.Element[]>([]);
    const [filters, setFilters] = useState<Map<string, boolean> | null>(null);

    const clickHandler : any = (e : any) => {
        setIsCommentEnabled(true);
        setSelectedMarker(e.target);
        return null;
    };

    useEffect( () => {
        if (useSession().session.info.webId !== undefined) {
            getData(setIsCommentEnabled, setSelectedMarker, setLandmarksReact, filters);
        }
    });

    return  <Grid container>
                <Grid item xs = {12}>
                    <Typography variant="h1" component="h1" textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >See friends' landmarks</Typography>
                </Grid>
                <Grid item xs = {6} className = "leftPane">
                    <LandmarkFilter map = {setFilters}/>
                    { isCommentEnabled ? <AddCommentForm /> : null}
                    { isCommentEnabled ? <AddScoreForm /> : null }
                </Grid>
                <Grid item xs = {8} className = "rightPane">
                    <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>;
                </Grid>
            </Grid>
        ;
}

async function getData(setIsCommentEnabled : Function, setSelectedMarker : Function, setLandmarksReact : Function, map : Map<string, boolean> | null) {
    let landmarks : Landmark[] | undefined = await getLocations(useSession().session.info.webId);
    if (landmarks === undefined || map === null) return null;

    if (!(document.getElementById("all") as HTMLInputElement).checked) {
        landmarks = landmarks.filter(landmark => map.get(landmark.category))
    }

    let landmarksComponent : JSX.Element[] = landmarks.map(landmark => {
        return <Marker position={[landmark.longitude, landmark.latitude]} eventHandlers={
            {
                click: (e) => {
                    setIsCommentEnabled(true);
                    setSelectedMarker(e.target);
                }
            }
        }>
                <Popup>
                        {landmark.name} - {landmark.category}
                </Popup>
            </Marker>
    });
    
    setLandmarksReact(landmarksComponent);
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

function LandmarkFilter(props : any) : JSX.Element {

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
        let map : Map<string, boolean> = new Map<string, boolean>();
        categoryList.forEach(category => map.set(category, true));

        const changeValue = (id : string) => {
            let newValue : boolean = (document.getElementById(id) as HTMLInputElement).checked;
            map.set(id, newValue);
        }

        let categories : JSX.Element[] = categoryList.map(key => {
            return <Grid item xs = {4}>
                <FormControlLabel control={<Checkbox id = {key} onClick={( () => changeValue(key))} defaultChecked/>} label={key} />
            </Grid>
        });

        props.setFilters(map);

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