import React from "react";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((s) => s.auth);
  return (
    <div className="my-10 pr-20 ">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar size="md" src={user?.profilePicture} />
        </Link>
        <div className="">
          <h1 className="font-semibold text-sm">{user.username}</h1>
          <span className="text-gray-600 text-sm">{user?.bio}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  );
};

export default RightSidebar;
