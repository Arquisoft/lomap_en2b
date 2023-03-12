import "./leftBar.css";
import { Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
function LeftBar(): JSX.Element{
 
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
                        <Link to="/landmarks" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <LocationOnIcon className="sidebarIcon"/>
                        Landmarks
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