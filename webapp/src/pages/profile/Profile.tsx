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
                
                
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">Andrés Cadenas</h4>
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