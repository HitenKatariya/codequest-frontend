import * as api from '../api';
import { setcurrentuser } from './currentuser';
import { fetchallusers } from './users';

export const signup =(authdata, navigate, setErrorMsg)=> async(dispatch)=>{
    try {
        const{data}=await api.signup(authdata);
        dispatch({type:"AUTH",data});
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
        dispatch(fetchallusers());
        navigate("/");
    } catch (error) {
        const message = error?.response?.data?.message || 'Signup failed. Please try again.';
        if (setErrorMsg) setErrorMsg(message);
        console.log(error);
    }
};

export const login =(authdata, navigate, setErrorMsg)=> async(dispatch)=>{
    try {
        const{data}=await api.login(authdata);
        dispatch({type:"AUTH",data});
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
        navigate("/");
    } catch (error) {
        const message = error?.response?.data?.message || 'Login failed. Please check your credentials.';
        if (setErrorMsg) setErrorMsg(message);
        console.log(error);
    }
};