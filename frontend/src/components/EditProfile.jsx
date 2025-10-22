import React, { useEffect, useRef, useState } from "react";
import AppLayout from "./layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { FiChevronDown } from 'react-icons/fi';
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { LuLoader } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "../redux/slices/authSlice";
import { readFileAsDataUrl } from "../utils/feature";


const options=[
    {label:"Male",value:'male'},
    {label:"Female",value:'female'},
]

const EditProfile = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const imageRef = useRef(null);
  const [open,setOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePicture);
  const [bio,setBio] = useState(user?.bio);
  const [gender,setGender] = useState(user?.gender);
  const [loading,setLoading] = useState(false);
  const [previewImage,setPreviewImage] = useState(null);
  const selectRef = useRef(null);

  const fileHandler = () => {
    imageRef.current.click();
  }
  const fileChangeHandler = async(e) => {
    const file = e.target.files[0];
    if(file){
        const image = await readFileAsDataUrl(file)
        setPreviewImage(image)
        setProfilePhoto(file);
    }
  }
  const toggleSelect = () => setOpen(p=>!p);

  const editProfileHandler = async() => {
    try {
        setLoading(true);
        const formData = new FormData();
        formData.append('bio',bio)
        formData.append('gender',gender)
        formData.append('profilePicture',profilePhoto)
        const {data} = await axiosInstance.post(API_PATHS.AUTH.EDITPROFILE,formData,{
            headers:{
                "Content-Type":'multipart/form-data'
            }
        });
        if(data?.success){
            const updatedData = {
                ...user,
                bio:data?.user.bio,
                gender:data?.user.gender,
                profilePicture:data?.user.profilePicture,
            }
            dispatch(setAuthUser(updatedData));
            navigate(`/profile/${user?._id}`)
            toast.success(data?.message)
        } 
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    }
    finally{
        setLoading(false);
    }
  }
   useEffect(() => {
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


  return (
    <div className="max-w-2xl mx-auto">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl p-1">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-200 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Avatar size="md" src={previewImage?previewImage:profilePhoto} />
            <div className="">
              <h1 className="font-bold ">{user.username}</h1>
              <span className="text-gray-600 ">{user?.bio}</span>
            </div>
          </div>
          <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
          <button onClick={fileHandler} className="bg-sky-500 cursor-pointer hover:bg-sky-600 transition-colors duration-300 text-white font-bold py-2 px-5 rounded-md ">Change photo</button>
        </div>

        <div>
            <h1 className="font-semibold text-xl mb-2">Bio</h1>
            <textarea
          value={bio} onChange={({target})=>setBio(target.value)}
          className="w-full h-40 p-4 mb-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Add Bio"
        ></textarea>
        </div>
        <div>
            <h1 className="font-semibold mb-2">Gender</h1>
            <div ref={selectRef} onClick={toggleSelect} className="relative bg-white border border-gray-300 rounded-xl px-4 py-3 cursor-pointer w-full">
                <div className="flex items-center justify-between gap-3">
                   {gender?options.map((option)=>gender === option.value && option.label ) :'Select a option'} <FiChevronDown/>
                </div>
                {open && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                        {
                            options.map((option)=>(
                                <div key={option.value} onClick={()=>{setGender(option.value);}} className="text-center px-4 py-3 hover:bg-gray-100 cursor-pointer" >
                                  {option.label}
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
        <button onClick={editProfileHandler} className="bg-black cursor-pointer transition-colors duration-300 text-white font-semibold p-2 rounded-lg flex items-center justify-center"> 
            {loading? (<> <LuLoader size={20} className="animate-spin"/> Please Wait</>) :"Submit"}
        </button>
      </section>
    </div>
  );
};

export default AppLayout()(EditProfile);
