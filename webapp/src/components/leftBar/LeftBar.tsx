import "./leftBar.css";
import { Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useEffect } from "react";
import { makeRequest } from "../../axios";
import { useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";

function LeftBar(): JSX.Element{
        const [user, setUser] = useState(undefined);
        const {session} = useSession();
        useEffect(() => {
            const fetchUser = async () => {
                const webId = session.info.webId;
                console.log(webId);
                const res = await makeRequest.get(`/users/`, {headers:{webId: webId}});
                setUser(res.data);
                };
                fetchUser();

        },[user,setUser]);
        return (
            <div className="sidebar">
            <div className="leftbarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <PersonIcon className="sidebarIcon"/>
                        Profile
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                        <Link to="/addLandmark" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <LocationOnIcon className="sidebarIcon"/>
                        Add a landmark
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <DirectionsIcon className="sidebarIcon"/>
                        Routes
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                        <Link to="/friends" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <PeopleAltIcon className="sidebarIcon"/>
                        Friends
                        </Link>
                    </li>
                </ul>
                
            </div>
        </div>
        );
    
}

export default LeftBar;