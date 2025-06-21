import * as api from "../api"
import { setcurrentuser } from "./currentuser";
export const fetchallusers=()=> async(dispatch)=>{
    try {
        const {data}=await api.getallusers();
        dispatch({type:"FETCH_USERS",payload:data});
    } catch (error) {
        console.log(error)
    }
}

export const updateprofile=(id,updatedata)=>async(dispatch)=>{
    try {
        const {data}=await api.updateprofile(id,updatedata);
        dispatch({type:"UPDATE_CURRENT_USER",payload:data});
        // Update localStorage and Redux current user if this is the logged-in user
        const profile = JSON.parse(localStorage.getItem("Profile"));
        if (profile && profile.result && profile.result._id === data._id) {
            const updatedProfile = { ...profile, result: data };
            localStorage.setItem("Profile", JSON.stringify(updatedProfile));
            dispatch(setcurrentuser(updatedProfile));
        }
    } catch (error) {
        console.log(error)
    }
}

