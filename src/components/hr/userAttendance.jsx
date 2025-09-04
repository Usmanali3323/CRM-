import toast from 'react-hot-toast';
import axios from '../../util/axiosInstance'
import React, { useEffect, useState } from 'react'

function userAttendance({employeeId}) {
    const [date,setDate] = useState({
        month:'',
        year:''
    })
    const [recent,setRecent] = useState([]);
    //const [present,]


    useEffect(()=>{
    async function fetchAttendance() {
        try {
        const res = await axios.post(`/api/users/recent${employeeId}`,{})
        if(res.data.success){
            setRecent(res?.data?.data)
        } 
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
            console.log(error);         
        }
    }
    fetchAttendance();
    },[date]);

    return (
    <div>
    <div className="">
     
    </div>
    <div className="">

    </div>
    </div>
  )
}

export default userAttendance