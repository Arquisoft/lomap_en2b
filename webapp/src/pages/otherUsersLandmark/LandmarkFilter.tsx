import { InputLabel, Select, MenuItem, FormControl} from "@mui/material";
import { User } from "../../shared/shareddtypes";


export default function LandmarkFilter(props : any) : JSX.Element {

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