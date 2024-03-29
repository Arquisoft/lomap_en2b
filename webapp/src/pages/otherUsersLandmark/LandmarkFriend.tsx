import {
    Button, Checkbox, FormControl, 
    FormControlLabel, Grid, Input, 
    InputLabel, TextField, Typography
} from "@mui/material";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import {useEffect, useRef, useState} from "react";
import "../../map/stylesheets/addLandmark.css"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Landmark, LandmarkCategories, Review} from "../../shared/shareddtypes";
import L from "leaflet";
import { addLandmarkReview, addLandmarkScore, getFriendsLandmarks} from "../../solidHelper/solidLandmarkManagement";
import { useSession } from "@inrupt/solid-ui-react";

export default function LandmarkFriend() : JSX.Element{

    const map = useRef<L.Map>(null);
    const categories = useRef<string[]>(getCategories());
    const [isCommentEnabled, setIsCommentEnabled] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<number>(-1);
    const [landmarksReact, setLandmarksReact] = useState<JSX.Element[]>([]);
    const [filters, setFilters] = useState<Map<string, boolean>>(new Map<string, boolean>());
    const [landmarks, setLandmarks] = useState<Map<number, Landmark>>(new Map<number, Landmark>);
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
    };

    const getCurrentLandmark = () => {
        let landmark = landmarks.get(selectedMarker);
        let l : Landmark = {
            name : "None selected",
            category : "None selected",
            latitude : 0, longitude : 0,
            description : "None selected",
            reviews : [],
            scores : new Map<string, Number>(),
            pictures : [],
            url: "None selected",
        }
        landmark === undefined ? landmark=l : landmark=landmark;


        return landmark;
    };

    const getPicture = () => {
        let landmark = getCurrentLandmark();
        if (landmark.pictures !== undefined) {
            return landmark.pictures[0];
        }
        return undefined;
    };

    const getScore = () => {
        let score = 0;
        let landmark = getCurrentLandmark();

        if (landmark.scores === undefined) {
            return score;
        }
        landmark.scores.forEach((value, key) => {
            score += value.valueOf();
        });
        return score/landmark.scores.size;
    };

    const getReviews = () => {
        let landmark = getCurrentLandmark();

        if (landmark.reviews === undefined) {
            return <p></p>;
        }
        
        return landmark.reviews.forEach((value) => {
            <div>
                <Typography> {value.content} </Typography>
            </div>
        });
    }

    const sendComment : Function = async (comment : string) => {
        let webId : string = session.info.webId!;
        let date : string = new Date().toLocaleString();
        let review : Review = new Review(webId, date, "", "", comment);
        let landmark : Landmark = landmarks.get(selectedMarker) as Landmark;
        await addLandmarkReview(landmark, review);
    };

    const sendScore : Function = async (score : number) => {
        let landmark : Landmark = landmarks.get(selectedMarker) as Landmark;
        await addLandmarkScore(session.info.webId!, landmark, score);
    };
    return  <Grid container>
                <Grid item xs = {12}>
                    <Typography variant="h1" component="h1" 
                    textAlign={"center"} style={{color:"#FFF", fontSize: 46}} >
                        See friends' landmarks
                        </Typography>
                </Grid>
                <Grid item xs = {5} className = "leftPane">
                    <Grid container rowGap={4} spacing = {5}>
                        <FormControl fullWidth>
                            <Typography style={{color:"#FFF"}}>Category</Typography>
                            {loadCategories()}
                        </FormControl>
                    </Grid>
                    { isCommentEnabled ? <AddScoreForm sendScore={sendScore}/> : null }
                    { isCommentEnabled ? <AddCommentForm sendComment={sendComment} /> : null}
                    { isCommentEnabled ?
                        <Grid>
                            <Typography style={{fontSize: 30}}> Name: </Typography>
                            <Typography> {getCurrentLandmark().name}</Typography>
                            <Typography style={{fontSize: 30}}> Category: </Typography>
                            <Typography> {getCurrentLandmark().category}</Typography>
                            <Typography style={{fontSize: 30}}> Coordinates: </Typography>
                            <Typography> Latitude: {getCurrentLandmark().latitude} | Longitude {getCurrentLandmark().longitude} </Typography>
                            <Typography style={{fontSize: 30}}> Description: </Typography>
                            <Typography> {getCurrentLandmark().description}</Typography>
                            <Typography style={{fontSize: 30}}> Picture: </Typography>
                            {getPicture()===undefined ? <p>No picture uploaded</p> : <img src={getPicture()} alt="Landmark picture"></img>}
                            <Typography style={{fontSize: 30}}> Score: </Typography>
                            <Typography> {getScore().toString() =="NaN" ? 0 : getScore() } </Typography>
                            <Typography style={{fontSize: 30}}> Reviews: </Typography>
                            {getReviews()}
                            
                        </Grid> : null}
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
    setSelectedMarker(-1);
    let landmarksComponent : JSX.Element[] = [];
    let mapLandmarks : Map<number, Landmark> = new Map<number, Landmark>();
    for (let i : number = 0; i < landmarks.length; i++) {
        mapLandmarks.set(i, landmarks[i]);
        landmarksComponent.push(<Marker position={[landmarks[i].latitude, landmarks[i].longitude]} eventHandlers={
                { click: () => {setIsCommentEnabled(true); setSelectedMarker(i);}}
            } icon = {L.icon({iconUrl: markerIcon})}>
                    <Popup>{landmarks[i].name} - {landmarks[i].category}</Popup>
                </Marker>
        );
    }
    setLandmarks(mapLandmarks);
    setLandmarksReact(landmarksComponent);
}

function AddScoreForm(props : any) : JSX.Element {
    const sendScore : Function = () => {
        let value : number = parseFloat((document.getElementById("comment") as HTMLInputElement)!.value);
        props.sendScore(value);
    };
    return <form method = "post" action="/landmarks/comments">
            <Grid container rowSpacing={4}>
                <Typography variant="h2" style={{color:"#FFF", fontSize:32}}>Add a score</Typography>
                <FormControl fullWidth>
                    <InputLabel htmlFor="score" style={{color:"#FFF"}}>Score  </InputLabel>
                    <Input type="number" name = "score" id = "score" inputProps={{min: 0, max: 10}} style={{color:"#FFF"}}/>
                </FormControl>
                <Grid item><Button variant="contained">Score</Button></Grid>
            </Grid>
        </form>;
    }

function AddCommentForm(props : any) : JSX.Element {
    const sendComment : Function = () => {
        if (document.getElementById("comment") !== null) {
            let comment : string = (document.getElementById("comment") as HTMLInputElement).textContent!;
            if (comment.trim() !== "") {props.sendComment(comment);}
        }
    };
    return <form method = "post" onSubmit={sendComment()}>
                <Grid container rowSpacing={4}>
                    <Typography variant="h2" style={{color:"#FFF", fontSize:32}}>Add a comment</Typography>
                    <FormControl fullWidth>
                        <TextField id = "comment" name = "comment" multiline rows = {3} maxRows = {6} style={{color:"#FFF", fontSize:32}}/>
                    </FormControl>
                    <Grid item><Button variant="contained">Comment</Button></Grid>
                </Grid>
            </form>
}


function getCategories() : string[] {
    let categories : string[] = Object.values(LandmarkCategories);
    categories.push("All");
    return categories;
} 
