import React,{useState,useEffect} from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
// import "../css/open-iconic-bootstrap.min.css";
// import "../css/animate.css";
// import "../css/owl.carousel.min.css";
// import "../css/owl.theme.default.min.css";
// import "../css/magnific-popup.css";
// import "../css/aos.css";
import "../css/ionicons.min.css";
// import "../css/bootstrap-datepicker.css";
// import "../css/jquery.timepicker.css";
// import "../css/flaticon.css";
import "../css/icomoon.css";
import "../css/style.css";


const Navbar = () => {
	const navigate=useNavigate();

	const [isUserLoggedIn,setIsUserLoggedIn]=useState(false);
	const [userId, setUserId] = useState(null);
	useEffect(()=>{
		setUserId(localStorage.getItem('usersdatatoken'))
		if(userId)
		{
			setIsUserLoggedIn(true)

		}
	},[isUserLoggedIn,userId])
	

	const logoutHandler=async()=>{
		localStorage.clear()
		const res=await fetch("http://localhost:1337/api/logout",{
			method: "GET",
      		headers: {
          		"Content-Type": "application/json"
      		}
		})
		
		const logoutMessage = await res.json()
		if (res.status === 422 || !logoutMessage) {
		  console.log("error");
		} else {
			alert("You Have Successfully Logout")
			navigate("/Home")
			window.location.reload(false);
		}
	}
  return (
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light" id="ftco-navbar">
	    <div class="container">
	      <a class="navbar-brand" style={{color:'black'}}>Sale X Bid</a>
	      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
	        <span class="oi oi-menu"></span> Menu
	      </button>

	      {
			isUserLoggedIn &&
			<div class="collapse navbar-collapse" id="ftco-nav">
	        <ul class="navbar-nav ml-auto">
	          <li class="nav-item active"><a href='/Home'  class="nav-link">Home</a></li>
	          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Shop</a>
              <div class="dropdown-menu" aria-labelledby="dropdown04">
              	<a class="dropdown-item" href="shop">Shop</a>
                {/* <a class="dropdown-item" href="product-single.html">Single Product</a> */}
                <a class="dropdown-item" href="/Cart">Cart</a>
                <a class="dropdown-item" href="checkout.html">Checkout</a>
				{/* <a class="dropdown-item" href="/Account">Account</a> */}
              </div>
            </li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Bids</a>
					<div class="dropdown-menu" aria-labelledby="dropdown04">
						<a class="dropdown-item" href="/BidsPage">Bids Page</a>
						<a class="dropdown-item" href="/CreateBid">Create Bid</a>
						<a class="dropdown-item" href="/ViewMyBids">My Bids</a>
						<a class="dropdown-item" href="/Cart">Joined Bids</a>
						<a class="dropdown-item" href="checkout.html">History</a>

					</div>
				</li>
	          <li class="nav-item"><a href="/Aboutus" class="nav-link">Contact</a></li>
			  <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="/Account" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Account</a>
              <div class="dropdown-menu" aria-labelledby="dropdown04">
              	<a class="dropdown-item" href='/AccountPage'>My Account</a>
              	<a class="dropdown-item" style={{cursor:'pointer'}} onClick={logoutHandler}>Logout</a>
                
              </div>
            </li>
	          <li class="nav-item cta cta-colored"><a href="/cart" class="nav-link"><span class="icon-shopping_cart"></span>[0]</a></li>

	        </ul>
	      </div>
		}
		{
			!isUserLoggedIn &&
			<div class="collapse navbar-collapse" id="ftco-nav">
	        <ul class="navbar-nav ml-auto">
	          <li class="nav-item active"><a href='/Home'  class="nav-link">Home</a></li>
			<li class="nav-item"><a href="/Aboutus" class="nav-link">About Us</a></li>
	          <li class="nav-item"><a href="/Login" class="nav-link">Login</a></li>
	          <li class="nav-item"><a href="/Register" class="nav-link">Register</a></li>
	        </ul>
	      </div>
		}
	    </div>
	  </nav>
    </div>
  )
}

export default Navbar