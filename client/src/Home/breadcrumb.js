import React from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/breadcrumb.module.css';


const Breadcrumb = (props) => {
  return (
<div>
    <div className={styles.bread_container} style={{backgroundImage:`url("assets/images/bg_6.jpg")`}}>
        <div className={styles.inner_container}>
                {/* <div class="col-md-9 ftco-animate text-center"> */}
                    <p className={styles.breadcrumbs}><span><a href="/Home">Home</a></span> <span>{props.pageName}</span></p>
                    <h1 className={styles.header}>{props.subTitle}</h1>
                {/* </div> */}
        </div>
    </div>
  </div>
  )
}

export default Breadcrumb