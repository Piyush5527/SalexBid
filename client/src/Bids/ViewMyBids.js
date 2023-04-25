import React, { Fragment, useEffect, useState } from 'react'
import styles from '../css/shared.module.css'
import {useNavigate} from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
// import { useNavigate } from 'react-router-dom'
const ViewMyBids = () => {
    const navigate=useNavigate()
    const [myBidList,setMyBidList]=useState('')
    const getData= async()=>{
        const token = localStorage.getItem('usersdatatoken');
        // console.log(token)
        const res=await fetch("http://localhost:1337/api/getmybiddata",{
            method: 'GET',
            headers:{
                "content-type":"application/json",
                "Authorization" : token
            }
        });
        const data=await res.json();
        if(res.status===422||!data)
        {
            console.log("Error in fetching data")
        }
        else
        {
            setMyBidList(data)
        }
    }
    const checkBidData=async(id)=>{
        console.log(id)
        navigate(`/OnGoingBid/${id}`)
    }

    useEffect(()=>{
        getData()
    },[])

  return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container_navbar}>
            <h3 style={{textAlign:"center",fontWeight:700,marginTop:10}}>View My Created Bids</h3>
            <table className='table'>
                <tr className='table-secondary'>
                    <th>Name</th>
                    <th>Base Price</th>
                    <th>Category</th>
                    <th>Image</th>
                    {/* <th>Peoples</th> */}
                </tr>
                {
                    myBidList.length>0? myBidList.map((item)=>{
                        return(<tr className={item.allowed===true?"table-success":"table-danger"} onClick={(e)=>{if(item.allowed){checkBidData(item._id)}}}>
                            <td>{item.product_name}</td>
                            <td>{item.base_price}</td>
                            <td>{item.product_category}</td>
                            <td><img src={`http://localhost:1337/idProof/${item.image_name}`} height={60}></img></td>
                        </tr>)
                    }):"" 
                }
            </table>
        </div>  
    </Fragment>
  )
}

export default ViewMyBids