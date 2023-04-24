import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import styles from '../css/shared.module.css'
import {useParams} from 'react-router-dom';
const OnGoingBid = () => {
    const {id}=useParams("");
    console.log(id)
    const [currentBid,setCurrentBid]=useState("")
    const [currentBiddings,setCurrentBiddings]=useState("")
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

    const getCurrentBiddings = async()=>{
        const res=await fetch(`http://localhost:1337/api/getcurrentbiddings/${id}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result =await res.json()
        console.log(result)
        if(res.status===422 || !result)
        {
            console.log("Error in fetching the data of biddings")
        }
        else
        {
            setCurrentBiddings(result)
        }
    }
    useEffect(()=>{
        getCurrentBidData()   
        getCurrentBiddings()
    },[])

  return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container}>
            <img src={`http://localhost:1337/idProof/${currentBid.image_name}`} className={styles.width_25} style={{marginTop:20}}></img>
            {/* {currentBid.image_name} */}
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