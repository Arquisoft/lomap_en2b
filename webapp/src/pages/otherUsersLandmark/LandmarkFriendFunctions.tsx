import { InputLabel, Select, MenuItem, Box, TextField, Button, FormControl, Grid, Checkbox, FormControlLabel, Typography, Input} from "@mui/material";
import { LandmarkCategories, User } from "../../shared/shareddtypes";
import { Marker, Popup } from "react-leaflet";
import { Form, useParams } from "react-router-dom";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Landmark } from "../../shared/shareddtypes";
export function LandmarkFilter(props : any) : JSX.Element {
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
    return <Grid container rowGap={4} spacing = {5}>
                <FormControl fullWidth>
                    <InputLabel htmlFor="userFilter" style={{color:"#FFF"}}>User</InputLabel>
                    {loadUsers()}
                </FormControl>
                <FormControl fullWidth>
                    <Typography style={{color:"#FFF"}}>Category</Typography>
                    {loadCategories()}
                </FormControl>
            </Grid>;
}
export function LandmarkPlacer(props : any) : JSX.Element {
    let map : L.Map = props.any;
    if (map == undefined || map == null) {
        throw "The map is undefined";
    }

    // TODO: Retrieve all the landmarks. The array that follows is a temporal placeholder.
    let landmarks : any[] = [];
    return <div>
        {
            landmarks.forEach(element => {
                <Marker position={element.position} >
                    <Popup>
                        {element.name}
                    </Popup>
                </Marker>
            })
        }
    </div>
}

export function LandmarkAddComment(props : any) : JSX.Element {
    let commentsEnabled : boolean = props.isCommentEnabled.current as boolean;
    let returnElement : any = null;
    if (commentsEnabled) {
        returnElement = <Grid container rowSpacing={4}>
                            <Typography variant="h2" style={{color:"#FFF", fontSize:32}}>Add a comment</Typography>
                            <FormControl fullWidth>
                                <TextField id = "comment" name = "comment" multiline rows = {3} maxRows = {6} style={{color:"#FFF", fontSize:32}}/>
                            </FormControl>
                            <Grid item>
                                <Button variant="contained">Comment</Button>
                            </Grid>
                        </Grid>;
    }
    return returnElement;
    ;
}

export function LandmarkAddScore(props : any) : JSX.Element {
    let commentsEnabled : boolean = props.isCommentEnabled.current as boolean;
    let returnElement : any = null;
    if (commentsEnabled) {
        returnElement = <Grid container rowSpacing={4}>
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
    }
    return returnElement;
    ;
}