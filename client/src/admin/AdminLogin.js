import React, { Fragment, useState } from 'react'
import { NavLink, useNavigate,} from 'react-router-dom'
import "../css/login-design.css";
import {BsEyeFill,BsEyeSlashFill} from 'react-icons/bs'
import Errormsg from '../shared/Errormsg';


const AdminLogin = () => {

  const [showPass, setShowPass] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userAvl,setuserAvl]=useState(true);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    if (email === '') {
      alert("Enter Email")
    } else if (!email.includes("@") || !email.includes(".")) {
      alert("Enter Valid Email")
    } else if (password === "") {
      alert("Enter your password")
    } else {

      const data = await fetch("http://localhost:1337/api/adminlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email, password
        })
      })

      const res = await data.json();
      console.log(res)
      if (res.status === 'ok') {
        // alert("Login Successfully");
        setEmail("")
        setPassword("")
        navigate('/AdminHomePage');
      }
      else if(res.status === 'nouser')
      {
        console.log("NO USER");
        setuserAvl(false);
      }
      else{
        alert(res);
      }
    }
  }

  return (
    <Fragment>
        <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
        </div>
        <form className='login'>
            <h3>Login Here</h3>

            <label for="username">Username</label>
            <input type="text" name="email" placeholder='Enter Your Email Address' onChange={(e) => setEmail(e.target.value)} value={email} id="username" />

            <label for="password">Password</label>
            <input type={!showPass ? "password" : "text"} name="password" placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} id="password" />
            {/* <div className='showpass' onClick={() => setShowPass(!showPass)}>
                  {
                    !showPass ? <BsEyeFill /> : <BsEyeSlashFill />
                  }

                </div> */}
            {!userAvl && <Errormsg message="No User with this email is Available!!"/>}
            <button onClick={loginUser}>Login</button>
            <p>Don't have an Account? <NavLink to="/Register">Sign Up</NavLink></p>
        </form>    
    </Fragment>

  )
}

export default AdminLogin