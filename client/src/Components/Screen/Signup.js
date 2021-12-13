import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { checkValidation } from "../../checkValidation";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "king1");
    fetch("https://api.cloudinary.com/v1_1/king1/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url))
      .catch((err) => console.log("Error ==> ", err));
  };
  const uploadFields = () => {
    const check = checkValidation;
    if (!check.test(email) && name && password) {
      M.toast({
        html: "Invalid Email",
        classes: "rounded #ef5350 red lighten-1",
        displayLength: 1000,
        outDuration: 900,
      });
    } else {
      fetch("http://localhost:5000/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, pic: url }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.Error) {
            console.log(data.Error);
            M.toast({
              html: data.Error,
              classes: "rounded #ef5350 red lighten-1",
              displayLength: 2000,
              outDuration: 900,
            });
          } else {
            M.toast({
              html: data.Msg,
              classes: "rounded #43a047 green darken-1",
              displayLength: 2000,
              outDuration: 900,
            });
            history.push("/login");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const postData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard input-field">
      <div className="card auth-card">
        <h3>Instagram</h3>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
            <span>Upload pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-dark #64b5f6 blue darken-1"
          onClick={() => {
            postData();
          }}
        >
          Signup
        </button>
        <h6>
          <Link to="/login">Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signup;
