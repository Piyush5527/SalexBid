import axios from 'axios';
import React,{useEffect,useState} from 'react';
import styles from '../css/viewcategory.module.css';
import {NavLink} from 'react-router-dom';
const ViewCategory = () => {

    const [catList,setCatList]=useState([])

    const getCategoryList = async() =>{
        const res=await fetch("http://localhost:1337/api/getcategory",{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const categoryData = await res.json()
        if (res.status === 422 || !categoryData) {
            console.log("error")
        } else {
            setCatList(categoryData)
            // console.log(categoryData);
        }
    }
    const deleteHandler=async(id)=>{
        const res=await axios.delete('http://localhost:1337/api/detelecategory/'+id);
        if(res.status===200)
        {
            alert('delete success')
            getCategoryList()
        }
        else{
            alert("Delete Failed")
        }
        console.log(id)
    }
    useEffect(()=>{
        getCategoryList()
    },[])
  return (
    <div className={styles.main_container}>
        <h2 className={styles.title}>View All Categories</h2>
        <NavLink to={'/AddCategory'} className="btn btn-success">Add New Category</NavLink>
        <table className={styles.table_container}>
            <tr>
                <th>Sr. No.</th>
                <th>Category Name</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
            {catList.map((item,index)=>{
                return(
                    <tr>
                        <td>{index}</td>
                        <td>{item.category_name}</td>
                        <td><NavLink to={`/EditCategory/${item._id}`} className="btn btn-primary">Edit</NavLink></td>
                        <td><NavLink className="btn btn-danger" onClick={()=>deleteHandler(item._id)}>Delete</NavLink></td>
                    </tr>
                )
            })}
        </table>
    </div>
  )
}

export default ViewCategory