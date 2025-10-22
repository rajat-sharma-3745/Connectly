import { createSlice } from "@reduxjs/toolkit";


const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    selectedPost: null
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload)
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload)
    },
    updateLike: (state, action) => {
      const { userId, liked, postId } = action.payload;
      const post = state.posts.find((post) => post._id === postId)

      if (!post) return;

      if (liked) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
      }
    },
    addComment: (state, action) => {
      const { comment, postId } = action.payload;
      const post = state.posts.find((post) => post._id === postId)

      if (!post) return;

      post.comments.push(comment);
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload
    },
    addCommentSelectedPost: (state, action) => {
      state.selectedPost.comments.push(action.payload)
    },
    
  }
})


export const { setPosts, addPost, deletePost, updateLike, addComment, setSelectedPost, addCommentSelectedPost } = postSlice.actions;
export default postSlice.reducer