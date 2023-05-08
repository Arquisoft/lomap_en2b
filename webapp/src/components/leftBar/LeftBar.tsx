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
                        <Link to={useSession().session.info.isLoggedIn ?"/main/profile/"+user:"/"} style={{ textDecoration: 'none', color: 'inherit' }} id="profileLB">
                        <PersonIcon className="sidebarIcon"/>
                        Profile
                        </Link>
                    </li>
                    <li className="sidebarListItem">
                            <Link to={useSession().session.info.isLoggedIn ?"/main/landmarks/add":"/"} style={{ textDecoration: 'none', color: 'inherit' }} id="addlandmarkLB">
                            <LocationOnIcon className="sidebarIcon"/>
                            Add a landmark
                            </Link>
                        </li>
                    <li className="sidebarListItem">
                        <Link to={useSession().session.info.isLoggedIn ? "/main/landmarks/filter/"+user: "/"} style={{ textDecoration: 'none', color: 'inherit' }} id="seelandmarksLB">
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
                        <Link to={useSession().session.info.isLoggedIn ?"/main/friends/"+user:"/"} style={{ textDecoration: 'none', color: 'inherit' }} id="friendsLB">
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