import React, { useState, useEffect, useContext } from "react";
import "../../Styles/Home.scss";
import { UserContext } from "../../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Subpost = () => {
  const [data, setData] = useState([]);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    fetch("http://localhost:5000/getsubpost", {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("All Post : ", result.post);
        setData(result.post);
      })
      .catch((err) => console.log("Error in Post :: ", err));
  }, []);

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result.Data._id) {
            return result.Data;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result.Data._id) {
            return result.Data;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const lovePost = (id) => {
    fetch("http://localhost:5000/love", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result.Data._id) {
            return result.Data;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const unlovePost = (id) => {
    fetch("http://localhost:5000/unlove", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result.Data._id) {
            return result.Data;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const makeComment = (text, postId) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result.Data._id) {
            return result.Data;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log("NewData = ", newData);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const deletePost = async (postId) => {
    fetch(`http://localhost:5000/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        M.toast({
          html: result.Msg,
          classes: "rounded #43a047 green darken-1",
          displayLength: 2000,
          outDuration: 900,
        });
        const newData = data.filter((item) => {
          return item._id !== result.Data._id;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  if (data.length === 0) {
    return <h2>No post</h2>;
  } else {
    return (
      <div className="home">
        {data.map((item) => {
          return (
            <div key={item._id} className="card home-card">
              <div className="header-container">
                <p>
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}
                  </Link>
                </p>
                {item.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{ display: "block" }}
                    onClick={() => {
                      deletePost(item._id);
                    }}
                  >
                    delete
                  </i>
                )}
              </div>
              <div className="card-image">
                <img src={item.photo} alt="" />
              </div>
              <div className="card-content">
                <div className="likes-content">
                  {item.love.includes(state._id) ? (
                    <i
                      className="material-icons icon-red"
                      onClick={() => {
                        unlovePost(item._id);
                      }}
                    >
                      favorite
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => {
                        lovePost(item._id);
                      }}
                    >
                      favorite_border
                    </i>
                  )}

                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      onClick={() => {
                        unlikePost(item._id);
                      }}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => {
                        likePost(item._id);
                      }}
                    >
                      thumb_up
                    </i>
                  )}
                </div>
                <h6>{item.likes.length} likes</h6>
                <h6>{item.title}</h6>
                <p
                  style={{
                    marginBottom: "5px",
                    paddingBottom: "5px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  {item.body}
                </p>

                {item.comments.map((record) => {
                  return (
                    <h6 className="comment-container" key={record._id}>
                      <span className="commentedBy">
                        {record.commentedBy.name}
                      </span>
                      <span>:</span>
                      <span className="comment" style={{ fontSize: "0.8em" }}>
                        {record.text}
                      </span>
                      {/* <span className="delete-comment">
                        <i 
                          id="delete-icon"
                          className="material-icons"
                        >
                          delete
                        </i>
                      </span> */}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    makeComment(e.target[0].value, item._id);
                  }}
                >
                  <input type="text" placeholder="add a comment" />
                </form>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default Subpost;
