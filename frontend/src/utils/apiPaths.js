export const server = import.meta.env.VITE_BACKEND_URL


export const API_PATHS = {
    AUTH:{
        LOGIN:'/user/login',
        LOGOUT:'/user/logout',
        SIGNUP:'/user/register',
        PROFILE:'/user/profile',
        EDITPROFILE:'/user/profile/edit',
        USERPROFILE:(id)=>`/user/${id}/profile`,
        SUGGESTED:'/user/suggested',
        FOLLOWORUNFOLLOW:(id)=>`/user/followOrUnfollow/${id}`
    },
    POST:{
        CREATE:'/post/addPost',
        GETALLPOST:'/post/all',
        DELETE:(id)=>`/post/delete/${id}`,
        LIKE:(id,action)=>`/post/${id}/${action}`,
        COMMENT:(id)=>`/post/${id}/comment`,
        BOOKMARK:(id)=>`/post/${id}/bookmark`,
        GETALLCOMMENT:(id)=>`/post/${id}/comment/all`,
    },
    MESSAGE:{
        SEND:(id)=>`/message/send/${id}`,
        GET:(id)=>`/message/all/${id}`,
    }
}