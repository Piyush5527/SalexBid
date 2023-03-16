import React from 'react';
import styles from '../css/product.module.css';
const Product = (props) => {
  return (
    <div className={styles.prod_container}>
        <div class="product">
            <a href="#" class="img-prod"><img class="img-fluid" src={props.imgpath} alt="Colorlib Template"/>
                {/* <span class="status">30%</span> */}
                <div class="overlay"></div>
            </a>
            <div class="text py-3 px-3">
                <h3><a href="#">{props.prodName}</a></h3>
                <div class="d-flex">
                    <div class="pricing">
                        <p class="price"><span class="mr-2 price-dc">$120.00</span><span class="price-sale">{props.price}</span></p>
                    </div>
                    {/* <div class="rating">
                        <p class="text-right">
                            <a href="#"><span class="ion-ios-star-outline"></span></a>
                            <a href="#"><span class="ion-ios-star-outline"></span></a>
                            <a href="#"><span class="ion-ios-star-outline"></span></a>
                            <a href="#"><span class="ion-ios-star-outline"></span></a>
                            <a href="#"><span class="ion-ios-star-outline"></span></a>
                        </p>
                    </div> */}
                </div>
                <p class="bottom-area d-flex px-3">
                    <a href="#" class="add-to-cart text-center py-2 mr-1"><span>Add to cart <i class="ion-ios-add ml-1"></i></span></a>
                    <a href="#" class="buy-now text-center py-2">Buy now<span><i class="ion-ios-cart ml-1"></i></span></a>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Product