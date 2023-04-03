import React, { Fragment } from 'react';
import Navbar from '../Navbar/Navbar';
import Breadcrumb from './breadcrumb';
import styles from '../css/aboutus.module.css';
import Footer from './Footer';

const Aboutus = () => {
  return (
    <Fragment>
        <Navbar/>
        <Breadcrumb pageName='About Us' subTitle='Solving Doubts'/>
        <div className={styles.main_container}>
            <h2>Contact Us</h2>
            <p>Hi there shopper how you doing hope we are helping you in a great way and giving all that is in our power to satisfy your needs.When you’re starting out, it might seem like there’s not an awful lot to say on your About Us page.
            But if you have a point of view and know why you’re doing what you do in service of your customers, you have enough to start with. You can expand upon what milestones you’ve crossed as you grow, improving your About Us page over time.
            And for those who are already well into their own story, it might be worth taking a look at your analytics to see if new visitors are regularly stopping by your About Us page.
            Maybe it’s time to take another pass at it and start treating your About Us page like the valuable online asset for your business it’s meant to be.</p>
            <p>Here are our contact details. In case any problem occur you can freely email us and our team will reply as fast as we can</p>


            {/* <div className="py-1 bg-black">
    	        <div className="container">
    		        <div className="row no-gutters d-flex align-items-start align-items-center px-md-0">
	    		        <div className="col-lg-12 d-block">
                            <div className="row d-flex">
                                <div className="col-md pr-4 d-flex topper align-items-center">
                                    <div className="icon mr-2 d-flex justify-content-center align-items-center"><span className="icon-phone2"></span></div>
                                    <span className="text">+91 88888 77777</span>
                                </div>
                                <div className="col-md pr-4 d-flex topper align-items-center">
                                    <div className="icon mr-2 d-flex justify-content-center align-items-center"><span className="icon-paper-plane"></span></div>
                                    <span className="text">salexbid@mgmt.com</span>
                                </div>
                                <div className="col-md-5 pr-4 d-flex topper align-items-center text-lg-right">
                                    <span className="text">3-5 Business days delivery &amp; Free Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

        <div className="row d-flex mb-5 contact-info">
            <div className="w-100"></div>
            <div className="col-md-3 d-flex">
            <div className="info bg-white p-4">
                <p><span>Address:</span>LJ institute of Comp Application Sarkhej</p>
                </div>
            </div>
            <div className="col-md-3 d-flex">
            <div className="info bg-white p-4">
                <p><span>Phone:</span> <a href="tel://1234567920">+91 8899665544</a></p>
                </div>
            </div>
            <div className="col-md-3 d-flex">
            <div className="info bg-white p-4">
                <p><span>Email:</span> <a href="mailto:info@yoursite.com">salexbid@mgmt.com</a></p>
                </div>
            </div>
            <div className="col-md-3 d-flex">
            <div className="info bg-white p-4">
                <p><span>Website</span> <a href="/Home">localhost:3000/home</a></p>
                </div>
            </div>
        </div>
        
        <h2>FAQ's</h2>
        <h5>Q1. What are the Criteria to take part in Bidding?</h5>
        <h6 className={styles.answer}>Ans. Your have to be older than 18 years to take part in Bidding, and the basic knowledge how to join the and perform the bidding</h6>
        <hr/>
        <h5>Q2. Does We need to pay any entry fees to enter to any bidding?</h5>
        <h6 className={styles.answer}>Ans. Yes you have to pay Rs. 100 to enter the bidding as in terms of Security deposit, Because if you won the bidding 
        you cannout backout from buying the product and those who didnt win the bidding will get the refund by the administrator</h6>
        <hr/>
        <h5>Q3. How much time it will take to get our product?</h5>
        <h6 className={styles.answer}>Ans. After you won the bidding the product will dispatch in 1 or 2 days you can pay either in COD or ONLINE as you want</h6>
        <hr/>
        </div>
        {/* <Footer/> */}
    </Fragment>
  )
}

export default Aboutus