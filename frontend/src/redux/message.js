import { createSlice } from "@reduxjs/toolkit";

let initialState={
    message:[],
    onlineUser:[],
    friend:{}
}
const messageProcess= createSlice({
    name:"message",
    initialState,
    reducers:{
        setOnlineUser(state,action){ 
          state.onlineUser= action.payload
        },
        setFriend(state,action){
            state.friend= action.payload
        }
    }
})
export const {setOnlineUser,setFriend} = messageProcess.actions

export default messageProcess.reducer;