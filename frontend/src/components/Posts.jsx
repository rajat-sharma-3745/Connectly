import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(state=>state.post)
  const {user} = useSelector(state=>state.auth)
  return (
    <div>
     {   posts.map((post,index)=>(
        <Post key={post._id} post={post} user={user}/>
     ))}
    </div>
  )
}

export default Posts