import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/error';
import PasswordInput from '../../Componenets/input/passwordInput';
import axiosinst from '../../utils/axiosapi';
 

const login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const navigate=useNavigate();

  const handlelogin=async(e)=>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter valid Email Address");
      return;
    }
    if(!password){
      setError("Please Enter the password");
      return;
    }
    setError("")

    // login Api
    console.log("Sending login request...");
  try {
    const response = await axiosinst.post("/login", {
        email: email,
        password: password,
    });

    if (response.data && response.data.accessToken) {
    localStorage.setItem("token", response.data.accessToken);
    navigate("/dashboard");
  } else {
    setError("Login successful, but no token returned."); // This can be customized
  }

} catch (error) {
    if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.data && error.response.data.message) {
            setError(error.response.data.message); // Specific error message from response
        } else {
            setError("Something went wrong. Please try again later.");
        }
    } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please check your internet connection.");
    } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred. Please try again.");
    }
}

  }
  return (
    <div className='h-screen bg-cyan-100 overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40'></div>
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2'></div>

      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>

          {/* // left div with picture */}

          <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50 '>
              <div>
                <h4 className='text-4xl text-white font-semibold leading-[50px]'>
                  Capture Your <br/> Journeys
                </h4>
                <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
                  Record your travel experiences and memories in your personal travel journal
                </p>
              </div>
          </div>

          {/* right div with login  */}

          <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
            <form onSubmit={handlelogin} >
              <h4 className='text-2xl font-semibold mb-7'>
              login
              </h4>
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
                LOGIN
              </button>
              <p className='text-xs text-slate-500 text-center my-4'>Or</p>
              <button
              type='submit'
              className='btn-primary btn-light'
              onClick={()=> {
                navigate("/signup");
              }}
              >
                Create Account
              </button>

            </form>
          </div>

      </div>
    </div>
  )
}

export default login