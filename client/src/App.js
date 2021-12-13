import React, { useEffect, useReducer, useContext } from "react";
import "./Styles/App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Screen/Home";
import Login from "./Components/Screen/Login";
import Signup from "./Components/Screen/Signup";
import Profile from "./Components/Screen/Profile";
import UserProfile from "./Components/Screen/UserProfile";
import CreatePost from "./Components/Screen/CreatePost";
import Subpost from "./Components/Screen/Subpost";
import { reducer, initialState } from "./Reducers/userReducer";

export const UserContext = React.createContext();

const Routing = () => {
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  // console.log("In App.js ::  state : ", state);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // console.log("In App.js --  User = ",user);
      dispatch({ type: "USER", payload: user });
    } else {
      // console.log("In App.js --  User = ", user);
      dispatch({ type: "CLEAR" });
      history.push("/login");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/createPost">
        <CreatePost />
      </Route>
      <Route path="/getsubpost">
        <Subpost />
      </Route>
    </Switch>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log("State = ", state);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
