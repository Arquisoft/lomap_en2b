import { InputLabel, Select, MenuItem, FormControl, Box, TextField, Button} from "@mui/material";
import { User } from "../../shared/shareddtypes";
import { Marker, Popup } from "react-leaflet";

export function LandmarkFilter(props : any) : JSX.Element {

    // TODO: Import here the users that are friends with the logged
    const loadUsers = () => {
        let userList : User[] = [];
        let userItems : JSX.Element[] = userList.map(key => {
            return <MenuItem value = {key.toString()}>{key}</MenuItem>;
        });

        userItems.push(<MenuItem key = "all" value = "all">All users</MenuItem>);
        return userItems;
    }
    return <FormControl>
            <InputLabel htmlFor="userFilter" style={{color:"#FFF"}}>User</InputLabel>
            <Select id = "userFilter">
                {loadUsers}
            </Select>
        </FormControl>;
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