import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useToast } from '../context/ToastContext'
import { setSuggestedUser } from '../redux/slices/authSlice'
import { API_PATHS } from '../utils/apiPaths'
import { axiosInstance } from '../utils/axiosInstance'

const useGetSuggestedUser = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    useEffect(()=>{
        async function fetchAllUsers () {
            try {
                const {data} = await axiosInstance.get(API_PATHS.AUTH.SUGGESTED);

                if(data.success){
                    dispatch(setSuggestedUser(data?.users));
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }

        }
        fetchAllUsers();
    },[])
  return (
    <div></div>
  )
}

export default useGetSuggestedUser