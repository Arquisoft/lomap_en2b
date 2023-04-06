import { Box, InputLabel, Select, MenuItem} from "@mui/material";
import { User } from "../../shared/shareddtypes";


export default function LandmarkFilter(props : any) : JSX.Element {

    // TODO: Import here the users that are friends with the logged
    const loadUsers = () => {
        let userList : User[] = [];
        return <Select id = "userFilter">
            <MenuItem key = "all" value = "all">All users</MenuItem>
            {userList.forEach(key => {
                return <MenuItem value = {key}>{key}</MenuItem>
            })}
        </Select>
    }
    return <Box>
         <InputLabel htmlFor="userFilter" name="userFilter" style={{color:"#FFF"}}>User</InputLabel>
        {loadUsers}
    </Box>;
}