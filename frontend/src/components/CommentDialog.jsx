import React, { useEffect, useState } from "react";
import Modal from "./shared/Modal";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { MdMoreHoriz } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { addComment, addCommentSelectedPost } from "../redux/slices/postSlice";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const CommentDialog = ({ user,post, open, setOpen }) => {
  const { selectedPost } = useSelector((s) => s.post);
  const dispatch = useDispatch();
  const toast = useToast();
  const [text, setText] = useState("");
  const [openSetting, setOpenSetting] = useState(false);
   const [isFollowing, setIsFollowing] = useState(
      selectedPost?.author?.isFollowing || false
    );
  const changeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const sendCommentHandler = async () => {
    try {
      const { data } = await axiosInstance.post(
        API_PATHS.POST.COMMENT(selectedPost?._id),
        { text }
      );
      if (data?.success) {
        dispatch(
          addComment({ postId: selectedPost?._id, comment: data.comment })
        );
        dispatch(addCommentSelectedPost(data.comment));
        toast.success(data?.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
   const followOrUnfollowHandler = async () => {
      try {
        const { data } = await axiosInstance.post(
          API_PATHS.AUTH.FOLLOWORUNFOLLOW(selectedPost?.author?._id)
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
      if(selectedPost?.author?.isFollowing!== undefined){
        setIsFollowing(selectedPost?.author?.isFollowing)
      }
    },[selectedPost?.author?.isFollowing])
  if (!open) return null;
  return (
    <Modal clickOutside open={open} onClose={() => setOpen(false)}>
      <div className="w-[70vw]  flex flex-col">
        <div className="flex md:flex-row flex-col  ">
          <div className="sm:w-1/2">
            <img
              className="rounded-l-md w-full h-full md:object-contain "
              src={selectedPost?.image}
              alt=""
            />
          </div>
          <div className="sm:w-1/2 flex flex-col px-1 ">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar
                    src={selectedPost?.author?.profilePicture}
                    size="md"
                  />
                </Link>
                <div>
                  <Link className="font-semibold text-sm">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span className="text-sm text-gray-600">Bio here</span> */}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setOpenSetting(true)}
                  className="cursor-pointer"
                >
                  <MdMoreHoriz />
                </button>
              </div>
            </div>
            <div className="h-0.5 w-full bg-gray-200"></div>
            <div className=" overflow-y-auto sm:max-h-64 max-h-36 p-2">
              {selectedPost?.comments &&
                selectedPost?.comments.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
            </div>
            <div className="p-4 flex items-center">
              <input
                type="text"
                value={text}
                onChange={changeHandler}
                placeholder="Add a comment..."
                className="w-full outline-none border border-gray-400 p-2 rounded-l"
              />
              <button
                disabled={!text.trim()}
                onClick={sendCommentHandler}
                className="disabled:cursor-not-allowed disabled:bg-gray-200 cursor-pointer hover:bg-gray-100 p-2 bg-white border-r border-t border-b border-gray-400 font-semibold rounded-r "
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openSetting}
        onClose={() => setOpenSetting(false)}
        closeButton
      >
        <div className="w-[70vw] md:w-[20vw] py-2 flex flex-col justify-center items-center  ">
          { user && user?._id !== post?.author._id &&
        (!isFollowing ? (<button
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
          </button>)
           
          )}
          <button
            className="py-2  font-bold cursor-pointer"
            onClick={() => {
              console.log("Add to favorites");
            }}
          >
            Add to favorites
          </button>
        </div>
      </Modal>
    </Modal>
  );
};

export default CommentDialog;
