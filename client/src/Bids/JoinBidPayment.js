import React, { Fragment, useEffect, useState } from 'react'
import styles from '../css/shared.module.css'
import Navbar from '../Navbar/Navbar'
import { useParams } from 'react-router-dom'
import pic from "../icons/account.svg";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
const JoinBidPayment = () => {
    const navigate=useNavigate()
    const [isPaymentNeeded,setIsPaymentNeeded]=useState(true)
    const [currentUser,setCurrentUser]=useState('')
    const {id}=useParams("")
    const [order,setOrder]=useState('')
    const [isMaster,setIsMaster]=useState(false)
    const checkPaymentNeed=async()=>{
        const token=localStorage.getItem('usersdatatoken')
        const res=await fetch(`http://localhost:1337/api/checkpaymentneed/${id}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization":token
            }
        })
        const result=await res.json()
        console.log("output",result)
        if(result.status===422)
        {
            console.log("Error in fetching payment info")
        }
        else
        {
            // console.log(typeof(result))
            setIsPaymentNeeded(result)
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
            console.log(result)
            setIsMaster(result)
        }
    }

    useEffect(()=>{
        checkPaymentNeed()
        checkIsCurretUserMaster()
    },[])
    useEffect(()=>{
        if(isPaymentNeeded === false)
        {
            navigate(`/OnGoingBid/${id}`)
        }
    },[isPaymentNeeded])
    const getUser = async () => {
        const token=localStorage.getItem("usersdatatoken")
        const user = await fetch("http://localhost:1337/api/user", {
          method : "GET",
          headers : {
            "Content-Type" : "application/json",
            "Authorization": token
          }
        })
  
        const getUser = await user.json();
  
        if(getUser.status === 422 || !getUser){
          console.log("error")
        } else {
          console.log("User : ",getUser)
          setCurrentUser(getUser)
        }
    }
    const getOrder=async()=>{
        const res= await fetch("http://localhost:1337/api/getorderforbid",{
            method: "GET",
            headers:{
                "Content-Type" : "application/json"
            }
        })
        const result =await res.json()
        if(result)
        {
            // setOrder(result)
            return await result
        }
        else
        {
            console.log("error in the razorpay instance")
        }
    }

    const joinBidPaymentHandler = async()=>{
        // var formData=new FormData();
        // formData.append("uidtoken",localStorage.getItem('usersdatatoken'));
        const token=localStorage.getItem('usersdatatoken')
        const config = {
            headers: {
                "Content-Type":  "application/json",
                "Authorization" : token
            }
        }
        
    //    const newOrder=getOrder();
    //    console.log(newOrder)

    const checkOut = await fetch(`http://localhost:1337/api/getorderforbid`,{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : token
        }
    })

    const getCheckOut = await checkOut.json()
    console.log(getCheckOut)
        const options = {
            key: "rzp_test_2TuO5NUvU21p95",
            amount: 5000, 
            currency: "INR",
            name: "SaleXBid",
            description: "Test Transaction",
            image: pic,
            order_id:getCheckOut.id,
            callback_url: "http://localhost:1337/api/paymentverificationforbids",
            handler: async function (response){
                console.log("response: " + JSON.stringify(response))
                var formData = new FormData();

                formData.append("razorpay_payment_id",response.razorpay_payment_id)
                formData.append("razorpay_order_id",response.razorpay_order_id)
                formData.append("razorpay_signature",response.razorpay_signature)
                formData.append("razorpay_amount",50)
                formData.append("reason","Bid Joining Amount")
                formData.append("bid_id",id)


                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : token
                    }
                }
          
                const res = await axios.post("http://localhost:1337/api/paymentverificationforbids", formData, config);
                if (res.data.status === 401 || !res.data) {
                    console.log("errror")
                } else {
                    alert("Payment Successfully")
                    // navigate("/MyOrders")
                    window.location.reload()
                }
            },
            prefill: {
                name: currentUser.first_name,
                email: currentUser.email,
                contact: currentUser.phone
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
        const res=axios.post(`http://localhost:1337/api/joinbidpayment/${id}`,config)
        // window.location.reload()
    }
    return (
        <Fragment>
            <Navbar/>
            <div className={styles.main_container_navbar}>
                <h4 style={{marginTop:50,textAlign:"center"}}>You Need to Pay Rs 50 to join the Bid</h4>
                
                {!isMaster && (isPaymentNeeded && <button className='btn btn-success' onClick={(e)=>{joinBidPaymentHandler()}}>Pay Rs 50/-</button>)}
                {!isPaymentNeeded && <button className='btn btn-secondary' onClick={(e)=>{navigate(`/OnGoingBid/${id}`)}}> PAID JOINING AMT GO TO BID PAGE</button>}
                {isMaster && <h5 style={{textAlign:"center"}}>You are the master of the BID Cant join in your own bid</h5>}
            </div>
        </Fragment>
    )
    }

export default JoinBidPayment