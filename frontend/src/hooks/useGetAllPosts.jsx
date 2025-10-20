import React, { useEffect } from 'react'
import { axiosInstance } from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { useToast } from '../context/ToastContext'
import { useDispatch } from 'react-redux'
import { setPosts } from '../redux/slices/postSlice'

const useGetAllPosts = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    useEffect(()=>{
        async function fetchAllPost () {
            try {
                const {data} = await axiosInstance.get(API_PATHS.POST.GETALLPOST);

                if(data.success){
                    dispatch(setPosts(data.posts));
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }

        }
        fetchAllPost();
    },[])
  return null;
}

export default useGetAllPosts