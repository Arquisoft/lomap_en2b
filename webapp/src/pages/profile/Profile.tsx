import "./profile.css";
import Map from "../../components/map/Map";
import UserRightbar from "../../components/rightbar/UserRightBar";

import { makeRequest } from "../../axios";
import { useParams } from "react-router";
import { useState } from "react";
import {useEffect} from "react";
import { useQuery } from '@tanstack/react-query';
import { getStringNoLocale,Thing } from "@inrupt/solid-client";
import { FOAF } from "@inrupt/vocab-common-rdf";

function Profile(): JSX.Element {
  
  const [name, setName] = useState<string>("");
  const [friends, setFriends] = useState([]);
  const uuid = useParams().id;
  

  useEffect(() =>{
    const fetchUser = async () => {
      makeRequest.get(`/solid/`+ uuid+"/name").then((res) => {
        setName(res.data);
      });
      makeRequest.get(`/solid/`+ uuid+"/friends").then((res) => {
        setFriends(res.data);
      });
    }
    fetchUser();
  },[name,setName]);


  
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
              <h4 className="profileInfoName">{name}</h4>
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