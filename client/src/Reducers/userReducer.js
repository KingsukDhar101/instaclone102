export const initialState = null;
export const reducer = (state, action)=>{
  if(action.type === "USER"){
    // console.log("In reducer -- payload = ",action.payload);
    return action.payload;
  }
  if (action.type === "CLEAR") {
    // console.log("In reducer -- payload = ",action.payload);
    return action.payload;
  }
  if(action.type === "UPDATE"){
    return {
      ...state,
      follower: action.payload.follower,
      following: action.payload.following,
    };
  }
  if(action.type === "UPDATEPIC"){
    // console.log("payload.pic = ",action.payload.pic);
    return{
      ...state,
      pic: action.payload,
    }
  }
  // console.log("In reducer -- state = ",state)
  return state;
  
  
}