import React, { use } from "react";
import Login from "./Login";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";


function Signup() {
    const location=useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
     const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm()
  
    const onSubmit = async (data) => {
      const userInfo = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,    
      }
      await axios.post("http://localhost:4001/user/signup", userInfo)
      .then((response) => {
        console.log(response.data);
        if(response.data){
          toast.success('Signup Successful');
          navigate(from,{replace:true});
        }
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
        toast.error("Error: " + error.response.data.message);
      });
    }
  
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="w-[500px] border-[2px] shadow-md p-5 rounded-md">
          <div className="">
            <form onSubmit={handleSubmit(onSubmit)} method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <Link
                  to="/"
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 dark:bg-slate-900 dark:text-white"
                >
                  ✕
                </Link>
              <h3 className="font-bold text-lg">SignUp</h3>
              <div className="mt-4 space-y-2">
                <span>Name</span>
                <br />
                <input
                  type="text"
                  placeholder="Enter your fullname"
                  className="w-80 px-3 py-1 border rounded-md outline-none dark:bg-slate-900 dark:text-white"
                  {...register("fullname", { required: true })}
                />
                <br />
              {errors.name && <span className="text-sm text-red-700">This field is required</span>}
              </div>
              <div className="mt-4 space-y-2">
                <span>Email</span>
                <br />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-80 px-3 py-1 border rounded-md outline-none dark:bg-slate-900 dark:text-white"
                  {...register("email", { required: true })}
                />
                <br />
              {errors.email && <span className="text-sm text-red-700">This field is required</span>}
              </div>
              <div className="mt-6 space-y-2">
                <span>Password</span>
                <br />
                <input
                  type="text"
                  placeholder="Enter your password"
                  className="w-80 px-3 py-1 border rounded-md outline-none dark:bg-slate-900 dark:text-white"
                  {...register("password", { required: true })}
                />
                <br />
              {errors.password && <span className="text-sm text-red-700">This field is required</span>}
              </div>
                <div className="mt-6 space-y-2">
                <span>Confirm Password</span>
                <br />
                <input
                  type="text"
                  placeholder="Confirm your password"
                  className="w-80 px-3 py-1 border rounded-md outline-none dark:bg-slate-900 dark:text-white"
                  {...register("confirmpassword", { required: true })}
                />
                <br />
              {errors.confirmpassword && <span className="text-sm text-red-700">This field is required</span>}
              </div>
              <div className="mt-6 flex justify-between">
                <button className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-300">
                  Signup
                </button>
                <p className="text-xl">
                  Have account?               
                   <button  className="underline text-blue-500 cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_3").showModal()
                    }>Login</button> 
                  <Login />
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
