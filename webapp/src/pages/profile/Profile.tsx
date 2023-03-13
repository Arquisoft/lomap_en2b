import "./profile.css";
import Map from "../../components/map/Map";
import UserRightbar from "../../components/rightbar/UserRightBar";
function Profile(): JSX.Element {

  return (
    
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              
              <img
                className="profileUserImg"
                src=
                 "/noAvatar.png"
                
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">Andres</h4>
            </div>
          </div>
          <div className="profileRightBottom">
            <Map/>
            <UserRightbar />
          </div>
        </div>
      </div>
  );
}

export default Profile;