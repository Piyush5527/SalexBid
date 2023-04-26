import React, { useEffect, useState } from 'react'
import '../css/payment/recipt.module.css'
import Navbar from '../Navbar/Navbar'
import { useParams } from 'react-router-dom'
const Recipt = () => {
    const [transactionDetail,setTransactionDetail]=useState('')
    const {id}=useParams("")
    const getRecipt=async()=>{
        const token=localStorage.getItem('usersdatatoken')
        const data = await fetch(`http://localhost:1337/api/gettransaction/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const result=await data.json();
        if(data.status !== 200 && !result)
        {
            // console.log(result.status)
            console.log("Error in fetching transaction details")
        }
        else
        {
            console.log(result)
            setTransactionDetail(result)
        }
    }
    useEffect(()=>{
        getRecipt()
    },[])
  return (
    <div>
        <Navbar/>
        <div class="container">
        <div class="brand-section">
            <div class="row">
                <div class="col-6">
                    <h2 class="text-black">SalexBid</h2>
                </div>
                <div class="col-6">
                    <div class="company-details">

                        <p class="text-black">Email: salexbid@mgmt.com</p>
                        <p class="text-black">+91 8899665544</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="body-section">
            <div class="row">
                <div class="col-6">
                    <h4 class="heading">Invoice Id: {transactionDetail.t_id}</h4>
                    <p class="sub-heading">Order Date: {transactionDetail.created_at.slice(0,10)+" "+transactionDetail.created_at.slice(12,20)} </p> 
                    <p class="sub-heading">Email Address: {transactionDetail.user_id.email}</p>
                </div>
                <div class="col-6">
                    <p class="sub-heading">Full Name: {transactionDetail.user_id.full_name} </p>
                    <p class="sub-heading">Address:  {transactionDetail.user_id.address}</p>
                    <p class="sub-heading">Phone Number: {transactionDetail.user_id.phone}</p>
                   
                </div>
            </div>
        </div>

        <div class="body-section">
            <h3 class="heading">Ordered Items</h3>
            <br></br>
            <table class="table-bordered">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th class="w-20">Price</th>
                        <th class="w-20">Quantity</th>
                        <th class="w-20">Grandtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{transactionDetail.product_id.product_name}</td>
                        <td>{transactionDetail.product_id.amount}</td>
                        <td>1</td>
                        <td>{transactionDetail.product_id.amount}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-right">Grand Total</td>
                        <td>@ViewBag.Amount</td>
                    </tr>
                </tbody>
            </table>
            <br></br>
            <h3 class="heading">Payment Status: Paid</h3>
            <h3 class="heading">Payment Mode: Online</h3>
        </div>


    </div>
    <center>
        <button onclick="document.execCommand('Print')" class="btn btn-outline-secondary">Save Invoice</button>
    </center>
    </div>
  )
}

export default Recipt