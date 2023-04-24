import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import {useNavigate} from 'react-router-dom';
import styles from '../css/shared.module.css';
const JoinedBids = () => {
    const navigate=useNavigate()
    const [bids,setBids]=useState('')
    const getMyJoinedBids = async()=>{
        const token=localStorage.getItem('usersdatatoken')
        const res=await fetch(`http://localhost:1337/api/getmybids`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const result =await res.json()
        if(res.status===422 || !result)
        {
            console.log("Error in fetching the details")
        }
        else{
            // console.log(result)
            setBids(result)
        }
    }
    useEffect(()=>{
        getMyJoinedBids()
    },[])
  return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container}>
            <table className='table table-striped-columns'>
                <tr>
                    <th>Sr.No.</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Joined At</th>
                    <th>View</th>
                </tr>
                {bids.length > 0? bids.map((item,index)=>{
                    return(<tr>
                        <td>{index+1}</td>
                        <td>{item.product_id.product_name}</td>
                        <td>{item.amount}</td>
                        <td>{item.created_at.slice(0,10)}</td>
                        <td><button style={{margin:0,width:140}} onClick={(e)=>{navigate(`/OnGoingBid/${item.product_id._id}`)}} className='btn btn-primary'>View Details</button></td>
                    </tr>)
                }):""}
            </table>
        </div>
    </Fragment>
  )
}

export default JoinedBids