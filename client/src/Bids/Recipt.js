import React, { Fragment, useEffect, useState } from 'react'
import styles from '../css/shared.module.css'
import Navbar from '../Navbar/Navbar'
import { useParams } from 'react-router-dom'
import {MDBCard,MDBCardBody,MDBCol,MDBContainer,MDBRow,MDBTypography,} from 'mdb-react-ui-kit';
const Recipt = () => {
    const [transactionDetail,setTransactionDetail]=useState('')
    const [bidData,setBidData]=useState('')
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
        if(data.status === 422 && !result)
        {
            // console.log(result.status)
            console.log("Error in fetching transaction details")
        }
        else
        {
            // console.log(result)
            setTransactionDetail(result)
            // console.log(transactionDetail.length)
        }
    }
    
    const getBidData=async()=>{
        console.log(transactionDetail.product_id)
        const data = await fetch(`http://localhost:1337/api/gethistorybid/${transactionDetail.product_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result=await data.json()
        console.log(result)
        if(data.status===422 || !result)
        {
            console.log("error in fetching data")
        }
        else
        {
            setBidData(result)
        }
    }
    useEffect(()=>{
        getRecipt()
    },[])
    useEffect(()=>{
        getBidData();
    },[transactionDetail])
  return (
    <Fragment>
        <Navbar/>
        {transactionDetail._id !== undefined ? 

            <MDBContainer className='py-5'>
                <MDBCard>
                    <MDBCardBody>
                        <MDBContainer>
                            <h3 style={{textAlign:"center"}}>SaleXBid</h3>
                            <h6>Transaction ID: {transactionDetail._id}</h6>
                            <h6>User Name : {transactionDetail.user_id.full_name}</h6>
                            <h6>User Name : {transactionDetail.created_at.slice(0,10)+" "+transactionDetail.created_at.slice(11,19)}</h6>
                            {/* <MDBRow> */}
                                <h5 className='text-muted mt-1' style={{textAlign:"center",textDecoration:"underline"}}>Invoice</h5>
                            {/* </MDBRow> */}
                            <MDBRow>
                            <table class="table table-bordered">
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                                <tr>
                                    <td>{bidData.product_name}</td>
                                    <td>{1}</td>
                                    <td>{transactionDetail.amount}</td>
                                </tr>
                                <tr>
                                    <td>GrandTotal</td>
                                    <td></td>
                                    <td>{transactionDetail.amount}</td>
                                </tr>
                            </table>
                            <button className={styles.width_25} style={{padding:0}} onClick={(e)=>{window.print()}}>Print</button>
                            </MDBRow>
                        </MDBContainer>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        : ""}
    </Fragment>
    
  )
}

export default Recipt