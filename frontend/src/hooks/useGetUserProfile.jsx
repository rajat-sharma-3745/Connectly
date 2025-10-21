import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useToast } from '../context/ToastContext'
import { setSelectedUser, setSuggestedUser } from '../redux/slices/authSlice'
import { API_PATHS } from '../utils/apiPaths'
import { axiosInstance } from '../utils/axiosInstance'
import { useParams } from 'react-router-dom'
const useGetUserProfile = (id) => {
     const dispatch = useDispatch();
    const toast = useToast();
    useEffect(()=>{
        async function fetchUser () {
            try {
                const {data} = await axiosInstance.get(API_PATHS.AUTH.USERPROFILE(id));

                if(data.success){
                    dispatch(setSelectedUser(data?.user));
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }

        }
        fetchUser();
    },[id])
  return (
    <div></div>
  )
}

export default useGetUserProfile