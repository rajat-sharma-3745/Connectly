import { createContext, useCallback, useContext, useState } from "react";
import { nanoid } from "nanoid";
import Toast from "../components/shared/Toast";
const ToastContext = createContext();
export function ToastProvider ({children}){
    const [toasts,setToasts] = useState([]);

    const removeToast = useCallback((id)=>{
        setToasts((toasts)=>toasts.filter((t)=>t.id!==id))
    },[]);

    const showToast = useCallback((msg,type='info')=>{
        const id = nanoid();
        setToasts((toasts)=>[...toasts,{id,msg,type}])
        setTimeout(()=>removeToast(id),2000);
    },[removeToast]);

    const toastApi={
        success:(msg)=>showToast(msg,'success'),
        error:(msg)=>showToast(msg,'error'),
        info:(msg)=>showToast(msg,'info'),
    }

    return <ToastContext.Provider value={toastApi}>
        {children}
        <div className="fixed bottom-5 right-5 flex flex-col z-50 gap2">
          {toasts.map((t)=>(
            <Toast
            key={t.id}
            message={t.msg}
            type={t.type}
            onClose={()=>removeToast(t.id)}
            />
          ))}
        </div>
    </ToastContext.Provider>

}

export const useToast = () => useContext(ToastContext);