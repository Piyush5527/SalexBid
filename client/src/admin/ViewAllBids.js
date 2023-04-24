import React, { Fragment, useEffect, useState } from 'react';
import styles from '../css/shared.module.css';
import {useNavigate} from 'react-router-dom';
import NavbarAdmin from '../Navbar/NavbarAdmin';
const ViewAllBids = () => {
  const navigate = useNavigate()
  const [bidList,setBidList] = useState('')
  
  const getBidData=async()=>{
    const data =await fetch("http://localhost:1337/api/getbiddata",{
      method:"GET",
      headers:{
        "Content-Type" : "application/json"
      }
    })
    const getData=await data.json();
    if(getData.status === 422 || !getData )
    {
      console.log("Error fetching data")
    }  
    else
    {
      setBidList(getData)    
    }
  }

  const bidEdithandler=async(id)=>{
    navigate(`/EditBid/${id}`)
  }

  useEffect(() =>{
    getBidData();
  },[])
  // useEffect(() =>{
  //   console.log(bidList)
  // },[bidList])
  
  return (
    <Fragment>
      <NavbarAdmin></NavbarAdmin>
        <div className={styles.main_container}>
          <h2>View All Bids</h2>
          <table className='table'>
            <tr className='table-secondary'>
              <th>Name</th>
              <th>Base Price</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
            {bidList.length > 0 ? bidList.map((item)=>{
              return(
              <tr className={item.allowed===true? "table-success" : "table-danger"}>
                <td>{item.product_name}</td>
                <td>{item.base_price}</td>
                <td>{item.product_category}</td>
                <td>{item.u_id.full_name}</td>
                <td><img src={`http://localhost:1337/idProof/${item.image_name}`} height={80} width={120} alt={""}/></td>
                <td><button style={{margin:0,padding:0}} onClick={(e)=>{bidEdithandler(item._id)}}>Edit</button></td>
              </tr>)
            }):""}
          </table>
        </div>
    </Fragment>
  )
}

export default ViewAllBids