import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavbarAdmin from '../Navbar/NavbarAdmin';
import styles from "../css/shared.module.css"
import '../UI/Card';

const AdminMyOrderDetails = () => {

    const [myFinalOrder, setMyFinalOrder] = useState("")
    const [myOrderDetails, setMyOrderDetails] = useState("")
    const [isUserLoggedIn,setIsUserLoggedIn]=useState(false);
	const [userId, setUserId] = useState(null);
    useEffect(()=>{
		setUserId(localStorage.getItem('admindatatoken'))
		if(userId)
		{
			setIsUserLoggedIn(true)

		}
	},[isUserLoggedIn,userId])

    const { id } = useParams("")

     const getMyOrderDetails = async () => {
        const getMyOrderDetails = await fetch(`http://localhost:1337/api/getadminmyorderid/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const getMyOrderDetailsRes = await getMyOrderDetails.json();

        if (getMyOrderDetailsRes.status === 401 || !getMyOrderDetailsRes) {
            console.log("Error")
        } else {
            console.log(getMyOrderDetailsRes.Order)
            console.log(getMyOrderDetailsRes.OrderDetails)
            setMyFinalOrder(getMyOrderDetailsRes.Order)
            setMyOrderDetails(getMyOrderDetailsRes.OrderDetails)
        }
    }

    


    useEffect(() => {
        getMyOrderDetails()
    }, [])

    return (
        <Fragment>
            <NavbarAdmin />
            {isUserLoggedIn==false?"":
        <div className={styles.main_container_navbar}>
        
            <div className="design_container">
            <h4>YOUR ORDER DETAILS</h4>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Pics</th>
                            <th scope="col">Product</th>
                            <th scope="col">Size</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Total Amount</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Payment Mode</th>
                            <th scope="col">Order Date</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <td><img src={`http://localhost:1337/idProof/${myFinalOrder.product_id?.prod_image}`} height={50} width={50}></img></td>
                            <td>{myFinalOrder.product_id?.product_name}</td>
                            <td>{myFinalOrder.product_id?.prod_size}</td>
                            <td>{myFinalOrder.quantity}</td>
                            <td>{"₹" + myFinalOrder.total}</td>
                            <td>{myOrderDetails.payment_status}</td>
                            <td>{myOrderDetails.payment_mode}</td>
                            <td>{myFinalOrder.created_at}</td>
                        </tr>
                    </tbody>
                </table>
                <br></br><br></br>
                <table>
                    <tr>
                        <td>Delivery Address : {myFinalOrder.user_id?.full_name},{" " + myOrderDetails.address_id?.pincode}</td>
                    </tr>
                    <tr>
                        <td>{myOrderDetails.address_id?.street}</td>
                    </tr>
                    <tr>
                        <td>{myOrderDetails.address_id?.city + ", " + myOrderDetails.address_id?.state}</td>
                    </tr>
                    <tr>
                        <td>Mobile Number : {myOrderDetails.address_id?.phone}</td>
                    </tr>
                </table>
                
               


            </div>
        </div>
        }
        </Fragment>
    )
}

export default AdminMyOrderDetails