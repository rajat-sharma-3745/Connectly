import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Modal from "./shared/Modal";
import { MdMoreHoriz, MdOutlineMessage } from "react-icons/md";
import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import CommentDialog from "./CommentDialog";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useDispatch } from "react-redux";
import {
  addComment,
  deletePost,
  setSelectedPost,
  updateLike,
} from "../redux/slices/postSlice";
import { LuLoader } from "react-icons/lu";

const Post = ({ post, user }) => {
  const toast = useToast();

  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [commentOpen, setCommentOpen] = useState(false);
  const [dltLoading, setDltLoading] = useState(false);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  let [likeCount, setLikeCount] = useState(post?.likes.length);
    const [isFollowing, setIsFollowing] = useState(
        post?.author?.isFollowing || false
      );
  // console.log(post?.likes.length)
  // const commentModalRef = useRef(null);
  const changeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const deleteHandler = async () => {
    try {
      setDltLoading(true);
      const { data } = await axiosInstance.delete(
        API_PATHS.POST.DELETE(post?._id)
      );
      if (data?.success) {
        toast.success(data?.message);
        dispatch(deletePost(post?._id));
        setModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setDltLoading(false);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const { data } = await axiosInstance.post(
        API_PATHS.POST.LIKE(post._id, action)
      );
      if (data?.success) {
        const updatedLikesCount = liked ? likeCount - 1 : likeCount + 1;
        setLikeCount(updatedLikesCount);
        setLiked((p) => !p);
        dispatch(updateLike({ userId: user?._id, liked, postId: post?._id }));
        toast.success(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const { data } = await axiosInstance.post(
        API_PATHS.POST.COMMENT(post?._id),
        { text }
      );
      if (data?.success) {
        dispatch(addComment({ postId: post?._id, comment: data.comment }));
        toast.success(data?.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHanlder = async () => {
    try {
      const { data } = await axiosInstance.get(
        API_PATHS.POST.BOOKMARK(post?._id)
      );
      if (data?.success) {
        toast.success(data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  const followOrUnfollowHandler = async () => {
        try {
          const { data } = await axiosInstance.post(
            API_PATHS.AUTH.FOLLOWORUNFOLLOW(post?.author?._id)
          );
          if (data?.success) {
            
            setIsFollowing((p) => !p);
            // dispatch(updateFollowerCount())
            toast.success(data?.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      };
  useEffect(()=>{
        if(post?.author?.isFollowing!== undefined){
          setIsFollowing(post?.author?.isFollowing)
        }
      },[post?.author?.isFollowing])

  // useEffect(()=>{
  //    const handleClickOutside = (e) => {
  //     if(commentModalRef.current && !commentModalRef.current.contains(e.target)){
  //         setCommentOpen(false);
  //     }
  //    }
  //     document.addEventListener('mousedown',handleClickOutside)
  //    return () => document.removeEventListener('mousedown',handleClickOutside)
  // },[])
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar size="md" src={post?.author?.profilePicture} />
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-lg">{post?.author.username}</h1>
            {user?._id === post?.author?._id && (
              <div className="bg-black p-1.5 rounded-2xl text-xs text-white">
                Author
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={() => setModalOpen(true)} className="cursor-pointer">
            <MdMoreHoriz />
          </button>
        </div>
      </div>
      <img
        className="rounded-sm my-2 h-auto w-full  bg-gray-50"
        src={post?.image}
        alt=""
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              style={{ fill: "red" }}
              size={22}
              className={`cursor-pointer`}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className={`cursor-pointer`}
            />
          )}
          <MdOutlineMessage
            onClick={() => {
              dispatch(setSelectedPost(post));
              setCommentOpen(true);
            }}
            size={22}
            className="cursor-pointer hover:text-gray-600"
          />
          <IoIosSend size={22} className="cursor-pointer hover:text-gray-600" />
        </div>
        <FaRegBookmark
        onClick={bookmarkHanlder}
          size={22}
          className=" font-bold cursor-pointer hover:text-gray-600"
        />
      </div>

      <span className="font-semibold block mb-2">{likeCount} Likes</span>
      <p>
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post?.caption}
      </p>
      {post.comments.length > 0 && (
        <span
          className="cursor-pointer text-gray-400"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setCommentOpen(true);
          }}
        >
          View all {post?.comments.length} comments
        </span>
      )}
      <CommentDialog user={user} post={post} open={commentOpen} setOpen={setCommentOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeHandler}
          placeholder="Add a comment"
          className="outline-none text-sm w-full"
        />
        {text !== "" && (
          <span
            className="text-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeButton>
        <div className="w-[80vw] md:w-[25vw] p-7 flex flex-col justify-center items-center gap-3 ">
         { user && user?._id !== post?.author._id && (!isFollowing ? (<button
            className="py-1 rounded-sm  font-bold cursor-pointer p-2 bg-sky-400 text-white"
            onClick={followOrUnfollowHandler}
          >
            Follow
          </button>) : (
            <button
            className="py-1 rounded-lg  font-bold cursor-pointer p-2 bg-red-500 text-white"
            onClick={followOrUnfollowHandler}
          >
            Unfollow
          </button>))
          }
          <button
            className="p-2  font-bold cursor-pointer"
            onClick={() => {
              console.log("Add to favorites");
            }}
          >
            Add to favorites
          </button>
          {user && user?._id === post?.author._id && (
            <button
              className="p-2   font-bold cursor-pointer"
              onClick={deleteHandler}
            >
              {dltLoading ? (
                <span>
                  <LuLoader className="animate-spin" /> Deleting...
                </span>
              ) : (
                <span>Delete</span>
              )}
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Post;
