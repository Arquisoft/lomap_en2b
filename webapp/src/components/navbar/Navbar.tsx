import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar(): JSX.Element {
  const logout = () => {
    console.log("logout");
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link className= "logo" to="/" style={{ textDecoration: "none" }}>
          <img className= "logo" src="/Lomap.png" alt="bug" height={50} />
        </Link>
      

      </div>
      <div className="topbarCenter">
          <div className="helloText">
            Hello, USERNAME glad to see you again!
          </div>
      </div>
      <div className="topbarRight">
        <button className="logout" onClick={logout}>Logout</button>
      </div>  
    </div>
  );
}
export default Navbar;
