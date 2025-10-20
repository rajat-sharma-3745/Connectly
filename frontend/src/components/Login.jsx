import React, { useEffect, useState } from "react";
import Input from "./inputs/Input";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Link, useNavigate } from "react-router-dom";
import { LuLoader } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/slices/authSlice";

const Login = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  // const {user} = useSelector(state=>state.auth);
  //     useEffect(()=>{
  //       if(user){
  //       navigate('/');
  //     }
  //     },[user])
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
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, input);

      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        navigate("/");
        toast.success(response.data.message);

        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  // if(user) return null;
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form
        onSubmit={submitHandler}
        action=""
        className="shadow-lg flex flex-col gap-2 p-8"
      >
        <div>
          <h1 className="text-center text-xl font-bold">LOGO</h1>
          <p className="text-sm text-center">Login to see photos and videos</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
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
        {loading ? (
          <button className="btn-primary flex justify-center">
            <LuLoader className="animate-spin h-4" />
          </button>
        ) : (
          <button type="submit" className={`btn-primary`} disabled={loading}>
            Log in
          </button>
        )}
        <span className="text-center text-sm ">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-500 underline">
            SignUp
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
