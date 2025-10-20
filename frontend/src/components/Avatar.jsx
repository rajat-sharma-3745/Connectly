import React from 'react'
import { FaUserAlt } from "react-icons/fa";

const Avatar = ({src,alt,size='md',className=''}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-14 h-14",
    xl: "w-24 h-24"
  };

  const iconSizes = {
    sm: 12,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <div className={`${sizeClasses[size]} ${className} flex justify-center items-center rounded-full bg-gray-200 overflow-hidden`}>
        {src?
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        : null }
    <FaUserAlt size={iconSizes[size]} className={`text-gray-500 ${src?'hidden':'block'}`}/>
        
    </div>
  )
}

export default Avatar