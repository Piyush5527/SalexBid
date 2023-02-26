import React,{Fragment} from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
import '../css/owl.css';
import Navbar from '../Navbar/Navbar';
const Homepage = () => {
  return (
    <Fragment>
		{/* kvjhsvj */}
		<Navbar/>
       <div class='container-fluid' >    
        <OwlCarousel items={1}  
			className="owl-theme"    
			autoplay ={true}
			margin={40} >  
				<div><img className="img" src= {'assets/images/image_1.jpg'} alt="img1"/></div>  
				<div><img className="img" src= {'assets/images/image_2.jpg'} alt="img1"/></div>  
				<div><img className="img" src= {'assets/images/image_3.jpg'} alt="img1"/></div>  
				<div><img className="img" src= {'assets/images/image_4.jpg'} alt="img1"/></div>  
				<div><img className="img" src= {'assets/images/image_5.jpg'} alt="img1"/></div>  
				<div><img className="img" src= {'assets/images/image_6.jpg'} alt="img1"/></div>  
		</OwlCarousel>  
      </div>  
    </Fragment>
  )
}

export default Homepage