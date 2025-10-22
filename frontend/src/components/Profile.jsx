import React, { useEffect, useState } from "react";
import AppLayout from "./layout/AppLayout";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { CiAt } from "react-icons/ci";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaMessage, FaRegMessage } from "react-icons/fa6";
import { useToast } from "../context/ToastContext";
import { API_PATHS } from "../utils/apiPaths";
import { axiosInstance } from "../utils/axiosInstance";
import { updateFollowerCount } from "../redux/slices/authSlice";

const Profile = () => {
  const { id } = useParams();
  useGetUserProfile(id);
  const toast = useToast();
  const dispatch = useDispatch();

  const { user, selectedUser } = useSelector((s) => s.auth);
  const isLoggedInUserProfile = selectedUser?._id === user?._id;
  const [isFollowing, setIsFollowing] = useState(
    selectedUser?.isFollowing || false
  );
  const [followerCount, setFollowerCount] = useState(
    selectedUser?.followerCount || 0
  );
  const [activeTab, setActiveTab] = useState("posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (selectedUser?.followerCount !== undefined) {
      setFollowerCount(selectedUser.followerCount);
    }
    if (selectedUser?.isFollowing !== undefined) {
      setIsFollowing(selectedUser.isFollowing);
    }
  }, [selectedUser?.followerCount]);

  const displayedPost =
    activeTab === "posts"
      ? selectedUser?.posts || []
      : selectedUser?.bookmarks || [];
  const followOrUnfollowHandler = async () => {
    try {
      const { data } = await axiosInstance.post(
        API_PATHS.AUTH.FOLLOWORUNFOLLOW(selectedUser?._id)
      );
      if (data?.success) {
        const updatedFollowerCount = isFollowing
          ? followerCount - 1
          : followerCount + 1;
        setFollowerCount(updatedFollowerCount);
        setIsFollowing((p) => !p);
        // dispatch(updateFollowerCount())
        toast.success(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-5xl  w-full mx-auto ">
      <div className="flex flex-col gap-1 sm:gap-20 sm:p-8 p-4">
        <div className="hidden sm:grid grid-cols-2 gap-1">
          <section className="flex items-center justify-center">
            <Avatar
              className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20"
              src={selectedUser?.profilePicture}
            />
          </section>
          <section>
            <div className="flex flex-col md:gap-5 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold ">{selectedUser?.username}</span>
                {isLoggedInUserProfile ? (
                  <div>
                    <Link to={"/account/edit"}>
                      <button className="p-2 mr-1 rounded-sm text-sm bg-gray-200 hover:bg-gray-100 cursor-pointer ">
                        Edit Profile
                      </button>
                    </Link>
                    <button className="p-2 mr-1 rounded-sm text-sm bg-gray-200 hover:bg-gray-100 cursor-pointer ">
                      View Archive
                    </button>
                    {/* <button className="p-2 rounded-sm text-sm bg-gray-200 hover:bg-gray-100 cursor-pointer ">
                      Ad tools
                    </button> */}
                  </div>
                ) : isFollowing ? (
                  <>
                    <button
                      onClick={followOrUnfollowHandler}
                      className="p-2 font-semibold rounded-sm text-sm bg-gray-200  hover:bg-gray-300 cursor-pointer "
                    >
                      Unfollow
                    </button>
                    <button className="p-2 font-semibold rounded-sm text-sm bg-gray-200  hover:bg-gray-300 cursor-pointer ">
                      Message
                    </button>
                  </>
                ) : (
                  <button
                    onClick={followOrUnfollowHandler}
                    className="p-2 font-semibold rounded-sm text-sm bg-sky-500 text-white hover:bg-sky-600 cursor-pointer "
                  >
                    Follow
                  </button>
                )}
              </div>

              <div className="flex items-center md:gap-5 gap-3">
                <p>
                  {" "}
                  <span className="font-semibold">
                    {selectedUser?.posts?.length}{" "}
                  </span>
                  Posts
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">{followerCount} </span>
                  Followers
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">
                    {selectedUser?.followingCount}{" "}
                  </span>
                  Followings
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-lg">
                  {selectedUser?.bio || "Bio here..."}
                </span>
                <span className="bg-gray-200 p-2 w-max rounded-xl  text-black">
                  <CiAt size={22} className="inline" />{" "}
                  <span className="pl-1"> {selectedUser?.username}</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col gap-10 ">
          {" "}
          <div>
            <div className="flex justify-between ">
              <div className="flex items-center ">
                <Avatar src={selectedUser?.profilePicture} size="md" />
              </div>
              <div className="flex flex-col  gap-2">
                <div className="flex items-center text-sm gap-3">
                  <p>
                    {" "}
                    <span className="font-semibold block text-center">
                      {selectedUser?.posts?.length}{" "}
                    </span>
                    Posts
                  </p>
                  <p>
                    {" "}
                    <span className="font-semibold block text-center">
                      {followerCount}{" "}
                    </span>
                    Followers
                  </p>
                  <p>
                    {" "}
                    <span className="font-semibold block text-center">
                      {selectedUser?.followingCount}{" "}
                    </span>
                    Followings
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold ">{selectedUser?.username}</span>

              <span className="text-xs">
                {" "}
                {selectedUser?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <div className="flex  items-center justify-center gap-2">
            {isLoggedInUserProfile ? (
              <>
                <Link to={"/account/edit"} className="w-full">
                  <button className="p-2 mr-1 w-full rounded-lg text-sm bg-gray-200 hover:bg-gray-100 cursor-pointer ">
                    Edit Profile
                  </button>
                </Link>
              </>
            ) : isFollowing ? (
              <>
                <button
                  onClick={followOrUnfollowHandler}
                  className="p-2 font-semibold rounded-sm text-sm bg-gray-200  hover:bg-gray-300 cursor-pointer "
                >
                  Unfollow
                </button>
                <button className="p-2 font-semibold rounded-sm text-sm bg-gray-200  hover:bg-gray-300 cursor-pointer ">
                  Message
                </button>
              </>
            ) : (
              <button
                onClick={followOrUnfollowHandler}
                className="p-2 font-semibold rounded-sm text-sm bg-sky-500 text-white hover:bg-sky-600 cursor-pointer "
              >
                Follow
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              onClick={() => handleTabChange("posts")}
              className={`${
                activeTab === "posts"
                  ? "border-b border-gray-400 font-bold"
                  : ""
              } py-3 cursor-pointer`}
            >
              POSTS
            </span>
            <span
              onClick={() => handleTabChange("saved")}
              className={`${
                activeTab === "saved"
                  ? "border-b border-gray-400 font-bold"
                  : ""
              } py-3 cursor-pointer`}
            >
              SAVED
            </span>
          </div>
          <div className="w-full grid grid-cols-3 gap-2">
            {displayedPost.map((post) => {
              return (
                <div key={post?._id} className="relative   cursor-pointer m-1">
                  <img
                    src={post?.image}
                    className="rounded-sm sm:w-full h-20 sm:h-auto  sm:object-cover "
                    alt=""
                  />
                  <div className="rounded absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4 font-bold text-lg">
                      <button className="flex items-center gap-2">
                        <FaRegHeart /> <span>{post?.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-2">
                        <FaRegMessage /> <span>{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout()(Profile);
