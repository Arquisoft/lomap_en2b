import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { makeRequest } from "../../axios";

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { LogoutButton } from "@inrupt/solid-ui-react";

function Navbar(): JSX.Element {

  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState('');


  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link className="logo" to="/" style={{ textDecoration: "none" }}>
          <img className="logo" src="/Lomap.png" alt="bug" height={50} />
        </Link>


      </div>
      <div className="topbarCenter">
        <div className="searchForm">
          <form >
            <div className="searchbar">
              <PersonSearchIcon className="searchIcon" />
              <input
                type="text"
                placeholder="Search for a friend!"
                className="searchInput"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <Link to={"/users/" + inputValue} style={{ textDecoration: 'none', color: 'inherit' }}>
              <button type="submit" className="searchUsers">Search</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="topbarRight">
      {}
        <LogoutButton>
          <button className="logout">Logout</button>
        </LogoutButton>
      </div>
    </div>
  );
}
export default Navbar;
