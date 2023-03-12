function LeftBar(): JSX.Element{
 
        return (
            <div className="sidebar">
            <div className="leftbarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        Profile
                    </li>
                    <li className="sidebarListItem">
                        Landmarks
                    </li>
                    <li className="sidebarListItem">
                        Routes
                    </li>
                    <li className="sidebarListItem">
                        Friends
                    </li>
                </ul>
                
            </div>
        </div>
        );
    
}

export default LeftBar;