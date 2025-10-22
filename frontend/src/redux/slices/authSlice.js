import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
        suggestedUsers: [],
        selectedUser:null,
        selectedChatUser:null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        logoutUser: (state, action) => {
            state.user = null;
            state.loading = false;

        },
        setSuggestedUser: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setSelectedChatUser: (state, action) => {
            state.selectedChatUser = action.payload
        },
        updateFollowerCount : (state,action)=>{
            state.selectedUser.followerCount = action.payload
        }

    }
})


export const { setAuthUser, logoutUser, setSuggestedUser, setSelectedUser, setSelectedChatUser,updateFollowerCount } = authSlice.actions;

export default authSlice.reducer;