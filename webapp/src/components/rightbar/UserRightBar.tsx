import "./userRightBar.css";
import { Link } from "react-router-dom";

function UserRightBar(): JSX.Element{
    return (
        <div className="rightbar">
        <h4 className="rightbarTitle">User friends</h4>
          <div className="rightbarFollowings">
          <Link
                to={"/profile/"}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={"/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">Pepe</span>
                </div>
                </Link>
                <Link
                to={"/profile/"}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={"/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">Pepita</span>
                </div>
                </Link>
                <Link
                to={"/profile/"}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={"/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">Labra</span>
                </div>
                </Link>
            {/* {friends.map((friend) => (
              <Link
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? PF + friend.profilePicture
                        : PF + "defaults/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">{friend.username}</span>
                </div>
                </Link>
            ))} */}
            </div>
        </div>
    )
}

export default UserRightBar;