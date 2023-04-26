import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import NavbarBoots from '../Navbar/Navbar';
import styles from '../css/account/AccountPage.module.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
const AccountPage = () => {

  const [currentUser, setCurrentUser] = useState([])
  const [addressCnt,setAddressCnt]=useState(0)

  const navigate = useNavigate()

  const logoutHandler = async () => {
    localStorage.clear()
    const res = await fetch("http://localhost:1337/api/logout", {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
    })

    const logoutMessage = await res.json()
    if (res.status === 422 || !logoutMessage) {
      console.log("error");
    } else {
        alert("You Have Successfully Logout")
        navigate("/")
    }

  }

  const getUser = async () => {
      console.log("Current Users Id : ", localStorage.getItem('userid'));

      const token = localStorage.getItem('usersdatatoken');
      console.log(token)
     
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
  const getAddressCount = async() =>
  {
      const token = localStorage.getItem('usersdatatoken');
      const addresses=await fetch("http://localhost:1337/api/getAddressCnt",{
        method:"GET",
        headers:{
          "Content-Type" : "application/json",
          "Authorization": token
        }
      })

      const getCount=await addresses.json();
      if(getCount.status === 422 || !getCount){
        console.log("error")
      } else {
        console.log("Addresses",getCount)
      }
      

  }

  useEffect(()=>{
    getUser()
    // getAddressCount()
  },[])

  return (
    <Fragment>
      <NavbarBoots></NavbarBoots>
      <h2 className={styles.header_style}>Your Account</h2>
      <div className={styles.main_container}>
      <table class="table table-bordered">
        <tr>
          <td>Name:</td>
          <td>{currentUser.full_name}</td>
        </tr>
        <tr>
          <td>Phone Number :</td>
          <td>{currentUser.phone}</td>
        </tr>
        <tr>
          <td>Email : </td>
          <td>{currentUser.email}</td>
        </tr>
        <tr>
          <td>Account Status : </td>
          <td>{currentUser.verification_status == true ? "Verified" : "Not Verified"}</td>
        </tr>
        
      </table>
      <div className={styles.buttonsGroup}>
        <NavLink className='btn btn-primary ms-1'  to={"/EditAddress"} style={{margin:20,width:200}}>Edit or Add Address</NavLink>
        <a href='/Login' className='btn btn-danger ms-1' onClick={logoutHandler} style={{margin:20,width:200}}>Logout</a>
        <NavLink className='btn btn-secondary ms-1' to='/MyOrders' style={{margin:20,width:200}}>My Orders</NavLink>
      </div>
      </div>
    </Fragment>
  )
}

export default AccountPage