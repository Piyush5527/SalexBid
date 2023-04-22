import React, { Fragment, useState } from 'react'
import {BsEyeFill,BsEyeSlashFill} from 'react-icons/bs'
import { useNavigate, NavLink} from 'react-router-dom';
import axios from "axios";
import Errormsg from '../shared/Errormsg';

const Register = () => {

  const [showPass,setShowPass] = useState(false)
  const [cshowpass,setCShowPass] = useState(false)
  const navigate=useNavigate();
  // const [toastFlag,setToastFlag] = useState(true)
  const [fullName,setFullName] = useState("")
  const [phone,setPhone] = useState("")
  const [email,setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [verificationProof, setVerificationProof] = useState("");
  const [gender, setGender] = useState("")
  const [password,setPassword] = useState("")
  const [cpassword,setCpassword] = useState("")
  const [emailvalid,setEmailValid]=useState(true)
  const [fullNameValid,setFullNameValid]=useState(true)
  const [phonevalid,setPhoneValid]=useState(true)
  const [addressValid,setAddressValid]=useState(true)
  const [genderValid,setGenderValid]=useState(true)
  const [passwordValid,setPasswordValid]=useState(true)
  // const [emailvaid,setEmailValid]=useState(true)
  
  const addUserdata = async (e) => {
    e.preventDefault();
    // console.log("Hello",fullName,phone,email)
    // console.log(verificationProof);
    if(verificationProof !== '' && fullName!=='' && email!=='' && phone !=='' && gender!=='' && address !=='' && password!=='')
    {
      var formData = new FormData();
      formData.append("verification_proof", verificationProof)
      formData.append("fullname", fullName)
      formData.append("phone", phone)
      formData.append("email", email)
      formData.append("gender", gender)
      formData.append("address", address)
      formData.append("password", password)
      formData.append("cpassword", cpassword)

      const config = {
          headers: {
              "Content-Type": "multipart/form-data"
          }
      }

      const res = await axios.post("http://localhost:1337/api/register", formData, config);
      if (res.data.status === 401 || !res.data) {
          alert("User Not Registered Successfully");
          console.log("error")
      } else {
          //alert("User Registered Successfully")
          navigate("/Login")
      }

    }
    else
    {
      if(fullName==='')
      {
        console.log("hel")
        setFullNameValid(false)
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
                 {!fullNameValid && <Errormsg message='Username is Invalid' colors='red'/>}
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

                <div className='form_input'>
                <label htmlFor='image_path'>Verification Proof</label>
                  <div className='two'>
                    <input 
                    type="file"
                    name="verification_proof"
                    onChange={(e) => setVerificationProof(e.target.files[0])}
                    placeholder='Select Product Images' multiple/>       
                  </div>
                </div>
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