import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import postsReducer from "./postSlice.js";
import socetReducer from "./socket.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postsReducer,
    socket: socetReducer,
  },
});

export default store;
