import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { checkValidation } from "../../checkValidation";
import { UserContext } from "../../App";

const Login = () => {
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const postData = () => {
    const check = checkValidation;
    if (!check.test(email) && password) {
      M.toast({
        html: "Invalid Email",
        classes: "rounded #ef5350 red lighten-1",
        displayLength: 1000,
        outDuration: 900,
      });
      return;
    } else {
      fetch("http://localhost:5000/login", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.Error) {
            console.log(data);
            M.toast({
              html: data.Error,
              classes: "rounded #ef5350 red lighten-1",
              displayLength: 2000,
              outDuration: 900,
            });
          } else {
            localStorage.setItem("jwt", data.Token);
            localStorage.setItem("user", JSON.stringify(data.User));
            dispatch({ type: "USER", payload: data.User });
            // console.log("In Login.js ---> State ==> ",state);
            M.toast({
              html: data.Msg,
              classes: "rounded #43a047 green darken-1",
              displayLength: 2000,
              outDuration: 900,
            });
            console.log(data);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h3>Instagram</h3>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-dark #64b5f6 blue darken-1"
          onClick={() => {
            postData();
          }}
        >
          Login
        </button>
        <h6>
          <Link to="/signup">Don't have any account?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;
