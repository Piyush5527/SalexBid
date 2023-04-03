import React, { Fragment, useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import styles from '../css/viewsingleproduct.module.css';

const ViewSingleProduct = () => {
    const {id}=useParams("");
    const [list, setList] = useState("")
    const getProductById=async()=>{
        // console.log("In single page",id);
        const res=await fetch(`http://localhost:1337/api/getproductid/${id}`,{
            method: "GET",
            headers: {
            "Content-Type": "application/json"
            }
        });
        const productData=await res.json();

        if (res.status === 422 || !productData) {
            console.log("error");
        } else {
        // console.log(productData);
        setList(productData);
        }
    }
    useEffect(()=>{
        getProductById();
    },[]);
  return (
    <Fragment>
        <Navbar/>
        <div className={styles.main_container}>
            <h3>Product Page</h3>
            <div className={styles.product_container}>

            </div>
        </div>
    </Fragment>
  )
}

export default ViewSingleProduct