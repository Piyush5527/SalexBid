import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NavbarAdmin from '../Navbar/NavbarAdmin';
import styles from "../css/shared.module.css"
import '../UI/Card';

const AdminShowFeedbackDetails = () => {

    const [myFeedback, setMyFeedback] = useState("")
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
        const getMyOrderDetails = await fetch(`http://localhost:1337/api/getadminfeedbackid/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const getMyOrderDetailsRes = await getMyOrderDetails.json();

        if (getMyOrderDetailsRes.status === 401 || !getMyOrderDetailsRes) {
            console.log("Error")
        } else {
            console.log(getMyOrderDetailsRes)
            setMyFeedback(getMyOrderDetailsRes)
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
                            <th scope="col">Picture</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Size</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Customer Email</th>
                            <th scope="col">Customer Phone</th>
                            <th scope="col">Feedback Date</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr>
                            <td><img src={`http://localhost:1337/idProof/${myFeedback.product_id?.prod_image}`} height={50} width={50}></img></td>
                            <td>{myFeedback.product_id?.product_name}</td>
                            <td>{myFeedback.product_id?.prod_size}</td>
                            <td>{myFeedback.user_id?.full_name}</td>
                            <td>{myFeedback.user_id?.email}</td>
                            <td>{myFeedback.user_id?.phone}</td>
                            <td>{myFeedback.created_at}</td>
                        </tr>
                    </tbody>
                </table>
                <br></br><br></br>
                <table>
                    <tr>
                        <td>Feedback about Product : {myFeedback.feedback}</td>
                    </tr>

                    <tr>

                    </tr>
                </table>
                
               


            </div>
        </div>
        }
        </Fragment>
    )
}

export default AdminShowFeedbackDetails