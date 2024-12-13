import React from 'react'
import logo from '../../assets/image/logo.svg'
import ProfileInfo from '../../cards/ProfileInfo'
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
const Navbar = ({userInfo,searchQuery,setSearchQuery,onSearchNote,handleClearSearch}) => {
    const isToken=localStorage.getItem("token");
    const naviget=useNavigate();
    const onLogout=()=>{
        localStorage.clear();
        naviget("/login");
    }
    const handleSearch=()=>{
      if(searchQuery){
        onSearchNote(searchQuery);
      }
    }
    const onClearSearch=()=>{
        handleClearSearch();
        setSearchQuery("");
    }
  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow stickytop-0 z-10'>
        <img src={logo} alt="travel story"  className='h-9'/>
        {isToken && (
          <>
          <SearchBar 
          value={searchQuery}
          onChange={({target})=>{setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </>
        ) }
    </div>
    
  )
}

export default Navbar