import axios from 'axios';
import React,{useState, useEffect} from 'react';
import Errormsg from '../shared/Errormsg';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../Navbar/NavbarAdmin';

const AddCategory = () => {
    const navigate=useNavigate();
    const [categoryName,setCategoryName]=useState("");
    const [categoryValid,setCategoryValid]=useState(true);
    const [isUserLoggedIn,setIsUserLoggedIn]=useState(false);
	const [userId, setUserId] = useState(null);
    useEffect(()=>{
		setUserId(localStorage.getItem('admindatatoken'))
		if(userId)
		{
			setIsUserLoggedIn(true)

		}
	},[isUserLoggedIn,userId])

    const categoryHandler=async(e)=>{
        e.preventDefault();

        if(categoryName!=='')
        {
            let formData=new FormData();
            formData.append('categoryName',categoryName);
            const config = {
                headers: {
                    "Content-Type":  "application/json"
                }
            }
            const res=await axios.post("http://localhost:1337/api/addcategory",formData,config);
            if(res.data.status === 422 || !res.data)
            {
                console.log("Error")
            } 
            else
            {
                alert("Category added Successfully!")
                navigate("/ViewCategory")
            }
        }
        else
        {
            setCategoryValid(false);
        }
    }
  return (
    <div>
        <NavbarAdmin></NavbarAdmin>
        {isUserLoggedIn==false?"":
        <form className='login'>
            <h3>Add Category</h3>
            <label for="productName">Category Name<span style={{color:'red'}}>*</span></label>
            <input type='text' name="catname" placeholder="Enter Here" onChange={(e)=>{setCategoryName(e.target.value)}} value={categoryName}/>
            {!categoryValid && <Errormsg message="Invalid Category Name" colors='red'/>}
            <button onClick={categoryHandler}> Add Category</button>
        </form>
        }
    </div>
  )
}

export default AddCategory