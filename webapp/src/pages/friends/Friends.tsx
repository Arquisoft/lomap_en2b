import { useSession } from '@inrupt/solid-ui-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { makeRequest } from '../../axios';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { User } from "../../shared/shareddtypes";
import { Link } from "react-router-dom";

function Friends():JSX.Element {

  // const [friends, setFriends] = useState([]);
  const uuid = useParams().id;

  const { isLoading, error, data } = useQuery(["results"], () =>
        makeRequest.get("/solid/" + uuid + "/friends").then((res) => {
            return res.data;
        })
      );

  /*useEffect(() => {
    const fetchFriends = async () => {
      await makeRequest.get("/solid/"+uuid+"/friends").then((res) => {
        setFriends(res.data);
      });
    };
    fetchFriends();
  },[friends,setFriends]); */

  return(
    <div className="friendsContainer">
      <div className="dashboard">
        <div className="dashboardTitle">
          Friends:
        </div>
        <div className="listUsers">
          {
            error
              ? "Something went wrong"
              : isLoading
                ? "loading"
                : data.map( (user : User) => (
                  <Link to={"/profile/" + user._id}>
                  <div className="userList">
                    <div className="userListItemLeft">
                      {"User solidURL: " + user.solidURL}
                    </div>
                    <div className="userListItemRight">
                      {"User name: " + user.username}
                    </div>
                  </div>
                  </Link> 
          ))}
        </div>
      </div>
    </div>
    ); 
}

export default Friends;