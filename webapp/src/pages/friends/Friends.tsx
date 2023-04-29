import "./friends.css";

import {makeRequest} from '../../axios';
import {useParams} from 'react-router';
import {useQuery} from '@tanstack/react-query';
import {User} from "../../shared/shareddtypes";
import {Link} from "react-router-dom";

function Friends(): JSX.Element {

    // const [friends, setFriends] = useState([]);
    const uuid = useParams().id;

    const {isLoading, error, data} = useQuery(["results"], () =>
        makeRequest.get("/solid/" + uuid + "/friends").then((res) => {
            return res.data;
        })
    );

    return (
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
    );
}

export default Friends;