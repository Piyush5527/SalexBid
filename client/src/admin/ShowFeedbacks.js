import React, { useState, useNavigate, useEffect, Fragment } from 'react'
import { NavLink } from 'react-router-dom';
import styles from "../css/shared.module.css";
import '../UI/Card';
import NavbarAdmin from '../Navbar/NavbarAdmin';

const ShowFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([])


  const getFeedbacks = async (event) => {

      const feedback = await fetch("http://localhost:1337/api/getallfeedbacks", {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      })

      const getFeedback = await feedback.json();

      if (getFeedback.status === 401 || !getFeedback) {
          console.log("error")
      } else {
          console.log("User : ", getFeedback)
          setFeedbacks(getFeedback)
      }
  }

  useEffect(() => {
      getFeedbacks();
  }, [])

  return (
      <Fragment>
          <NavbarAdmin />
          <div className='design_container'>
              <table class="table">
                  <thead>
                      <tr>
                          <th scope="col">User Name</th>
                          <th scope="col">User Email</th>
                          <th scope="col">Product Name</th>
                          <th scope="col">Feedback</th>
                          <th scope="col">Feedback Date</th>
                          <th scope="col">Action</th>
                      </tr>
                  </thead>
                  <tbody class="table-group-divider">



                      {feedbacks.map((item) => {

                          return (<>
                              <tr>
                                  <td>{item.user_id?.full_name}</td>
                                  <td>{item.user_id?.email}</td>
                                  <td>{item.product_id?.product_name}</td>
                                  <td>{item.feedback}</td>
                                  <td>{item.created_at}</td>
                                  <td><NavLink to={`/AdminShowFeedbackDetails/${item._id}`}>See Details</NavLink></td>

                              </tr>
                          </>)
                      })}
                  </tbody>
              </table>
          </div>
      </Fragment>
  )
}

export default ShowFeedbacks