import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import "../../Styles/Profile.scss";

const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [profile, setProfile] = useState(null);
  const [showfollow, setShowfollow] = useState(state ? (!state.following.includes(userid)) : true);
  const history = useHistory();
  

  // console.log("Home.js --> State = ", state);
  // console.log(userid);
  useEffect(() => {
    console.log("useEffect called!");
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log("userid = ", userid);
        // console.log("result = ", result);
        setProfile(result);
        // const profile = localStorage.getItem(profile);
      })
      .catch((err) => console.log("Error: ", err));
    // console.log("At end -- state = ",state);
  }, []);

  const followUser = () => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ followId: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: {
            follower: data.User.follower,
            following: data.User.following,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.User));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              follower: [...prevState.user.follower, data.User._id],
            },
          };
        });
        setShowfollow(false);
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ unfollowId: userid }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch({
          type: "UPDATE",
          payload: {
            follower: data.User.follower,
            following: data.User.following,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.User));
        setProfile((prevState) => {
          const newFollow = prevState.user.follower.filter(
            (item) => item !== data.User._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              follower: newFollow,
            },
          };
        });
        setShowfollow(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {profile ? (
        <div className="p-container">
          <div className="container">
            <div className="container-left">
              <img src={profile.user.pic} alt="" />
            </div>
            <div className="container-right">
              <h6>{profile.user.name}</h6>
              <h6>{profile.user.email}</h6>
              <div className="stats">
                <p>{profile.posts.length} posts</p>
                <p>{profile.user.follower.length} followers</p>
                <p>{profile.user.following.length} following</p>
              </div>
              <div className="follow-content">
                {showfollow ? (
                  <button
                    className="btn waves-effect waves-light #64b5f6 blue darkend-1"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      followUser();
                    }}
                  >
                    follow
                  </button>
                ) : (
                  <button
                    className="btn waves-effect waves-light #bdbdbd grey lighten-1"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      unfollowUser();
                    }}
                  >
                    unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {profile.posts.map((item) => {
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
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default UserProfile;
