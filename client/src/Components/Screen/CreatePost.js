import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../../Styles/CreatePost.scss";
import M from "materialize-css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (url) {
      fetch("http://localhost:5000/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ title, body, url }),
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
            console.log(data);
            M.toast({
              html: data.Msg,
              classes: "rounded #43a047 green darken-1",
              displayLength: 2000,
              outDuration: 900,
            });
            history.push("/");
          }
        })
        .catch((error) => console.log("Error in createPost : ", error));
    }
    // eslint-disable-next-line
  }, [url]);

  const postDetails = () => {
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
        .then((data) => setUrl(data.url))
        .catch((err) => console.log("Error ==> ", err));
    } else {
      const error = "please add all the fields";
      console.log(error);
      M.toast({
        html: error,
        classes: "rounded #ef5350 red lighten-1",
        displayLength: 2000,
        outDuration: 900,
      });
    }
  };

  return (
    <div className="card input-filed">
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-2"
        onClick={() => {
          postDetails();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default CreatePost;
