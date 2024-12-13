import React, { useState } from 'react'
import {FaRegEye,FaRegEyeSlash}  from 'react-icons/fa6'
const passwordInput = ({value,onChange,placeholder}) => {
  const [isShowpass,SetisShowpass] =useState("false");
  const togglePass=()=>{
    SetisShowpass(!isShowpass);
  }
  return (
    <div className='flex items-center bg-cyan-600/5 px-5 rounded mb-3'>
        <input 
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        type={isShowpass?"text":"Password"}
        className='w-full text-sm bg-transparent mr-3 py-3  outline-none'
         />
         {isShowpass ? 
         (<FaRegEye
         size={22}
         className='text-primary cursor-pointer'
         onClick={()=>togglePass()}
         />)
         :
         (<FaRegEyeSlash
         size={22}
         className='text-slate-400 cursor-pointer'
         onClick={()=>togglePass()}
         />)
         }
    </div>
  )
}

export default passwordInput;