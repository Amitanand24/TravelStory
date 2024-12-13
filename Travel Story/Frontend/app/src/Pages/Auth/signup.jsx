import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/error';
import PasswordInput from '../../Componenets/input/passwordInput';
import axiosinst from '../../utils/axiosapi';
 

const signup = () => {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const navigate=useNavigate();

  const handlesignup=async(e)=>{
    e.preventDefault();
    if(!name){
      setError("Please enter your name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter valid Email Address");
      return;
    }
    if(!password){
      setError("Please Enter the password");
      return;
    }
    setError("")

    // signup Api
   try {
            const response = await axiosinst.post("/create-account", {
                fullname:name,
                email: email,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard"); // Use navigate function
            }
            else{
              setError("Login successful, but no token returned.");
            }
        } catch (error) 
        {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Set error message from response
            } else {
                setError("An unexpected error occurred. Please try again"); // Default error message
            }
        }

  }
  return (
    <div className='h-screen bg-cyan-100 overflow-hidden relative'>
      <div className='signup-ui-box right-10 -top-40'></div>
      <div className='signup-ui-box bg-cyan-200 -bottom-40 right-1/2'></div>

      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>

          {/* // left div with picture */}

          <div className='w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50 '>
              <div>
                <h4 className='text-4xl text-white font-semibold leading-[50px]'>
                  Join the <br/> Adventure
                </h4>
                <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
Sign up now to capture your adventures and preserve your memories in your personal travel journal!                </p>
              </div>
          </div>

          {/* right div with signup  */}

          <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
            <form onSubmit={handlesignup} >
              <h4 className='text-2xl font-semibold mb-7'>
              signup
              </h4>

              <input type="text" placeholder='Full Name' className='input-box'
              value={name}
              onChange={({target})=>{setName(target.value)}}
              />
              <input type="text" placeholder='Email' className='input-box'
              value={email}
              onChange={({target})=>{setEmail(target.value)}}
              />
              <PasswordInput
              value={password}
              onChange={({target})=>{setPassword(target.value)}}
              Pass
              />
              {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
              <button type='submit' className='btn-primary'>
                Create Account
              </button>

              <p className='text-xs text-slate-500 text-center my-4'>Or</p>
              <button
              type='submit'
              className='btn-primary btn-light'
              onClick={()=> {
                navigate("/login");
              }}
              >
                LOGIN
              </button>

            </form>
          </div>

      </div>
    </div>
  )
}

export default signup