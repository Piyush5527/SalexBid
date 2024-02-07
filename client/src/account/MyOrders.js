import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import NavbarBoots from "../Navbar/Navbar";
import styles from "../css/shared.module.css";
import '../UI/Card';

const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([])
    const navigate = useNavigate();

    const token = localStorage.getItem('usersdatatoken')

    const getMyOrdersById = async (event) => {

        const myOrders = await fetch("http://localhost:1337/api/getmyorders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const getMyOrders = await myOrders.json();

        if (getMyOrders.status === 401 || !getMyOrders) {
            console.log("error")
        } else {
            console.log("User : ", getMyOrders)
            setMyOrders(getMyOrders)
        }
    }

    useEffect(() => {
        getMyOrdersById();
    }, [])

    return (
        <div>
            <NavbarBoots />
            <div className={styles.main_container_navbar}>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Product</th>
                            <th scope="col">Size</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">₹</th>
                            <th scope="col">Order at</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">



                        {myOrders.map((item) => {

                            return (<>
                                <tr>
                                    <td><img src={`http://localhost:1337/idProof/${item.product_id?.prod_image}`} height={50} width={50}></img></td>
                                    <td>{item.product_id?.product_name}</td>
                                    <td>{item.product_id?.prod_size}</td>
                                    <td>{item.quantity}</td>
                                    <td>{"₹" + item.total}</td>
                                    <td>{item.created_at}</td>
                                    <td>{item.order_id.payment_status}</td>
                                    <td><NavLink to={`/MyOrderDetails/${item._id}`}>See Details</NavLink></td>

                                </tr>
                            </>)
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyOrders