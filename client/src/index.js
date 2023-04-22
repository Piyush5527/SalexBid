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
import CartPage from './cart/CartPage';
import SelectAddress from './account/SelectAddress';
import AddAddress from './account/AddAddress';
import EditAddress from './account/EditAddress';
import EditAddressById from './account/EditAddressById';
import PlaceOrder from './cart/PlaceOrder';
import MyOrders from './account/MyOrders';
import MyOrderDetails from './account/MyOrderDetails';
import AccountPage from './account/AccountPage';
import CreateBid from './Bids/CreateBid';
import ViewAllBids from './admin/ViewAllBids';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path ="/Account" element={<AccountPage></AccountPage>} />
      <Route path ="/SelectAddress" element={<SelectAddress />} />
      <Route path ="/AddAddress" element={<AddAddress />} />
      <Route path ="/EditAddress" element={<EditAddress />} />
      <Route path ="/EditAddressById/:id" element={<EditAddressById />} />

      <Route path ="/MyOrders" element={<MyOrders />} />
      <Route path ="/MyOrderDetails/:id" element={<MyOrderDetails />} />

      <Route path="/Home" element={<Homepage />} />
      <Route path="/Shop" element={<Shop />} />
      <Route path="/Cart" element={<CartPage />} />
      <Route path ="/PlaceOrder/:id" element={<PlaceOrder />} />
      <Route path="/Aboutus" element={<Aboutus />} />
      

      <Route path="/AddCategory" element={<AddCategory />} />
      <Route path="/ViewCategory" element={<ViewCategory />} />
      <Route path="/EditCategory/:id" element={<EditCategory />} />
      
      <Route path="/AddProduct" element={<Addproducts />} />
      <Route path="/getProductDetail/:id" element={<ViewSingleProduct />} />

      <Route path="/AccountPage" element={<AccountPage />} />
      
      <Route path="/CreateBid" element={<CreateBid />} />
      <Route path="/ShowAllBids" element={<ViewAllBids />} />

    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
