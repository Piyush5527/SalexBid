import React,{useState,useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
const EditCategory = () => {

    const [category,setCategory]=useState("")
    const [categoryName,setCategoryName]=useState("")

    const {id}=useParams("")
    // console.log(id)
    const navigate = useNavigate()


    const getCategoryById=async(id)=>{
        const getCategory=await fetch(`http://localhost:1337/api/getcategoryid/${id}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const categoryEdit=await getCategory.json()
        if(getCategory.status==="422"||!categoryEdit)
        {
            console.log("Error")
        }
        else
        {
            setCategory(categoryEdit)
            setCategoryName(categoryEdit.category_name)
        }

    }

    const categoryEditHandler = async (event) => {
        event.preventDefault();
    
        var formData = new FormData();
        formData.append("category_name", categoryName)
    
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        }
    
        const res = await axios.patch(`http://localhost:1337/api/updatecategory/${id}`, formData, config);
        if (res.data.status === 401 || !res.data) {
          console.log("error")
        } else {
          alert("Category Updated Successfully")
          navigate("/ViewCategory")
        }
      }

    useEffect(()=>{
        getCategoryById(id);
    },[])
  return (
    <div>
        <form className='login'>
            <h3>Update Category</h3>
            {/* <input type="hidden" name='catid' value={categoryId}/> */}
            <label for="productName">Category Name<span style={{color:'red'}}>*</span></label>
            <input type='text' name="catname" placeholder="Enter Here" onChange={(e)=>{setCategoryName(e.target.value)}} value={categoryName}/>
            <button onClick={categoryEditHandler}>Edit Category</button>
            
        </form>
    </div>
  )
}

export default EditCategory