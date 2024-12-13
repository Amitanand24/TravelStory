import ADD_STORY_IMG from '../assets/image/add-story.png'
import NO_SEARCH_DATA_IMG from '../assets/image/no-search-data.svg'
import NO_FILTER_DATA_IMG from '../assets/image/no-filter-data.svg'

export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getinitials=(name)=>{
    if(!name) return "";
    const words=name.split(" ");
    let initial="";
    for(let i=0;i<Math.min(words.length,2);i++){
        initial+=words[i][0];
    }
    return initial.toUpperCase();
}

export const getEmptyCardMessage=(filterType)=>{
    switch(filterType){
        case "search":
            return `Oops! No Stories found matching your search`;
        case "date":
            return `No Stories found in the given date range`;
        default:
            return `Start creating your first travel story! click the 'Add' button to jot down your thoughts ,ideas and memories. Let's get started` ;
    }
}

export const getEmptyCardImg=(filterType)=>{
    switch(filterType){
        case "search":
         return NO_SEARCH_DATA_IMG;
        case "date":
         return NO_FILTER_DATA_IMG;
        default:
            return ADD_STORY_IMG;  
    }
}