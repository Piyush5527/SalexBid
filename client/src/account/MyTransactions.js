import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import NavbarBoots from "../Navbar/Navbar";
import styles from "../css/shared.module.css";
import '../UI/Card';

const MyTransactions = () => {

    const [myAmount, setMyAmount] = useState([])
    const navigate = useNavigate();

    const token = localStorage.getItem('usersdatatoken')

    const getTransactionById = async (event) => {

        const myTran = await fetch("http://localhost:1337/api/getmytransactions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const getMyTran = await myTran.json();

        if (getMyTran.status === 401 || !getMyTran) {
            console.log("error")
        } else {
            console.log("User : ", getMyTran)
            setMyAmount(getMyTran)
        }
    }

    useEffect(() => {
        getTransactionById();
    }, [])

    return (
        <div>
            <NavbarBoots />
            <div className={styles.main_container_navbar}>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Transactions ID</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Reason</th>
                            <th scope="col">Refund Available</th>
                            <th scope="col">Refund Done</th>
                            <th scope="col">Payment Date</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {myAmount.map((item) => {
                            return (<>
                                <tr>
                                    <td>{item.t_id}</td>
                                    <td>{"₹" + item.amount}</td>
                                    <td>{item.reason}</td>
                                    <td>{String(item.refund_available)}</td>
                                    <td>{String(item.refund_done)}</td>
                                    <td>{item.created_at}</td>
                                </tr>
                            </>)
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyTransactions