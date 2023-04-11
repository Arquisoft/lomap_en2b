import { makeRequest } from "../../axios";
import './users.css'
import { useParams } from "react-router";
import React from "react";
import { User } from "../../shared/shareddtypes";
import { useQuery } from '@tanstack/react-query';
import { Link } from "react-router-dom";

function Users() {
  const username = useParams().text;

  //function below triggers the helper function
  const { isLoading, error, data } = useQuery(["results"], () =>
        makeRequest.get("/users/" + username).then((res) => {
            return res.data;
        })
      );

    return(
      <div className="main-container">
        <div className="dashboard">
          <div className="dashboardTitle">
            Users Found: 
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
  
export default Users;