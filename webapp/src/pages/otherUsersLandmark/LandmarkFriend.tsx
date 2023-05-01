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
import {FormEvent, useEffect, useRef, useState} from "react";
import "../../map/stylesheets/addLandmark.css"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Landmark, LandmarkCategories, User} from "../../shared/shareddtypes";
import L from "leaflet";
import { getFriendsLandmarks, getLocations } from "../addLandmark/solidLandmarkManagement";
import { useSession } from "@inrupt/solid-ui-react";

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const categories = useRef<string[]>(getCategories());
    const [isCommentEnabled, setIsCommentEnabled] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<L.Marker | null>(null);
    const [landmarksReact, setLandmarksReact] = useState<JSX.Element[]>([]);
    const [filters, setFilters] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const [landmarks, setLandmarks] = useState<Map<JSX.Element, Landmark>>(new Map<JSX.Element, Landmark>);
    const {session} = useSession();

    function changeFilter(name : string) {
        let auxFilters : Map<string, boolean> = filters;
        auxFilters.set(name, (document.getElementById(name.toLowerCase()) as HTMLInputElement).checked);
        getData(setIsCommentEnabled, setSelectedMarker, setLandmarks, setLandmarksReact, auxFilters, session.info.webId);
    }

    useEffect(() => {
        if (session.info.webId  !== undefined) {
            getData(setIsCommentEnabled, setSelectedMarker, setLandmarks, setLandmarksReact, filters, session.info.webId);
        }
    }, [filters, session.info.webId]);

    const loadCategories = () => {
        let categoriesElement : JSX.Element[] = categories.current.map(key => {
            filters.set(key, true);
            return <Grid item xs = {4}> 
                <FormControlLabel control={<Checkbox id = {key.toLowerCase()} onClick={( () => changeFilter(key))} defaultChecked/>} label={key} />
            </Grid>
        });

        return  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {categoriesElement}
        </Grid>;
    }
    return  <Grid container>
                <Grid item xs = {12}>
                    <Typography variant="h1" component="h1" textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >See friends' landmarks</Typography>
                </Grid>
                <Grid item xs = {5} className = "leftPane">
                    <Grid container rowGap={4} spacing = {5}>
                        <FormControl fullWidth>
                            <Typography style={{color:"#FFF"}}>Category</Typography>
                            {loadCategories()}
                        </FormControl>
                    </Grid>
                    { isCommentEnabled ? <AddCommentForm /> : null}
                    { isCommentEnabled ? <AddScoreForm /> : null }
                </Grid>
                <Grid item xs = {7} className = "rightPane">
                    <MapContainer center={[50.847, 4.357]} zoom={13} scrollWheelZoom={true} ref={map}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {landmarksReact}
                    </MapContainer>
                </Grid>
            </Grid>
        ;
}

async function getData(setIsCommentEnabled : Function, setSelectedMarker : Function, 
                        setLandmarks : Function,setLandmarksReact : Function, 
                        filters : Map<string, boolean>, webId : string | undefined) {
    if (webId === undefined) return null;
    let fetchedLandmarks = await getFriendsLandmarks(webId);
    if (fetchedLandmarks === undefined) return null;

    let landmarks : Landmark[] = fetchedLandmarks[0] as Landmark[];
    if (!(document.getElementById("all") as HTMLInputElement).checked) {
        landmarks = landmarks.filter(landmark => filters.get(landmark.category))
    }
    setIsCommentEnabled(false);
    setSelectedMarker(null);

    let landmarksComponent : JSX.Element[] = landmarks.map(landmark => {
        return <Marker position={[landmark.latitude, landmark.longitude]} eventHandlers={
            {
                click: (e) => {
                    setIsCommentEnabled(true);
                    setSelectedMarker(e.target);
                }
            }
        } icon = {L.icon({iconUrl: markerIcon})}>
                <Popup>
                        {landmark.name} - {landmark.category}
                </Popup>
            </Marker>
    });
    let mapLandmarks : Map<JSX.Element, Landmark> = new Map<JSX.Element, Landmark>();
    for (let i : number = 0; i < landmarks.length; i++) {
        mapLandmarks.set(landmarksComponent[i], landmarks[i]);
    }
    setLandmarks(mapLandmarks);
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
                </Grid>
            </form>;
}

function getCategories() : string[] {
    let categories : string[] = Object.values(LandmarkCategories);
    categories.push("All");
    return categories;
} 