import "./profile.css";
import Map from "../../components/map/Map";
import UserRightbar from "../../components/rightbar/UserRightBar";
import { useSession } from "@inrupt/solid-ui-react";

import { useEffect } from "react";
import { makeRequest } from "../../axios";
import { useParams } from "react-router";
import { useState } from "react";

function Profile(): JSX.Element {
  const [user, setUser] = useState(undefined);
  const uuid = useParams().id;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await makeRequest.get(`/solid/`+ uuid);
      setUser(res.data);
    };
    fetchUser();
    console.log(user);
  },[user,setUser]);
  
  return (
    
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover"> 
              <img
                className="profileUserImg"
                src=
                 "/noAvatar.png"
                
                
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user}</h4>
            </div>
          </div>
          
          <div className="profileRightBottom">
         
          
          </div>
          
          
        </div>
        <Map/>
          <UserRightbar />
      </div>
  );
}

export default Profile;