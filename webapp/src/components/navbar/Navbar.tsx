import React from "react";
import { Link } from "react-router-dom";

function Navbar(): JSX.Element {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/map">Map</Link>
    </nav>
  );
}
export default Navbar;
