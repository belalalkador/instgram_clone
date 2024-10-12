import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  posts: {},
  selectPost: null,
  Notifications: [], 
};

const postsSlice = createSlice({
  name: 'post',
  initialState, 
  reducers: {
    
    setPosts(state, action) {
      state.posts = action.payload;
    },

      setSelectPost(state, action) {
      state.selectPost = action.payload;
    },

    
    setNotifications(state, action) {
      state.Notifications = action.payload; 
        },

    removeNotification(state, action) {
      const notificationId = action.payload;
      state.Notifications = state.Notifications.filter(
        (notification) => notification._id !== notificationId
      );
    },
  },
});

// Export the actions
export const { setPosts, setSelectPost, setNotifications, removeNotification } = postsSlice.actions;

// Export the reducer
export default postsSlice.reducer;
