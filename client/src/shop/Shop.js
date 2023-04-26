import React, { Fragment,useEffect,useState } from 'react';
import Breadcrumb from '../Home/breadcrumb';
import {BsSearch} from "react-icons/bs"
import Navbar from '../Navbar/Navbar';
import Product from './Product';
import axios from "axios"
import styles from '../css/shop.module.css';
import styles1 from '../css/shared.module.css'

const Shop = () => {
  const [list,setList]=useState([])
  const [searchResult, setSearchResult] = useState([])
  const [key, setKey] = useState("")

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

  const searchProduct = async(event)=>{
    try {
      
      console.warn(event.target.value)
      let key = event.target.value;
      if(key){
        let result = await fetch(`http://localhost:1337/api/getsearchproduct/${key}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const productData = await result.json();
        if (result.status === 422 || !productData) {
          console.log("error");
        } else {
    
          setList(productData)
          
          console.log(list)
          // console.log("data retrived success")
          // setHistData(productData)
    
        }
      } else {
        getData()
      }
    }catch(error){
      console.log(error)
    }
  } 

  
  useEffect(()=>{
    getData()
  },[])
  return (
    <Fragment>
        <Navbar/>
        <form>
          <div className={styles1.main_container}>
            <div className="form-group">
                <input 
                    type="text"
                    className="form-control"
                    placeholder="Search" 
                    style={{borderRadius:20}}
                    onChange={searchProduct}/>
            </div>
          </div>
        </form>
        <Breadcrumb pageName='Shop' subTitle='Collection Products'/>
        <div className={styles.container}>
        {
          list.length > 0 ?
            list.map((item)=>{
              return <div>
                <Product imgpath={`http://localhost:1337/idProof/${item.prod_image}`} price={item.product_price} prodname={item.product_name} prod_id={item._id}/>
              </div>
            })
          :<h1>No Result Find</h1>
        }
        </div>

        
    </Fragment>
  )
}

export default Shop