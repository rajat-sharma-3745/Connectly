import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:[],
        messages:[],
        isChatOpen:false,
        chatSidebar:false
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setMessages:(state,action)=>{
            state.messages=action.payload
        },
        setNewMessage:(state,action)=>{
            const oldMessages = state.messages;
            state.messages = [...oldMessages,action.payload]
        },
        setIsChatOpen:(state,action)=>{
            state.isChatOpen=action.payload
        },
        setChatSidebar:(state,action)=>{
            state.chatSidebar=action.payload
        },
    }
})

export const {setOnlineUsers, setMessages, setNewMessage,setChatSidebar,setIsChatOpen} = chatSlice.actions;
export default chatSlice.reducer;