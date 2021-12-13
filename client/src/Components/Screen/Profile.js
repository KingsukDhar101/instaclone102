import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../../App";
import "../../Styles/Profile.scss";

const Profile = () => {
  const [MyPosts, setMyPosts] = useState([]);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  // eslint-disable-next-line
  const history = useHistory();

  // console.log("Home.js --> State = ", state);
  useEffect(() => {
    console.log("useEffect called!");
    fetch("http://localhost:5000/mypost", {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.mypost);
        setMyPosts(result.mypost);
        // console.log('state: ',state);
      })
      .catch((err) => console.log("Error: ", err));
    // console.log("At end -- state = ",state);
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "king1");
      fetch("https://api.cloudinary.com/v1_1/king1/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("http://localhost:5000/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log('result = ',result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              // console.log("end : ",state);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log("Error ==> ", err));
    }
  }, [image]);

  const uploadPic = (file) => {
    setImage(file);
  };

  return (
    <div className="p-container">
      <div className="container">
        <div className="container-left">
          <img src={state ? state.pic : "loading..."} alt="" />
          <div className="file-field input-field">
            <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
              <span>Upload pic</span>
              <input
                type="file"
                onChange={(e) => uploadPic(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div className="container-right">
          <h4>{state ? state.name : "loading"}</h4>
          <div className="stats">
            <h6>{MyPosts ? MyPosts.length : "No "} posts</h6>
            <h6>{state ? state.follower.length : 0} followers</h6>
            <h6>{state ? state.following.length : 0} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {MyPosts.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
