import React, { useEffect, useState } from 'react'
import Navbar from '../../Componenets/input/Navbar'
import { json, useNavigate } from 'react-router-dom'
import axiosapi from '../../utils/axiosapi';
import Travelcard from '../../cards/Travelcard';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {MdAdd} from 'react-icons/md';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../cards/EmptyCard';
import Emptyimage from '../../assets/image/add-story.png'
import axios from 'axios';
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../cards/FilterInfoTitle'
import { getEmptyCardMessage ,getEmptyCardImg} from '../../utils/error';
  

const Home = ({items}) => {
  const navigate=useNavigate();

  const [userInfo,setUserInfo]=useState(null);
  const [allstories,setAllstories]=useState([]);
  const [searchQuery,setSearchQuery]=useState('');
  const [filterType,setFilterType] =useState('');
  const [dateRange,setDateRange]=useState({from:null ,to : null});

  const [openeditmodel,setOpeneditmodel]=useState({
    isShown:false,
    type:"add",
    data:null,
  });

  const [openViewModal,setOpenViewModal]=useState({
    isShown:false,
    data:null,
  });

  const getUserInfo=async () =>{
      try{
        const response=await axiosapi.get("/get-user");
        if(response.data&&response.data.user){
          setUserInfo(response.data.user);
        }
        else{
          console.log("here")
        }
      }
      catch (error) {
  console.error('Error fetching user info:', error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
  if (error.response && error.response.status === 401) {
    localStorage.clear();
    navigate("/login");
  }
}
  };

  const getallstory=async ()=>{
    
    try{
        const response=await axiosapi.get("/get-all-story");
        if(response.data&&response.data.stories){
          setAllstories(response.data.stories);
        }
    }catch(error){
        console.log("Unexpected error occured. Please try again")
    }
  }

  const handledit=(data)=>{
      setOpeneditmodel({isShown:true ,type:"edit",data:data }) 
  }

 const handleviewstory=(data)=>{
      setOpenViewModal({isShown:true,data})
  }
 
  const updateisFavourite = async (data) => {
    const storyId = data._id; // Get the story ID
    try {
        const response = await axiosapi.put("/update-isfavourite/" + storyId, {
            isFavourite: !data.isFavourite, // Use 'data.isFavourite' instead of 'storyId.isFavourite'
        });
        if (response.data && response.data.story) {
           toast.success("Story updated successfully");
           if(filterType==="search"&&searchQuery){
            onSearchStory(searchQuery)
           }
           else if(filterType==="date"){
            filterStoriesByDate(dateRange)
           }
           else{
            getallstory();
           }   
        }
    } catch (error) {
        console.log("An unexpected error occurred. Please try again!");
    }
}

const deleteTravelStory = async (data) => {
  const storyId = data._id;  // Get the _id from the passed data object
 

  if (!storyId) {
    toast.error("Story ID is missing or invalid");
    return;
  }

  try {
    const response = await axiosapi.delete(`/delete-story/${storyId}`);
    
    if (response.data && !response.data.error) {
      toast.success("Story deleted successfully");
      setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
      getallstory();  // Refresh the story list
    } else {
      toast.error(response.data.message || "Failed to delete the story");
    }
  } catch (error) {
    console.error("An unexpected error has occurred:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

const onSearchStory=async (query)=>{
    //  console.log(query)
    try{
      const response=await axiosapi.get("/search",{
        params:{query},
      });
      if(response.data && response.data.stories){
        setFilterType("search");
        setAllstories(response.data.stories);
      }
    }
    catch(error){
      console.log("An unexpected error occured.Please try again");
    }
}

const filterStoriesByDate=async(day)=>{
  try{
  const startDate=day.from?moment(day.from).valueOf():null;
  const endDate=day.to?moment(day.to).valueOf():null;
  if(startDate && endDate){
      const response=await axiosapi.get('/travel-stories/filter',{
        params:{
          startDate,endDate
        }
      });
      if(response.data && response.data.stories){
        setFilterType("date");
        setAllstories(response.data.stories);
      }
  }
}
  catch(error){
    console.log("An unexpected error has occured. Please try again.")
  }
  
}

const resetFilter=()=>{
  setDateRange({from:null,to:null});
  setFilterType("");
  getallstory()
}

const handleDayClick=(day)=>{
  setDateRange(day)
  filterStoriesByDate(day);
}

const handleClearSearch=()=>{
    setFilterType("");
    getallstory();
}
// Usage example when rendering delete button:

  useEffect(()=>{
    getUserInfo();
    getallstory();
    return ()=>{};
  },[])
  return (
    <>
    <Navbar 
    userInfo={userInfo} 
    searchQuery={searchQuery} 
    setSearchQuery={setSearchQuery}
    onSearchNote={onSearchStory}
    handleClearSearch={handleClearSearch}
    />

    <div className='container mx-auto py-10'>

        <FilterInfoTitle
        filterType={filterType}
        filterDates={dateRange}
        onClear={()=>{
          resetFilter();
        }}
        />


      <div className='flex gap-7'>
        <div className='flex-1'>
          {filterType === 'search' ? (
  allstories.length > 0 ? (
    <div className="grid grid-cols-2 gap-4">
      {allstories.map((items) => {
        return (
          <Travelcard
            key={items._id}
            imageUrl={items.imageUrl}
            title={items.title}
            story={items.story}
            date={items.visitedDate}
            visitedLocation={items.visitedLocation}
            isFavourite={items.isFavourite}
            onClick={() => handleviewstory(items)}
            onFavouriteClick={() => updateisFavourite(items)}
          />
        );
      })}
    </div>
  ) : (
    <EmptyCard
      imgSrc={getEmptyCardImg(filterType)}
      message={getEmptyCardMessage(filterType)}
    />
  )
) : (
  allstories.length > 0 ? (
    <div className="grid grid-cols-2 gap-4">
      {allstories.map((items) => {
        return (
          <Travelcard
            key={items._id}
            imageUrl={items.imageUrl}
            title={items.title}
            story={items.story}
            date={items.visitedDate}
            visitedLocation={items.visitedLocation}
            isFavourite={items.isFavourite}
            onClick={() => handleviewstory(items)}
            onFavouriteClick={() => updateisFavourite(items)}
          />
        );
      })}
    </div>
  ) : (
    <EmptyCard
      imgSrc={getEmptyCardImg(filterType)}
      message={getEmptyCardMessage(filterType)}
    />
  )
)}

        </div>
        <div className='w-[350px]'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
            <div className='p-3'>
              <DayPicker
              captionLayout="dropdown buttons"
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pageNavigation
              />
            </div>
            </div>
        </div>
      </div>
    </div>

    <Modal
    isOpen={openeditmodel.isShown}
    onRequestClose={()=>{}}
    style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
        zIndex:999,
      },
    }
    }
    appElement={document.getElementById("root")}
    className="model-box"
    >
      <AddEditTravelStory
      type={openeditmodel.type}
      storyInfo={openeditmodel.data}
      onClose={()=>{
        setOpeneditmodel({isShown:false,type:"add",data:null});
      }}
      getallstory={getallstory}
      />
    </Modal>

    <Modal
    isOpen={openViewModal.isShown}
    onRequestClose={()=>{}}
    style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
        zIndex:999,
      },
    }
    }
    appElement={document.getElementById("root")}
    className="model-box"
    >
      
      <ViewTravelStory
      storyInfo={openViewModal.data || null}
      onClose={()=>{
        setOpenViewModal((prevState)=>({...prevState,isShown:false}))
      }}
      onEditClick={()=>{
        setOpenViewModal((prevState)=>({...prevState,isShown:false}));
        handledit(openViewModal.data || null);
      }}
      onDeleteClick={()=>{
        deleteTravelStory(openViewModal.data || null);
      }}
      />
    </Modal>
    
    <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400  fixed right-10 bottom-10'
    onClick={()=>{
      setOpeneditmodel({isShown:true,type:"add",data:null})
    }}
    >
      <MdAdd className='text-[32px] text-white'/>
    </button>
    <ToastContainer/>
    </>
  )
}

export default Home;