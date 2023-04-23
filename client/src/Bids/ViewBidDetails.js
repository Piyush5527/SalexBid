import React from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { useState,useEffect,Fragment } from 'react'
import axios from 'axios'
import styles from '../css/shared.module.css';
import Navbar from '../Navbar/Navbar';

const ViewBidDetails = () => {
    const { id } = useParams("")
    const navigate = useNavigate()
    const [bidDetail,setBidDetail]=useState('')
    const [started,setStartedState] = useState(0)
    const [message,setMessage]=useState('')
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
            // console.log(result.status)
            console.log("Error in fetching bid details")
        }
        else
        {
            setBidDetail(result)
        }
    }
    useEffect(() =>{
        getBidDetail();
    },[])

      useEffect(()=>{
        // console.log(Date.now)
        if(bidDetail.allowed===true && bidDetail.start_date<=Date.now)
        {
            setStartedState(2)
            setMessage("Auction Started")
        }
        else if(bidDetail.allowed===true && bidDetail.start_date>=Date.now)
        {
            setStartedState(1)
            setMessage("Auction Didnt Started")
        }
        else if(bidDetail.allowed===false && bidDetail.start_date<=Date.now)
        {
            setStartedState(0)
            setMessage("Auction Didnt Allowed By the Admin")
        }
        else
        {
            setStartedState(-1)
            setMessage("Auction Didnt Started And not approved by admin")
        }
      },[bidDetail])

      const joinBidHandler =(id)=>{
        console.log(id)
      }
  return (
    <Fragment>
        <Navbar/>
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
            <input type="text" value={message} className={started===2?"bg-success":"bg-danger"} readonly></input>
            {started===2?<button onClick={(e)=>{joinBidHandler(bidDetail._id)}} >Join Bid</button>:<button disabled>Join Bid</button>}
            
        </div>
        </div>

    </Fragment>
  )
}

export default ViewBidDetails