import {makeRequest} from "../../axios";
import './users.css'
import {useParams} from "react-router";
import React from "react";
import {User} from "../../shared/shareddtypes";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query';
import {Link} from "react-router-dom";

const queryClient = new QueryClient();

export default function App() {
    return (
      <QueryClientProvider client={queryClient}>
        <Users />
      </QueryClientProvider>
    )
 }

function Users() {
    const username = useParams().text;

    //function below triggers the helper function
    const {isLoading, error, data} = useQuery(["results"], () =>
        makeRequest.get("/users/" + username).then((res) => {
            return res.data;
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <div className="main-container">
                <div className="dashboard">
                    <div className="dashboardTitle">
                        <h1>Users Found:</h1>
                    </div>
                    <div className="listUsers">
                        {
                            error
                                ? "Something went wrong"
                                : isLoading
                                    ? "Loading..."
                                    : data.map((user: User) => (
                                        <Link to={"/main/profile/" + user._id}>
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
        </QueryClientProvider>
    );
}