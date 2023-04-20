import "./leftBar.css";
import {Link} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {useEffect, useState} from "react";
import {makeRequest} from "../../axios";
import {useSession} from "@inrupt/solid-ui-react";

function LeftBar(): JSX.Element{
        const [user, setUser] = useState("");
        const {session} = useSession();
        useEffect(() => {
            const fetchUser = async () => {
                const webId = session.info.webId?.split("#")[0];
              
                await makeRequest.patch("/users/", {webId: webId}).then((res) => {
                   
                    setUser(res.data);
                });
                };
                fetchUser();

        },[user,setUser]);
        return (
            <div className="sidebar">
            <div className="leftbarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <Link to={"/profile/"+user} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <PersonIcon className="sidebarIcon"/>
                        Profile
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                            <Link to="/landmarks/add" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <LocationOnIcon className="sidebarIcon"/>
                            Add a landmark
                            </Link>
                        </li>
                    <li className="sidebarListItem">
                        <Link to={"/landmarks/filter/"+user} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <LocationOnIcon className="sidebarIcon"/>
                        See friends' landmarks
                        </Link>
                    </li>
                    {/* <li className="sidebarListItem">
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <DirectionsIcon className="sidebarIcon"/>
                        Routes
                        </Link>
                    </li> */}
                    <li className="sidebarListItem">
                        <Link to={"/friends/"+user} style={{ textDecoration: 'none', color: 'inherit' }}>
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