import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import styles from '../css/shared.module.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const ApproveBid = () => {
    const { id } = useParams("")
    const navigate = useNavigate()
    const [bidDetail,setBidDetail]=useState('')
    const [approveState,setApproveState] = useState('false')
    const getBidDetail=async()=>{
            const data = await fetch(`http://localhost:1337/api/getbidbyid/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result=await data.json();
        if(result.status !== 200 && !result)
        {
            console.log(result.status)
            console.log("Error in fetching bid details")
        }
        else
        {
            setBidDetail(result)
        }
    }
    const bidDataHandler=async(id)=>{
        // e.preventDefault();
        // console.log(id);
        var formData=new FormData();
        formData.append("approved",approveState);
        formData.append("id",id);
        const config={
            headers:{
                "Content-Type":  "application/json"       
            }
           }
           const res = await axios.post("http://localhost:1337/api/approvebid", formData, config);
           if (res.data.status === 401 || !res.data) {
               console.log("error")
           } else {
               alert("Updated!!")
               navigate("/ShowAllBids")
           }

    }
    useEffect(() =>{
        getBidDetail();
      },[])
  return (
    <Fragment>
        <div className={styles.main_container}>
            <h2 style={{textAlign:"center"}}>Evaluate Bid</h2>
        <div className='registration'>
            <label for="name">Product Name</label>
            <input type="text" value={bidDetail.product_name} placeholder='Product Name' required readOnly/>
            {/* {!prodNameValid && <Errormsg message="Product Name is Invalid" colors="red"></Errormsg>} */}
            <label for="category">Product category</label>
            <input type="text" value={bidDetail.product_category} required readOnly/>
            <label for="Amount">Amount</label>
            <input type="number" value={bidDetail.base_price} placeholder='Eg 500' required readOnly/>
            <label for="shortdesc">Short Description</label>
            <input type="text" value={bidDetail.short_desc} placeholder='' required readOnly/>
            <label for="longDesc">Long Description</label>
            <input type="text"  value={bidDetail.long_desc} placeholder='' required readOnly/>
            <label for="start date ">Start Date</label>
            <input type="text"  value={bidDetail.start_date} placeholder='' required readOnly/>
            <label for="File">Image of Product</label>
            <img src={`http://localhost:1337/idProof/${bidDetail.image_name}`} alt='file' height={350} style={{textAlign:'center'}}></img>
            {bidDetail.allowed === false ? <select onChange={(e)=>{setApproveState(e.target.value)}}><option value="false">Don't Allow</option><option value="true">Allow</option></select> :  <select><option value="true">Allowed</option></select>}
            {bidDetail.allowed === false ?<button onClick={(e)=>{bidDataHandler(bidDetail._id)}}>UPDATE</button> : <button disabled>UPDATE</button>}
            {/* <button onClick={(e)=>{ bidDataHandler(bidDetail._id)}}>UPDATE</button> */}
        </div>
        </div>

    </Fragment>
  )
}

export default ApproveBid