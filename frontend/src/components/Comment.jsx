import React from 'react'
import Avatar from './Avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-3'>
        <div className='flex gap-3 items-center'>
            <Avatar size='md' src={comment?.author?.profilePicture}/>
            <h1 className='font-bold text-sm'>{comment?.author?.username} <span className='font-medium pl-1 break-words'>{comment?.text}</span> </h1>
        </div>
    </div>
  )
}

export default Comment