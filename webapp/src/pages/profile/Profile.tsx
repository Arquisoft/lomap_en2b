import "./profile.css";
import Map from "../../components/map/Map";


import { makeRequest } from "../../axios";
import { useParams } from "react-router";
import { useState } from "react";
import {useEffect} from "react";
import { useQuery } from '@tanstack/react-query';
import { getStringNoLocale,Thing } from "@inrupt/solid-client";
import { FOAF } from "@inrupt/vocab-common-rdf";
import { useSession } from "@inrupt/solid-ui-react";

function Profile(): JSX.Element {
  
  const [user, setUser] = useState({name:"",picture:""});
  const [isFriend, setFriend] = useState(false);
  const uuid = useParams().id;
  const {session} = useSession();
  const [webID, setWebID] = useState<string>("");

  useEffect(() =>{
    
    const fetchUser = async () => {
      makeRequest.get(`/solid/`+ uuid+"").then((res) => {
        setUser(res.data);
      });
      makeRequest.get("/users/id/"+uuid).then((res) => {
        setWebID(res.data.solidURL);
      });

      let id = session.info.webId?.split("#")[0]
      const url = new URL(id || "");
      const hostParts = url.host.split('.');
      const username = hostParts[0];
      makeRequest.get("/users/"+username).then((res) => {
        makeRequest.get("/solid/"+res.data[0]._id+"/friends").then((res1) => {
        
          for(let i=0; i<res1.data.length; i++){
            if(res1.data[i].solidURL === webID){
              setFriend(true);
              break;
            }
          }
      })
   
    });
    
    }
    fetchUser();
  },[user,setUser,uuid,setWebID,isFriend,setFriend]);

  const handleClick = () => {
    console.log("clicked");
    makeRequest.post("/solid/addFriend",{webID:session.info.webId,friendWID:webID});
  };
  
  return (
    
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover"> 
              <img
                className="profileUserImg"
                src= {user.picture === null ? "/noAvatar.png" : user.picture}
                
                
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.name}</h4>
            </div>
          </div>
          
          <div className="profileRightBottom">
          {session.info.webId?.split("#")[0] === webID ? "" : isFriend ? "You are already friends": <button onClick = {handleClick} className="profileFollowButton">Follow</button> }
          
          </div>
          
          
        </div>
        <Map/>

      </div>
  );
}

export default Profile;