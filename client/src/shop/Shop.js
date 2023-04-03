import React, { Fragment,useEffect,useState } from 'react';
import Breadcrumb from '../Home/breadcrumb';
import Navbar from '../Navbar/Navbar';
import Product from './Product';
import styles from '../css/shop.module.css';

const Shop = () => {
  const [list,setList]=useState([])

  const getData=async()=>{
    const res = await fetch("http://localhost:1337/api/getproducts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const productData = await res.json();
    if (res.status === 422 || !productData) {
      console.log("error");
    } else {

      setList(productData)
      
      console.log(list)
      // console.log("data retrived success")
      // setHistData(productData)

    }
  }
  useEffect(()=>{
    getData()
  },[])
  return (
    <Fragment>
        <Navbar/>
        <Breadcrumb pageName='Shop' subTitle='Collection Products'/>
        <div className={styles.container}>
        {
          list.length > 0 ?
            list.map((item)=>{
              return <div>
                <Product imgpath={`http://localhost:1337/idProof/${item.prod_image}`} price={item.product_price} prodname={item.product_name} prod_id={item._id}/>
              </div>
            })
          :" "
        }
        </div>

        
    </Fragment>
  )
}

export default Shop