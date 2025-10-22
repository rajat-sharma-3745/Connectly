import { createSlice } from "@reduxjs/toolkit";

const notiSlice = createSlice({
    name:'notification',
    initialState:{
        likeNotification:[]
    },
    reducers:{
        setLikeNotifications:(state,action)=>{
            if(action.payload.type==='like'){
              state.likeNotification.push(action.payload)
            }else if(action.payload.type==='dislike'){
                state.likeNotification = state.likeNotification.filter((item)=>item.userId!==action.payload.userId)
            }
        }
    }
})

export const {setLikeNotifications} = notiSlice.actions;
export default notiSlice.reducer