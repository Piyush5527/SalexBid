import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import NavbarBoots from "../Navbar/NavbarAdmin";
import styles from "../css/shared.module.css";
import '../UI/Card';

const ShowUsers = () => {

    const [users, setUsers] = useState([])
    const navigate = useNavigate();

    const [isUserLoggedIn,setIsUserLoggedIn]=useState(false);
	const [userId, setUserId] = useState(null);
    useEffect(()=>{
		setUserId(localStorage.getItem('admindatatoken'))
		if(userId)
		{
			setIsUserLoggedIn(true)

		}
	},[isUserLoggedIn,userId])

    const getUsers = async (event) => {

        const myOrders = await fetch("http://localhost:1337/api/getallusers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const getMyOrders = await myOrders.json();

        if (getMyOrders.status === 401 || !getMyOrders) {
            console.log("error")
        } else {
            console.log("User : ", getMyOrders)
            setUsers(getMyOrders)
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <div>
            <NavbarBoots />
            {isUserLoggedIn==false?"":
            <div className={styles.main_container_navbar}>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Full Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Address</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Registration Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">



                        {users.map((item) => {

                            return (<>
                                <tr>
                                    <td>{item.full_name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.address}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.created_at}</td>
                                    <td><NavLink to={`/ShowUserDetails/${item._id}`}>See Details</NavLink></td>

                                </tr>
                            </>)
                        })}
                    </tbody>
                </table>
            </div>
            }
        </div>
    )
}

export default ShowUsers