import { Tab } from 'bootstrap'
import React, { Fragment, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'


const ShowProducts = () => {

  const [list, setList] = useState([])


  const deleteProduct = async (prodId) => {
    const res = await fetch(`http://localhost:1337/api/deleteProduct/${prodId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const brandDelete = await res.json()
    if (res.status === 422 || !brandDelete) {
      console.log("error");
    } else {
      alert("Product Deleted Successfully")
      getData()
    }

  }

  const getData = async () => {

    const res = await fetch("http://localhost:1337/api/getproduct", {
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

    }
  }

  useEffect(() => {
    getData()

  }, [])



  return (
    <Fragment>
      <div className='design_container'>
      <NavLink to={"/AddProduct"} className="btn btn-success">Add Product</NavLink>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Category</th>
              <th scope="col">Stock</th>
              <th scope="col">Size</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            {
              list.length > 0 ?

                list.map((item) => {
                  return (
                    <tr>
                      <td><img variant="top" style={{ width: "100px", textAlign: "center", margin: "auto", height: "100px" }} src={`http://localhost:1337/idProof/${item.prod_image}`} className='mt-2' /></td>
                      <td>{item.product_name}</td>
                      <td>{item.product_price}</td>
                      <td>{item.category_id?.category_name}</td>
                      <td>{item.prod_stock} </td>
                      <td>{item.prod_size} </td>
                      <td><NavLink to={`/EditProduct/${item._id}`} className="btn btn-primary">Edit</NavLink>
                        <button onClick={() => deleteProduct(item._id)} className="btn btn-danger">Delete</button></td><br></br>
                    </tr>
                  )
                })
                :
                ""
            }
          </tbody>
        </table>
        
      </div>

    </Fragment>
  )
}

export default ShowProducts