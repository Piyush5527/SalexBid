import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import NavbarBoots from '../Navbar/Navbar';
import axios from 'axios';
import styles from '../css/viewsingleproduct.module.css';
import { HiOutlineShoppingCart } from 'react-icons/hi';

const ViewSingleProduct = () => {

  const [list, setList] = useState("")
  const [feedback, setFeedback] = useState("")
  const [productFeedbacks, setProductFeedbacks] = useState([])

  var feedbackCnt = 0;

  const { id } = useParams("")

  const getProductById = async () => {
    const res = await fetch(`http://localhost:1337/api/getproductid/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const productData = await res.json()

    if (res.status === 422 || !productData) {
      console.log("error");
    } else {
      console.log(productData)
      setList(productData)
    }
  }

  const getFeedbackProductById = async () => {
    const res = await fetch(`http://localhost:1337/api/getfeedbackproductid/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const productData = await res.json()

    if (res.status === 422 || !productData) {
      console.log("error");
    } else {
      console.log(productData)
      setProductFeedbacks(productData)
    }
  }

  useEffect(() => {
    getProductById();
    getFeedbackProductById();
  }, [])

  const addProductToCart = async (productId) => {
    console.log(productId);

    const token = localStorage.getItem('usersdatatoken');

    const addToCart = await fetch(`http://localhost:1337/api/addtocart/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })

    const getRes = await addToCart.json();

    if (getRes.status === 422 || !getRes) {
      console.log("error")
    } else {
      alert("Product Added in the Cart Successfully")
    }

  }

  const feedbackSubmitHandler = async(productId) => {
    console.log(productId);

    const token = localStorage.getItem('usersdatatoken');

    // const feedbackSubmit = await fetch(`http://localhost:1337/api/addfeedback/${productId}`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": token
    //   },
    //   body: JSON.stringify({
    //     feedback
    //   })
    // })

    // const getRes = await feedbackSubmit.json();

    // if (getRes.status === 422 || !getRes) {
    //   console.log("error")
    // } else {
    //   alert("Feedback Added Successfully");
    // }

    let formData=new FormData();
           formData.append("feedback",feedback); 
           
           const config={
            headers:{
                "Content-Type": "application/json",
                "Authorization": token       
            }
           }

           const res=await axios.post(`http://localhost:1337/api/addfeedback/${productId}`,formData,config);
           if(res.data.status===422 || !res.data)
           {
                console.log("Error")
           }
           else
           {
                console.log("Successsss")
                alert("Feedback Added successfully");
           }
  }

  return (
    <Fragment>
      <NavbarBoots></NavbarBoots>
      <div className='main_container'>
        <h3 className={styles.header} style={{textAlign:'center'}}>Product Details</h3>
        <div className={`${styles.main_container} ${styles.right}`}>
          {/* style={{ width: "500px", textAlign: "center", margin: "auto", height: "500px" }} */}
          <img className={styles.productImage} height={350} width={350} variant="top" src={`http://localhost:1337/idProof/${list.prod_image}`} />
          {/* <br></br> */}
        </div>
        <div className={`${styles.main_container} ${styles.right}`}>
          <table className="table table-bordered">
            <tr>
              <th colSpan={2} style={{textAlign:'center'}}>Basic Details</th>
            </tr>
            <tr>
              <td>Product Name</td>
              <td>{list.product_name}</td>
            </tr>
            <tr>
              <td>Price</td>
              <td>{list.product_price} /-</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>{list.prod_size}</td>
            </tr>
            <tr>
              <td>Short Description</td>
              <td>{list.short_desc}</td>
            </tr>
            <tr>
              <td>More Details</td>
              <td>{list.long_desc}</td>
            </tr>
            
          </table>
          <a className='btn btn-warning' style={{color:'black'}} onClick={() => addProductToCart(list._id)}>Add to Cart  <HiOutlineShoppingCart/></a>
        </div>
      </div>
      <br></br><br></br>
      <div  className='main_container'>
        <h3>Feedbacks</h3><br></br><br></br>
      {productFeedbacks.map((item)=>{
        feedbackCnt+=1;
        return (<>
        <tr>
                <td>{feedbackCnt+". "}{item.user_id?.full_name}</td>
        </tr>
        <tr>
                <td>{item.feedback}</td>
        </tr></>)
      })}
      </div>

      <div className='main_container'>
      <form className='login'>
            <h3>Feedback</h3>

            <label for="username">Your Feedback</label>
            <textarea style={{width:330, height:150}}name="feedback" onChange={(e) => setFeedback(e.target.value)} value={feedback} id="feedback" />
            <button onClick={(e)=>feedbackSubmitHandler(list._id)}>Submit Feedback</button>
        </form>    
      </div>
    </Fragment>
  )
}

export default ViewSingleProduct