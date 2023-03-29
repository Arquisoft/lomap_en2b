import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { makeRequest } from "../../axios";

import PersonSearchIcon from '@mui/icons-material/PersonSearch';

function Navbar(): JSX.Element {

  const navigate = useNavigate();

  const logout = () => {
    document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    global.location.href = "http://localhost:"+process.env.WEBAPP_PORT+"/login";
  };

  const [inputValue, setInputValue] = useState('');

  const Search = () => {
    
    // do something with the input value
    navigate("/users/" + inputValue);
  }


  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link className= "logo" to="/" style={{ textDecoration: "none" }}>
          <img className= "logo" src="/Lomap.png" alt="bug" height={50} />
        </Link>
      

      </div>
      <div className="topbarCenter">
      <div className="searchForm">
        <form onSubmit={Search}>
          <div className="searchbar">
            <PersonSearchIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search for a friend!"
              className="searchInput"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit" className="searchUsers">Search</button>
          </div>
        </form>
      </div>
      </div>
      <div className="topbarRight">
        <button className="logout" onClick={logout}>Logout</button>
      </div>  
    </div>
  );
}
export default Navbar;
