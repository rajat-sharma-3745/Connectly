import React, { useRef, useState } from "react";
import Modal from "./shared/Modal";
import Avatar from "./Avatar";
import { readFileAsDataUrl } from "../utils/feature";
import { LuLoader } from "react-icons/lu";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useDispatch, useSelector } from "react-redux";
import { addPost, setPosts } from "../redux/slices/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const { user } = useSelector((s) => s.auth);
  const toast = useToast();
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    imageRef.current.click();
  };
  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (imagePreview) formData.append("image", file);
    formData.append("caption", caption);
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        API_PATHS.POST.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.success) {
        dispatch(addPost(data?.post));
        toast.success(data?.message);
        setCaption('');
        setImagePreview(null);
        setFile(null);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const fileChangeHandler = async (e) => {
    const File = e.target.files[0];
    if (File) {
      setFile(File);
      const dataUrl = await readFileAsDataUrl(File);
      setImagePreview(dataUrl);
    }
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)} clickOutside>
      <div className="md:w-[40vw] w-[70vw] p-3">
        <h1 className="text-xl font-semibold text-center">Create new post</h1>
        <div className="flex items-center gap-2 my-2">
          <Avatar src={user?.profilePicture} size="md" />
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-600">{user?.bio}</span>
          </div>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full h-40 p-4 mb-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Add a caption"
        ></textarea>
        {imagePreview && (
          <div className="w-full mb-2 h-auto max-w-full flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover "
            />
          </div>
        )}
        <div className="text-center">
          <input
            ref={imageRef}
            type="file"
            name=""
            id=""
            className="hidden"
            onChange={fileChangeHandler}
          />
          <button
            onClick={handleClick}
            className="cursor-pointer p-2 mb-1 rounded-md text-white font-semibold  bg-[#0095f6] hover:bg-[#938ffd]"
          >
            Select from Computer
          </button>
          {imagePreview &&
            (loading ? (
              <button className="  w-full text-sm font-medium text-white bg-black  p-[10px] rounded-md my-1  cursor-pointer flex items-center justify-center">
                <LuLoader className="animate-spin h-4" /> Please wait
              </button>
            ) : (
              <button
                onClick={createPostHandler}
                type="submit"
                className="w-full block mx-auto text-sm font-medium text-white bg-black  p-[10px] rounded-md my-1  cursor-pointer"
              >
                Post
              </button>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default CreatePost;
