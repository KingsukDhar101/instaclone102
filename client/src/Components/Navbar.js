import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "../Styles/Navbar.css";
import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const checkNav = () => {
    if (state) {
      // console.log("state = ",state);
      return [
        <li key="1">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="2">
          <Link to="/createPost">Create Post</Link>
        </li>,
        <li key="3">
          <Link to="/getsubpost">My following posts</Link>
        </li>,
        <li key="4">
          <button
            className="btn waves-effect waves-dark #64b5f6 red darken-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      // console.log("state = ",state);
      return [
        <li key="5">
          <Link to="/login">Login</Link>
        </li>,
        <li key="6">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? '/' : '/login'} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {checkNav()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
