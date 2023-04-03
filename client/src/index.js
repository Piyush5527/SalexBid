import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './login/Login';
import Register from './register/Register';
import Homepage from './Home/Homepage';
import Shop from './shop/Shop';
import Addproducts from './admin/Addproducts';
import AddCategory from './admin/AddCategory';
import ViewCategory from './admin/ViewCategory';
import EditCategory from './admin/EditCategory';
import Aboutus from './Home/Aboutus';
import ViewSingleProduct from './shop/ViewSingleProduct';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Home" element={<Homepage />} />
      <Route path="/Shop" element={<Shop />} />
      <Route path="/Aboutus" element={<Aboutus />} />
      <Route path="/AddProduct" element={<Addproducts />} />
      <Route path="/AddCategory" element={<AddCategory />} />
      <Route path="/ViewCategory" element={<ViewCategory />} />
      <Route path="/EditCategory/:id" element={<EditCategory />} />
      <Route path="/getProductDetail/:id" element={<ViewSingleProduct />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
