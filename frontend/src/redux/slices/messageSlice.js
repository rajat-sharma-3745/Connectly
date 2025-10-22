import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:'message',
    initialState:{
        newMessagesAlert:[]
    },

    reducers:{
        setMessageAlert:(state,action)=>{
            const userId = action.payload.userId;
           const index = state.newMessagesAlert.findIndex((item) => item.userId === userId);
            if (index !== -1) state.newMessagesAlert[index].count += 1;
            else {
                state.newMessagesAlert.push({
                    userId,
                    count: 1
                })
            }
        },
        resetMessageAlert:(state,action)=>{
            state.newMessagesAlert = state.newMessagesAlert.filter((item)=>item.userId!==action.payload)
        }
    }
})


export const {setMessageAlert, resetMessageAlert} = messageSlice.actions
export default messageSlice.reducer