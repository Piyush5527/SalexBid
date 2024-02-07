import React, { Fragment, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Errormsg from '../shared/Errormsg';
import axios from 'axios';
const CreateBid = () => {
    const [prodName,setProdName]=useState('');
    const [prodNameValid,setProdNameValid]=useState('true')
    const [category,setCategory]=useState('');
    const [categoryValid,setCategoryValid]=useState('true')
    const [price,setPrice]=useState(0);
    const [priceValid,setPriceValid]=useState('true')
    const [shortDesc,setShortDesc]=useState('');
    const [shortDescValid,setShortDescValid]=useState('true')
    const [longDesc,setLongDesc]=useState('');
    const [longDescValid,setLongDescValid]=useState('true')
    const [srtDate,setSrtDate]=useState('');
    const [srtDateValid,setSrtDateValid]=useState('true')
    const [productImage,setProductImage]=useState('');
    const [productImageValid,setProductImageValid]=useState('true')
    const bidDataHandler = async(e) =>{
      e.preventDefault();
      if(prodName !== '' && category !== '' && price !== 0 && shortDesc!== '' && longDesc!== '' && srtDate !== '' && productImage !== '')
      {
        let formData = new FormData();
        formData.append("productName",prodName);
        formData.append("category",category);
        formData.append("basePrice",price);
        formData.append("shortDesc",shortDesc);
        formData.append("longDesc",longDesc);
        formData.append("startDate",srtDate);
        formData.append("productImage",productImage);

        const token = localStorage.getItem('usersdatatoken');
        console.log(token)
    
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": token
            }
        }
        
        const res = await axios.post("http://localhost:1337/api/createbid", formData, config);
        if (res.data.status === 401 || !res.data) {
            alert("User Not Registered Successfully");
            console.log("error")
        } else {
            alert("New bid was added successfully waiting for Approval")
            setProdName("")
            setCategory("")
            setLongDesc("")
            setPrice("")
            setSrtDate("")
            setShortDesc("")
            setProductImage("")

            // navigate("/Login")
        }
      }
    }
    const disablePastDate = () => {
      const today = new Date();
      const dd = String(today.getDate() ).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();
      return yyyy + "-" + mm + "-" + dd;
  };
    // console.log("valid name",prodNameValid)
  return (
    <Fragment >
        <Navbar></Navbar>
        <h3 style={{textAlign:"center",fontWeight:700}}>Create New Bid</h3>
        <form className='registration'>
            <label for="name">Product Name</label>
            <input type="text" onChange={(e)=>{setProdName(e.target.value)}} value={prodName} placeholder='Product Name' required/>
            {!prodNameValid && <Errormsg message="Product Name is Invalid" colors="red"></Errormsg>}
            <label for="category">Product category</label>
            <select onChange={(e)=>{setCategory(e.target.value)}}>
                <option value="">Select</option>
                <option value="Electronic">Electronic</option>
                <option value="Appliance">Appliance</option>
                <option value="Decorative">Decorative</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty Products">Beauty Products</option>
                <option value="AutoMobile">AutoMobile</option>
                <option value="Toys">Toys</option>
                <option value="Antique">Antique</option>
                <option value="Furniture">Furniture</option>
                <option value="Sport Item">Sport Item</option>
            </select>
            <label for="Amount">Amount</label>
            <input type="number" onChange={(e)=>{setPrice(e.target.value)}} value={price} placeholder='Eg 500' required/>
            <label for="shortdesc">Short Description</label>
            <input type="text" onChange={(e)=>{setShortDesc(e.target.value)}} value={shortDesc} placeholder='' required/>
            <label for="longDesc">Long Description</label>
            <input type="text" onChange={(e)=>{setLongDesc(e.target.value)}} value={longDesc} placeholder='' required/>
            <label for="start date ">Select Start Date</label>
            <input type="date" onChange={(e)=>{setSrtDate(e.target.value)}} value={srtDate} placeholder='' min={disablePastDate()} required/>
            <label for="File">Image of Product</label>
            <input type="file"  onChange={(e) => setProductImage(e.target.files[0])}></input>
            <button onClick={bidDataHandler}>Submit</button>
            
            
        </form>
    </Fragment>
  )
}

export default CreateBid