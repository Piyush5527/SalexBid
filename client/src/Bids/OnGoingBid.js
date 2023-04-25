import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import styles from '../css/shared.module.css'
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
const OnGoingBid = () => {
    const {id}=useParams("");
    const navigate=useNavigate()
    // console.log(id)
    const [currentBid,setCurrentBid]=useState("")
    const [currentBiddings,setCurrentBiddings]=useState("")
    const [amt,setAmt]=useState(0)
    const [isMaster,setIsMaster]=useState(false)
    const getCurrentBidData =async()=>{
        const res=await fetch(`http://localhost:1337/api/getbidbyid/${id}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result =await res.json()
        if(res.status===422 || !result)
        {
            console.log("Error in fetching the details")
        }
        else{
            // console.log(result)
            setCurrentBid(result)
        }
    }
    const checkIsCurretUserMaster=async()=>{
        const token=localStorage.getItem('usersdatatoken')
        const res=await fetch(`http://localhost:1337/api/checkCurrentUser/${id}`,{
            method:'GET',
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const result=await res.json();
        // console.log(result)
        if(res.status===422)
        {
            console.log("Error")
        }
        else
        {
            // console.log(result)
            setIsMaster(result)
        }
    }

    const getCurrentBiddings = async()=>{
        const res=await fetch(`http://localhost:1337/api/getcurrentbiddings/${id}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result =await res.json()
        // console.log(result)
        if(res.status===422 || !result)
        {
            console.log("Error in fetching the data of biddings")
        }
        else
        {
            setCurrentBiddings(result)
        }
    }
    // const getMinAmt=async()=>{
    //     currentBiddings
    // }
    useEffect(()=>{
        getCurrentBidData()   
        getCurrentBiddings()
        checkIsCurretUserMaster()
    },[])

    const amtSubmitHandler=async(e)=>{
        e.preventDefault();
        // console.log("this is the new amt ",amt)
        var formData=new FormData()
        const token=localStorage.getItem("usersdatatoken")
        formData.append("newamt",amt)
        const config = {
            headers: {
                "Content-Type":  "application/json",
                "Authorization": token
            }
        }
        const res=await axios.post(`http://localhost:1337/api/updateamountbid/${id}`,formData,config);
        if(res.status === 422 || !res.data)
        {
            console.log("Error in updating amount");
        }
        else
        {
            alert("Amount updated Successfully");
            window.location.reload();
        }
    }

    const endBidHandler=async()=>{
        // console.log(id)
        var formdata=new FormData()
        const token=localStorage.getItem('usersdatatoken')
        const config = {
            headers: {
                "Content-Type":  "application/json",
                "Authorization": token
            }
        }
        const res=await axios.post(`http://localhost:1337/api/endBid/${id}`,formdata,config);
        if(res.status===422 || !res.data)
        {
            console.log("error in ending bid")
        }
        else
        {
            alert("Bid Ended successfully")
            navigate('/ViewMyBids')
        }
    }

  return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container}>
            {isMaster && <button className='btn btn-danger' style={{width:100}} onClick={(e)=>{endBidHandler()}}>End Bid</button>}
            <img src={`http://localhost:1337/idProof/${currentBid.image_name}`} className={styles.width_25} style={{marginTop:20}}></img>
            {/* {currentBid.image_name} */}
            
            <form onSubmit={(e)=>{amtSubmitHandler(e)}}>
                <input type="number" min={currentBid.base_price} className={styles.width_25} onChange={(e)=>{setAmt(e.target.value)}}></input>
                <input type="submit" style={{display:"none"}}></input>
            </form>
            <table className='table table-striped-columns' style={{marginTop:50}}>
            <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Amount</th>
                <th>LastBid</th>
            </tr>
            {currentBiddings.length>0?currentBiddings.map((item,index)=>{
                return(
                    <tr>
                        <td>{index+1}</td>
                        <td>{item.user_id.full_name}</td>
                        <td>{item.amount}</td>
                        <td>{item.lastbid.slice(0,10) + "  "+ item.lastbid.slice(11,20)}</td>
                    </tr>
                )
            }):""}
            </table>
        </div>
    </Fragment>
  )
}

export default OnGoingBid