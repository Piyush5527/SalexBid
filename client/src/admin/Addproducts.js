import axios from 'axios'
import React,{useState} from 'react'

const Addproducts = () => {
    const [prodName,setProdName]=useState("") 
    const [prodPrice,setProdPrice]=useState("") 
    const [shortDesc,setShortDesc]=useState("") 
    const [longDesc,setLongDesc]=useState("") 
    const [prodSize,setProdSize]=useState("") 
    const [prodStock,setProdStock]=useState("") 
    const [prodImage,setProdImage]=useState("") 

    const addProductHandler=async(e)=>{
        e.preventDefault();
        if(prodName!=='' && prodPrice!=='' && shortDesc!=='' && longDesc !=='' && prodSize!=='' && prodStock !=='' && prodImage!=='')
        {
           let formData=new FormData();
           formData.append("prodname",prodName); 
           formData.append("prodprice",prodPrice); 
           formData.append("shortdesc",shortDesc); 
           formData.append("longdesc",longDesc); 
           formData.append("prodstock",prodStock); 
           formData.append("prodsize",prodSize); 
           formData.append("prodimage",prodImage);
           
           const config={
            headers:{
                "Content-Type": "multipart/form-data"       
            }
           }

           const res=await axios.post("http://localhost:1337/api/addProduct",formData,config);
           if(res.data.status===401 || !res.data)
           {
                console.log("Error")
           }
           else
           {
                console.log("Successsss")
           }
        }
        else
        {
            alert('Some Fields are Empty !!!');
        }
    }
    return (
    <div>
        <form>
        <form className='registration'>
            <h3>Add Product</h3>

            <label for="productName">Product Name<span style={{color:'red'}}>*</span></label>
            <input type='text' name="prodname" placeholder="Enter Here" onChange={(e)=>{setProdName(e.target.value)}} value={prodName}/>
            <label for="Price">Price <span style={{color:'red'}}>*</span></label>
            <input type="text" name="prodprice" placeholder="eg 500"  onChange={(e)=>setProdPrice(e.target.value)} value={prodPrice}/>
            <label for="shortdesc">Short Description<span style={{color:'red'}}>*</span></label>
            <input type="text" name="ShortDesc" placeholder="" onChange={(e)=>setShortDesc(e.target.value)} value={shortDesc}/>
            <label for="longdesc">Long Description<span style={{color:'red'}}>*</span></label>
            <textarea name="longdesc" placeholder="" onChange={(e)=>setLongDesc(e.target.value)}/>
            <label for="size">Size<span style={{color:'red'}}>*</span></label>
            <input type="text" name="size" placeholder="xl" onChange={(e)=>setProdSize(e.target.value)} value={prodSize}/>
            <label for="stock">Stock<span style={{color:'red'}}>*</span></label>
            <input type="number" name="stock" placeholder="eg 50" onChange={(e)=>setProdStock(e.target.value)} value={prodStock}/>
            <label for="image">Image<span style={{color:'red'}}>*</span></label>
            <input type="file" name="prodimage" onChange={(e)=>setProdImage(e.target.files[0])} multiple/>
            
            
            <button onClick={addProductHandler}>Add Product</button>
        </form>    
        </form>
    </div>
  )
}

export default Addproducts