import React from "react";
import { Link} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async(data) => {
    const userInfo = {
          email: data.email,
          password: data.password,    
        }
        await axios.post("http://localhost:4001/user/login", userInfo)
        .then((response) => {
          console.log(response.data);
          if(response.data){
            toast.success('Login Successful!');
            document.getElementById("my_modal_3").close();
            setTimeout(()=>{
            window.location.reload();
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            },1000)
          }
          
        })
        .catch((error) => {
          if (error.response) {
            console.log(error);
            toast.error("Error: " + error.response.data.message);
            setTimeout(()=>{},2000)
          }
          
        });
    };

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box dark:bg-slate-900 dark:text-white">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2  dark:bg-slate-900 dark:text-white"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg">Login</h3>
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
                type="password"
                placeholder="Enter your password"
                className="w-80 px-3 py-1 border rounded-md outline-none dark:bg-slate-900 dark:text-white"
                {...register("password", { required: true })}
              />
              <br />
              {errors.password && <span className="text-sm text-red-700">This field is required</span>}
            </div>
            <div className="mt-6 flex justify-between">
              <button className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-300">
                Login
              </button>
              <p>
                Not registered?
                <Link
                  to="/signup"
                  className="underline text-blue-400 cursor-pointer "
                >
                  SignUp
                </Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
