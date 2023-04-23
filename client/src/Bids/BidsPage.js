import React, { Fragment, useEffect, useState } from 'react'
import stylesnew from '../css/shared.module.css'
import Navbar from '../Navbar/Navbar'
import styles from '../css/product.module.css';
import SingleBidComponent from './SingleBidComponent';
const BidsPage = () => {
    const [bidList,setBidList]=useState('')
    
    const getData=async()=>{
        const res=await fetch("http://localhost:1337/api/getbiddata",{
            method:"GET",
            headers:{
                "Content-Type" : "application/json"
            }
        })

        const data=await res.json()
        if(res.status===422 || !data)
        {
            console.log("Error fetching data from bids")
        }
        else
        {
            setBidList(data)
            // console.log(bidList)
        }
    }

    useEffect(()=>{
        getData()
    },[])
    

  return (
    <Fragment>
        <Navbar/>
        <div className={stylesnew.main_container}>
            <h3 style={{textAlign:"center",fontWeight:700}}>Bids Page</h3>  
            {bidList.length > 0 ? bidList.map((item)=>{

                if(item.allowed === true)
                {
                    return(<SingleBidComponent imgpath={`http://localhost:1337/idProof/${item.image_name}`} price={item.base_price} prodname={item.product_name} prod_id={item._id}></SingleBidComponent>)
                }
            }) : ""
        }
        </div>
    </Fragment>
  )
}

export default BidsPage