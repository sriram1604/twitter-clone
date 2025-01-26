import toast from 'react-hot-toast';
import {baseUrl} from "../constant/url.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
const useFollow = () => {
    const queryClient = useQueryClient();
    const {mutate : follow , isPending} = useMutation({
        mutationFn : async(userId) =>{
            try {
                const res = await fetch(`${baseUrl}/api/users/follow/${userId}`,{
                    method : "POST",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong");
                }
                return data
            } catch (error) {
                throw error
            }
        },
        onSuccess : ()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey : ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey : ["authUser"]})
            ])
        },
        onError : (error) => {
            toast.error(error.message)
        }
    })

    return {follow , isPending}
}

export default useFollow;