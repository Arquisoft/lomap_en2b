import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { makeRequest } from "../../axios";

import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import {LogoutButton, useSession} from "@inrupt/solid-ui-react";
import {Button} from "@mui/material";

function Navbar(): JSX.Element {

  const navigate = useNavigate();
  const sessionStarted : boolean = useSession().session.info.isLoggedIn;
  const [inputValue, setInputValue] = useState('');
  const Search = () => {

    // do something with the input value
    navigate("/users/" + inputValue);
  }

  const getLoginButton = () => {
    if (sessionStarted) {
      return <Button className="logout" variant="contained">
        Logout
      </Button>
    } else {
      return <Button className="login" variant="contained" onClick={ () => navigate("/login")}>
        Login
      </Button>
    }
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link className="logo" to="/" style={{ textDecoration: "none" }}>
          <img className="logo" src="/Lomap.png" alt="bug" height={50} />
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
        <LogoutButton>
          {getLoginButton()}
        </LogoutButton>
      </div>
    </div>
  );
}
export default Navbar;
