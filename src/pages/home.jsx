import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import employeebg from "./../assets/bg.jpg";
import { UserInfoContext } from "../context/contextApi";

const Home = () => {
  const {user,accessToken}=useContext(UserInfoContext);
  const navigate = useNavigate();

  const handleClick = ()=>{
    if(!accessToken)
    navigate("/signup")
  }
  if(accessToken && user.role=="Employee"){
    navigate('/dashboard')
  }

  return (
   <div
  className="relative flex flex-col items-center justify-center min-h-screen px-6"
  style={{
    backgroundImage: `url(${employeebg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Dark overlay (this is where opacity works) */}
  <div className="absolute inset-0 bg-black opacity-60"></div>

  {/* Content */}
  <div className="relative text-center max-w-2xl text-white">
    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
      Welcome to Your CRM
    </h1>
    <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
      Manage your customers, track interactions, and grow your business — all in one place.
    </p>
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-2xl transform hover:scale-105 transition duration-300"
    >
      Get Started
    </button>
  </div>
</div>

  );
};

export default Home;
