import React, { Fragment, useEffect, useState } from 'react'
import Navbar from "../Navbar/Navbar"
import styles from '../css/shared.module.css'
import { useNavigate } from 'react-router-dom'
import pic from "../icons/account.svg";
import axios from 'axios'
const BiddingWons = () => {
    const navigate=useNavigate()
    const [wonBiddings,setWonBiddings]=useState([])
    // const [paidStatus,setPaidStatus]=useState(false)
    const [currentUser,setCurrentUser]=useState('')

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
    const retrieveWonBids =async()=>{
        const token=localStorage.getItem('usersdatatoken')
        const res = await fetch('http://localhost:1337/api/getWonBiddings',{
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
            setWonBiddings(data)
        }
    }


    const doPayment=async(id,amount)=>{
        const token=localStorage.getItem('usersdatatoken')
        const config = {
            headers: {
                "Content-Type":  "application/json",
                "Authorization" : token
            }
        }
        
    //    const newOrder=getOrder();
    //    console.log(newOrder)

    const checkOut = await fetch(`http://localhost:1337/api/getorderforfinalPayment/${amount}`,{
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
            amount: amount*100, 
            currency: "INR",
            name: "SaleXBid",
            description: "Test Transaction",
            image: pic,
            order_id:getCheckOut.id,
            callback_url: "http://localhost:1337/api/finalpaymentverification",
            handler: async function (response){
                console.log("response: " + JSON.stringify(response))
                var formData = new FormData();

                formData.append("razorpay_payment_id",response.razorpay_payment_id)
                formData.append("razorpay_order_id",response.razorpay_order_id)
                formData.append("razorpay_signature",response.razorpay_signature)
                formData.append("razorpay_amount",amount)
                formData.append("reason","Payment For Bidding")
                formData.append("won_bid_id",id)


                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization" : token
                    }
                }
          
                const res = await axios.post("http://localhost:1337/api/finalpaymentverification", formData, config);
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
        // const res=axios.post(`http://localhost:1337/api/joinbidpayment/${id}`,config)
        
    }

    const paymentHandler=async(id,status,amount)=>{
        // console.log(id)
        if(!status)
        {
            doPayment(id,amount)
        }
        else
        {
            navigate(`/Recipt/${id}`)
        }
    }
    useEffect(()=>{
        getUser()
        retrieveWonBids()
    },[])
  return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container}>
        <table className='table table-striped'>
            <tr>
                <th>Sr.No.</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Image</th>
                <th>Pay</th>
            </tr>
            {wonBiddings.length > 0 ?wonBiddings.map((item,index)=>{
                return(<tr>
                    <td>{index+1}</td>
                    <td>{item.product_name}</td>
                    <td>{item.amount}</td>
                    <td>{item.payment_status===true?"Done":"Not Done"}</td>
                    <td><img src={`http://localhost:1337/idProof/${item.prod_image}`} height={70} alt='just img'/></td>
                    <td><button className={item.payment_status === true?"btn btn-secondary":"btn btn-primary"} style={{margin:0}} onClick={(e)=>{paymentHandler(item._id,item.payment_status,item.amount)}}>{item.payment_status===true?"Recipt":"Pay"}</button></td>
                </tr>)
            }) :""}

        </table>
        </div>
    </Fragment>
  )
}

export default BiddingWons