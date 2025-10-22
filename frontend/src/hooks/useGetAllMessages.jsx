import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../context/ToastContext'
import { setMessages } from '../redux/slices/chatSlice'
import { API_PATHS } from '../utils/apiPaths'
import { axiosInstance } from '../utils/axiosInstance'

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const {selectedChatUser} = useSelector(s=>s.auth)
    const toast = useToast();
    useEffect(()=>{
        async function fetchAllMessages () {
            try {
                const {data} = await axiosInstance.get(API_PATHS.MESSAGE.GET(selectedChatUser?._id));

                if(data?.success){
                    dispatch(setMessages(data.messages));
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }

        }
        fetchAllMessages();
    },[selectedChatUser?._id])
  return (
    <div></div>
  )
}

export default useGetAllMessages