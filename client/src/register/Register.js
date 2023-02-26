import React, { Fragment, useState, useNavigate } from 'react'
import {BsEyeFill,BsEyeSlashFill} from 'react-icons/bs'
import { NavLink} from 'react-router-dom';

const Register = () => {

  const [showPass,setShowPass] = useState(false)
  const [cshowpass,setCShowPass] = useState(false)
  // const navigate=Navigate();
  // const [toastFlag,setToastFlag] = useState(true)
  const [fullName,setFullName] = useState("")
  const [phone,setPhone] = useState("")
  const [email,setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [gender, setGender] = useState("")
  const [password,setPassword] = useState("")
  const [cpassword,setCpassword] = useState("")


  const addUserdata  = async (e) =>{
    
    e.preventDefault();
    if(fullName===''){
      alert("Enter Full Name")
    }else if (email ===''){
      alert("Enter Email Address")
    }else if(!email.includes("@") || !email.includes(".")){
      alert("Enter Valid Email Address")
    }else if(gender === ""){
      alert("Please Select Gender")
    }else if(password === ""){
      alert("Enter your password")
    }else if(password.length<6){
      alert("Please Enter Min 6 character")
    }else if(cpassword === ''){
      alert("Please enter Confirm Password")
    }else if(cpassword.length<6){
      alert("Please Enter Min 6 Character")
    }else if(password!==cpassword){
        alert("password and confirm password not match")
    }else{
      
     
      const data = await fetch("http://localhost:1337/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName, 
            phone,
            email,
            gender,
            address, 
            password, 
            cpassword
        })
    });

    const res = await data.json();
    console.log(res.status);

    if(res.status === 'ok')
    {
      // alert("Account Successfully Registered ");
      
      alert("User Registered Successfully");
      // window.location.href = '/Login'
      setFullName("")
      setPhone("")
      setGender("")
      setAddress("")
      setEmail("")
      setPassword("")
      setCpassword("")
      // navigate("/Home");
    }
  


    }
  }

  return (
    <Fragment>
        <div class="background">
        {/* <div class="shape"></div>
        <div class="shape"></div> */}
        </div>
        <form className='registration'>
            <h3>Registration</h3>
            <div className='register-container'>
              <div className='register-container left'>
                <label for="name">Name</label>
                <input 
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName} 
                  name="fullName"  type="text" placeholder="username" id="username" />

                <label for="email">Email</label>
                <input type="email"  
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  name="email"  placeholder="Email" id="name" />
                
                <label for="phone">Phone</label>
                <input type="text" 
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone} 
                  name="phone" placeholder="Phone" id="phone"/>

                <label for="Gender">Gender</label>
                <select name="gender" onChange={(e) => setGender(e.target.value)} value={gender} >
                  <option>--Select--</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className='register-container right'> 
                <label for="Address">Address</label>
                <input type="text" onChange={(e) => setAddress(e.target.value)} value={address} name="address" placeholder="Address" id="Address"/>

                <label for="password">Password</label>
                <input type={!showPass ? "password" : "text"}  onChange={(e) => setPassword(e.target.value)} value={password} name="password" placeholder="Password" id="password" />
                {/* <div className='showpass' onClick={() =>setShowPass(!showPass)}>
                  {
                    !showPass ? <BsEyeFill/> : <BsEyeSlashFill/>
                  }              
                </div>  */}

                <label for="confirm password">Confirm Password</label>
                <input type={!cshowpass ? "password" : "text"}  onChange={(e) => setCpassword(e.target.value)} value={cpassword} name="cpassword" placeholder="Confirm Password" id="password" >
                    
                </input>
                {/* <div className='showpass' onClick={() =>setCShowPass(!cshowpass)}>
                    {
                      !cshowpass ? <BsEyeFill/> : <BsEyeSlashFill/>
                    }              
                  </div> */}
              </div>
            </div>
            <button onClick={addUserdata} >Register</button>
            <p>Already have an Account?  <NavLink to={"/Login"}>Log In</NavLink></p>
        </form>
    </Fragment>
  )
}

export default Register