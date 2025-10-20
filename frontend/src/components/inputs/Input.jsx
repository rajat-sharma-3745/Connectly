import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({name, value, onChange, label, type, placeholder }) => {
  const [showPass, setShowPass] = useState(false);
  const toggleShowPassword = () => {
    setShowPass((p) => !p);
  };
  return (
    <div>
      <label htmlFor="" className="text-md text-slate-800 ">
        {label}
      </label>
      <div className="input-box">
        <input name={name}
          type={type == "password" ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="bg-transparent outline-none w-full"
        />
        {type === "password" &&
          (showPass ? (
            <FaRegEye
              size={22}
              className="text-primary cursor-pointer"
              onClick={() => toggleShowPassword()}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="ext-slate-400 cursor-pointer"
              onClick={() => toggleShowPassword()}
            />
          ))}
      </div>
    </div>
  );
};

export default Input;
