import React, { useState } from "react";
import Input from "./inputs/Input";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Link, useNavigate } from "react-router-dom";
import { LuLoader } from "react-icons/lu";

const Signup = () => {
  const toast = useToast();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeHanlder = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (Object.values(input).includes("")) {
      toast.info("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, input);

      if (response.data.success) {
        navigate('/');
        toast.success(response.data.message);

        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form
        onSubmit={submitHandler}
        action=""
        className="shadow-lg flex flex-col gap-2 p-8"
      >
        <div>
          <h1 className="text-center text-xl font-bold">LOGO</h1>
          <p className="text-sm text-center">Signup to see photos and videos</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Input
            name={"username"}
            placeholder={"John"}
            label={"Username"}
            type={"text"}
            value={input.username}
            onChange={changeHanlder}
          />
          <Input
            name={"email"}
            placeholder={"john@abc.com"}
            label={"Email"}
            type={"email"}
            value={input.email}
            onChange={changeHanlder}
          />
          <Input
            name={"password"}
            placeholder={"*********"}
            label={"Password"}
            type={"password"}
            value={input.password}
            onChange={changeHanlder}
          />
        </div>
        {
          loading? (
            <button className="btn-primary flex justify-center">
              <LuLoader className='animate-spin h-4'/>
            </button>
          ):(
        <button
          type="submit"
          className={`btn-primary`}
          disabled={loading}
        >
          Sign up
        </button>)
        }
        <span className="text-center text-sm ">Already have an account? <Link to={'/login'} className="text-blue-500 underline">Login</Link></span>
      </form>
    </div>
  );
};

export default Signup;
