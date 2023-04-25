import React, { Fragment, useEffect, useState } from 'react'
import Navbar from '../Navbar/NavbarAdmin'
import styles from '../css/shared.module.css'
import {useParams} from 'react-router-dom';
import axios from 'axios';
const ShowUserDetails = () => {
    const {id}=useParams("");
    console.log(id)
    const [currentUser,setCurrentUser]=useState("")


    const [isUserLoggedIn,setIsUserLoggedIn]=useState(false);
	const [userId, setUserId] = useState(null);
    useEffect(()=>{
		setUserId(localStorage.getItem('admindatatoken'))
		if(userId)
		{
			setIsUserLoggedIn(true)

		}
	},[isUserLoggedIn,userId])
    
    const getCurrentUserData =async()=>{
        const res=await fetch(`http://localhost:1337/api/getuserbyid/${id}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result =await res.json()
        if(res.status===422 || !result)
        {
            console.log("Error in fetching the details")
        }
        else{
            // console.log(result)
            setCurrentUser(result)
        }
    }
    
    // const getMinAmt=async()=>{
    //     currentBiddings
    // }
    useEffect(()=>{
        getCurrentUserData()   
    },[])

    const approveUserHandler=async(e)=>{
        const res=await fetch(`http://localhost:1337/api/approveuserbyid/${id}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result =await res.json()
        if(res.status===422 || !result)
        {
            console.log("Error in fetching the details")
        }
        else{
            // console.log(result)
            getCurrentUserData();
        }
    }

  return (
    <Fragment>
        <Navbar/>
        {isUserLoggedIn==false?"":
        <div className={styles.main_container}>
            <img src={`http://localhost:1337/idProof/${currentUser.verification_proof}`} className={styles.width_25} style={{marginTop:20}}></img>
            {/* {currentBid.image_name} */}
            <br></br>
            <h3 style={{textAlign:'center'}}className={styles.header_style}>User Details</h3>
            <div className={styles.main_container}>
            <table style={{textAlign:'center'}} class="table table-bordered">
                <tr>
                <td>ID:</td>
                <td>{currentUser._id}</td>
                </tr>
                <tr>
                <td>Name:</td>
                <td>{currentUser.full_name}</td>
                </tr>
                <tr>
                <td>Email : </td>
                <td>{currentUser.email}</td>
                </tr>
                <tr>
                <td>Phone Number :</td>
                <td>{currentUser.phone}</td>
                </tr>
                <tr>
                <td>Address :</td>
                <td>{currentUser.address}</td>
                </tr>
                <tr>
                <td>Phone Number :</td>
                <td>{currentUser.gender}</td>
                </tr>
                <tr>
                <td>Account Status : </td>
                <td>{currentUser.verification_status == true ? "Verified" : "Not Verified"}</td>
                </tr>

                <tr>
                <td colSpan={2}>{currentUser.verification_status == true ? <button className='btn btn-primary' onClick={()=>approveUserHandler()} disabled>Approve User</button> : <button className='btn btn-primary' onClick={()=>approveUserHandler()}>Approve User</button>}</td>
                </tr>
                
             </table>
        </div>
        </div>
        }
    </Fragment>
  )
}

export default ShowUserDetails