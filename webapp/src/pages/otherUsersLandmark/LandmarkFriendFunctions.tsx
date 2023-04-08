import { InputLabel, Select, MenuItem, Box, TextField, Button, FormControl, Grid, Checkbox, FormControlLabel, Typography} from "@mui/material";
import { LandmarkCategories, User } from "../../shared/shareddtypes";
import { Marker, Popup } from "react-leaflet";

export function LandmarkFilter(props : any) : JSX.Element {

    // TODO: Import here the users that are friends with the logged
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
            return <FormControlLabel control={<Checkbox defaultChecked />} label={key} />
        });

        // TODO: Space the grid appropiately
        return  <Grid item rowSpacing = {5} columnSpacing={5} gridRow={4}>
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
    return (
    <Box>
        <form action = "/landmark/comments/add" method = "post">
            <TextField id = "comment" name = "comment" multiline maxRows = {3}/>
            <Button variant="contained" justify-self="right">Comment</Button>
        </form>
    </Box>
    );

}