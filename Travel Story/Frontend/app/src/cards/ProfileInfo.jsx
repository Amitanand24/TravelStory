import React from 'react'
import { getinitials } from '../utils/error';
const ProfileInfo = ({userInfo,onLogout}) => {
  return (
    userInfo && 
    (<div className='flex items-center gap-3 '>
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
            {getinitials(userInfo?userInfo.fullname:"")}
        </div>
         
        <div className=''>
            <p className='text-sm font-medium'>{userInfo.fullname||""}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
)
  )
}

export default ProfileInfo;