import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import styles from '../css/shared.module.css'
const ShowHistoryBids = () => {
    const [historyBids,setHistoryBids]=useState([])
    const retrieveHistoryBids =async()=>{
        const token=localStorage.getItem('usersdatatoken')
        const res = await fetch('http://localhost:1337/api/getHistoryBids',{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const data= await res.json()
        if(res.status === 422 || !data)
        {
            console.log("Error in fetching data")
        }
        else{
            setHistoryBids(data)
        }
    }
    useEffect(()=>{
        retrieveHistoryBids()
    },[])
    return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container}>
            <table className='table table-striped'>
                <tr>
                    <th>Sr.No.</th>
                    <th>Name</th>
                    <th>Selled Price</th>
                    <th>Payment Status</th>
                    <th>Image</th>
                </tr>
                {historyBids.length > 0 ? historyBids.map((item,index)=>{
                    return(<tr>
                        <td>{index+1}</td>
                        <td>{item.product_name}</td>
                        <td>{item.amount}</td>
                        <td>{item.payment_status}</td>
                        <td><img src={`http://localhost:1337/idProof/${item.prod_image}`}></img></td>
                    </tr>)
                }):""}
            </table>
        </div>  
    </Fragment>
  )
}

export default ShowHistoryBids