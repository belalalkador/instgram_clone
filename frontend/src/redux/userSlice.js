import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user
let initialState = {
  user:{},
  suggestUser:{},
};

const userSlice = createSlice({
  name: "user",
  initialState, // Correctly assign initialState
  reducers: {
    // Action to set user name
    setUserInfo(state, action) {
      state.user = action.payload;
    },
    setSuggestUser(state, action) {
      state.suggestUser = action.payload;
    }
  }
});

// Export the actions
export const { setUserInfo ,setSuggestUser} = userSlice.actions;

// Export the reducer
export default userSlice.reducer;