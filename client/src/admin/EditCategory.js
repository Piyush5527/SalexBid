import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
const EditCategory = () => {

    const [category,setCategory]=useState("")
    const [categoryName,setCategoryName]=useState("")

    const {id}=useParams("")
    // console.log(id)



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
            {/* <button onClick={categoryEditHandler}> Add Category</button> */}
            
        </form>
    </div>
  )
}

export default EditCategory