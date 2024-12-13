import React, { useState } from 'react'
import { MdAdd, MdClose, MdDelete, MdDeleteOutline } from 'react-icons/md'
import DateSelector from '../../Componenets/input/DateSelector'
import ImageSelector from '../../Componenets/input/ImageSelector'
import TagInput from '../../Componenets/input/TagInput'
import axiosapi from '../../utils/axiosapi'
import moment from 'moment'
import uploadImage from '../../utils/uploadImage'
import { toast } from 'react-toastify'
const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getallstory
}) => {
    const [title,setTitle]=useState(storyInfo?.title||"")
    const [storyimg,setStoryimg]=useState(storyInfo?.imageUrl||null)
    const [story,setStory]=useState(storyInfo?.story||"")
    const [visitedLocation,setVisitedLocation]=useState(storyInfo?.visitedLocation||[])
    const [visitedDate,setVisitedDate]=useState(storyInfo?.visitedDate||null);
    const [error,setError] =useState("");

    
    const addNewStory=async()=>{
        try{
            let imageUrl="";
        // upload image if present
        if(storyimg){
            const imageUploads=await uploadImage(storyimg);
            //get image url
            imageUrl=imageUploads.imageurl || "";
        }

        const response=await axiosapi.post("/add-story",{
            title,
            story,
            imageUrl:imageUrl || "",
            visitedLocation,
            visitedDate:visitedDate?moment(visitedDate).valueOf() : moment().valueOf(),
        });

        if(response.data && response.data.story){
            toast.success("Story added successfully");
            // refresh all stories
            getallstory();
            //close modal or form
            onClose();
        }}
        catch(error){
            if(error.response&& error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
            else{
                setError("An unexpected error has occured. Please try again.");
            }
        }
    }

    const updateTravelStory=async ()=>{
        
        const storyId=storyInfo._id;
        
        try{
            let imageUrl="";
            let postdata=
            {
            title,
            story,
            imageUrl:storyInfo.imageUrl || "",
            visitedLocation,
            visitedDate:visitedDate?moment(visitedDate).valueOf() : 
            moment().valueOf(),
            };
            
        if(typeof storyimg==="object"){
            //upload new image
            const imageUploads=await uploadImage(storyimg);
            imageUrl=imageUploads.imageurl || "";
            console.log("HI");
            console.log(imageUrl);
            postdata={
                ...postdata,
                imageUrl:imageUrl,
            };
        }
        // upload image if present
       

        const response = await axiosapi.put("/edit-story/" + storyId, postdata);

        if(response.data && response.data.story){
            toast.success("Story updated successfully");
            // refresh all stories
            getallstory();
            //close modal or form
            onClose();
        }}
        catch(error){
            if(error.response&& error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
            else{
                setError("An unexpected error has occured. Please try again.");
            }
        }
    }


    const handleDeleteStoryImg=async ()=>{

        const deleteImgres=await axiosapi.delete("/delete-image",{
            params:{
                imageUrl:storyInfo.imageUrl,
            },
        });

         if(deleteImgres.data){
            const storyId=storyInfo._id;
            const postdata={
                title,
                story,
                visitedLocation,
                visitedDate:moment().valueOf(),
                imageUrl:"",
            };
            const response=await axiosapi.put("/edit-story/"+storyId ,
            postdata);
            setStoryimg(null);
         }
    };

    const handleAddorUpdate=()=>{
        console.log("story : " , {title,storyimg,story,visitedDate,visitedLocation});
        if(!title){
            setError("Please enter the title");
            return ;
        }
        if(!story){
            setError("Please enter the story");
            return ;
        }
        setError("");
        if(type==="edit"){
            updateTravelStory();
        }
        else{
            addNewStory();
        }
    }

  return (
    <div className='relative'>
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-500'>
                {type==='add'?"Add Story":"Update Story"}
            </h5>
            <div>
            <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                {type==="add" ? 
                <button className='btn-small' onClick={handleAddorUpdate}>
                <MdAdd className='text-lg'/> Add Story
                </button>
                :
                <>
                <button className='btn-small' onClick={handleAddorUpdate}>
                    <MdAdd className='text-lg'/> Update Story
                </button>
                </>
                }
                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                </button>
            </div>
            {error && (
                <p className='text-red-500  tyext-xs pt-2 text-right'>{error}</p>
            )}
         </div>
    </div>
    <div>
        <div className='flex-1 flex flex-col gap-2 pt-4'>
            <label className='input-label' >Title</label>
            <input 
            type="text"
            className='text-2xl text-slate-950 outline-none'
            placeholder='A day at the great wall'
            value={title}
            onChange={({target})=>setTitle(target.value)}
            />
            <div className='my-3'>
                <DateSelector date={visitedDate} setDate={setVisitedDate} />
            </div>
            <ImageSelector
             image={storyimg} 
             setImage={setStoryimg}
              handleDeleteImg={handleDeleteStoryImg} />
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Story</label>
                <textarea 
                type="text"
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='"Your Story'
                rows={10}
                value={story}
                onChange={({target})=>setStory(target.value)} 
                ></textarea>
            </div>
            <div className='pt-3'>
                <label className='input-label' >Visited Location</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
            </div>
        </div>
    </div>
</div>
  )
}

export default AddEditTravelStory