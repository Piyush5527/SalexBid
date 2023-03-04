import React,{Fragment} from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css'; 
import '../css/owl.css';
import Navbar from '../Navbar/Navbar';
import styles from '../css/homepage.module.css';
import '../css/flaticon.css';
import "../css/icomoon.css";
import "../css/ionicons.min.css";
import Footer from './Footer';
const Homepage = () => {
  return (
    <Fragment>
		{/* kvjhsvj */}
		<Navbar/>
		<div className={styles.main_container}>
			<div className={styles.carousel_container}>    
			<OwlCarousel items={1}  
				className="owl-theme"  
				loop  
				dots={false}
				autoplay ={true}
				margin={40} >  
					<div className={styles.carousel_item}>
						<div className={styles.carousel_item+" "+styles.left}>
							
							<h1>Catch Your Own <br/><span className={styles.image_title}>Stylish &amp; Look</span></h1>
							<br/>
							<p><a href='#' class="btn btn-primary px-5 py-3 mt-3">Discover Now</a></p>
						</div>
						<div className={styles.carousel_item+" "+styles.right}><img className="img" src= {'assets/images/bg_1.jpg'} alt="background1"/></div>
						</div>  
					<div className={styles.carousel_item}>
						<div className={styles.carousel_item+" "+styles.left}>
							<h1>A Thouroughly <span  className={styles.image_title}>Modern</span> Woman</h1>
							<p><a href="#" class="btn btn-primary px-5 py-3 mt-3">Discover Now</a></p>
						</div>
						<div className={styles.carousel_item+" "+styles.right}><img className="img" src= {'assets/images/bg_2.jpg'} alt="background2"/></div>
					</div>  
				</OwlCarousel>  
			</div> 
			
			<hr/>
		<div className={styles.info_div}>
			<div className={styles.info_div+" "+styles.left}>
				<img src={'assets/images/about.jpg'} alt={'new imag'}></img>
			</div>
			<div className={styles.info_div+" "+styles.right}>
				<h2>Better Way to Ship Your Products</h2>
				<p>But nothing the copy said could convince her and so it didn’t take long until a few insidious Copy Writers ambushed her, made her drunk with Longe and Parole and dragged her into their agency, where they abused her for their.</p>
				<br/>
				<div className={styles.features_container}>
					<div className={styles.features_container+" "+styles.left}>
						<span className="flaticon-002-recommended"></span>
						<h3 class="heading">Refund Policy</h3>
						<p>Even the all-powerful Pointing has no control about the blind texts it is an almost <br/> unorthographic.</p>
					</div>

					<div className={styles.features_container+" "+styles.mid}>
						<span className="flaticon-001-box"></span>
						<h3 class="heading">Premium Packaging</h3>
						<p>Even the all-powerful Pointing has no control about the blind texts it is an almost <br/> unorthographic.</p>
					</div>
					<div className={styles.features_container+" "+styles.right}>
						<span className="flaticon-003-medal"></span>
						<h3 class="heading">Superior Quality</h3>
						<p>Even the all-powerful Pointing has no control about the blind texts it is an almost <br/> unorthographic.</p>
					</div>
				</div>
			</div>
		</div>


	</div>
	<Footer/>
	
    </Fragment>
  )
}

export default Homepage