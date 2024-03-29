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
import ShowProducts from './admin/ShowProducts';
import EditProduct from './admin/EditProduct';
import CreateBid from './Bids/CreateBid';
import ViewAllBids from './admin/ViewAllBids';
import ApproveBid from './admin/ApproveBid';
import ViewMyBids from './Bids/ViewMyBids';
import BidsPage from './Bids/BidsPage';
import ViewBidDetails from './Bids/ViewBidDetails';
import JoinBidPayment from './Bids/JoinBidPayment';
import AdminHomePage from './admin/AdminHomePage';
import AdminLogin from './admin/AdminLogin';
import ShowOrders from './admin/ShowOrders';
import ShowFeedbacks from './admin/ShowFeedbacks';
import AdminMyOrderDetails from './admin/AdminMyOrderDetails';
import AdminShowFeedbackDetails from './admin/AdminShowFeedbackDetails';
import OnGoingBid from './Bids/OnGoingBid';
import JoinedBids from './Bids/JoinedBids';
import MyTransactions from './account/MyTransactions';
import ShowTransactions from './admin/ShowTransactions';
import ShowUsers from './admin/ShowUsers';
import ShowUserDetails from './admin/ShowUserDetails';
import ShowHistoryBids from './Bids/ShowHistoryBids';
import BiddingWons from './Bids/BiddingWons';
import Recipt from './Bids/Recipt';

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
      <Route path ="/MyTransactions" element={<MyTransactions />} />

      <Route path="/Home" element={<Homepage />} />
      <Route path="/Shop" element={<Shop />} />
      <Route path="/Cart" element={<CartPage />} />
      <Route path ="/PlaceOrder/:id" element={<PlaceOrder />} />
      <Route path="/Aboutus" element={<Aboutus />} />
      

      <Route path="/AddCategory" element={<AddCategory />} />
      <Route path="/ViewCategory" element={<ViewCategory />} />
      <Route path="/EditCategory/:id" element={<EditCategory />} />

      <Route path="/AdminHomePage" element={<AdminHomePage />} />
      <Route path="/ShowOrders" element={<ShowOrders />} />
      <Route path ="/AdminMyOrderDetails/:id" element={<AdminMyOrderDetails />} />
      <Route path="/AdminLogin" element={<AdminLogin />} />
      

      <Route path="/ViewAllBids" element={<ViewAllBids />} />
      <Route path="/ShowTransactions" element={<ShowTransactions />} />
      
      <Route path="/AddProduct" element={<Addproducts />} />
      <Route path ="/EditProduct/:id" element={<EditProduct />} />
      <Route path="/ShowProducts" element={<ShowProducts />} />

      <Route path="/ShowUsers" element={<ShowUsers />} />
      <Route path="/ShowUserDetails/:id" element={<ShowUserDetails />} />
      
      <Route path="/ShowFeedbacks" element={<ShowFeedbacks />} />
      <Route path="/AdminShowFeedbackDetails/:id" element={<AdminShowFeedbackDetails />} />
      
      <Route path="/getProductDetail/:id" element={<ViewSingleProduct />} />

      <Route path="/AccountPage" element={<AccountPage />} />
      
      <Route path="/CreateBid" element={<CreateBid />} />
      <Route path="/ShowAllBids" element={<ViewAllBids />} />
      <Route path="/EditBid/:id" element={<ApproveBid />} />
      <Route path="/ViewMyBids" element={<ViewMyBids />} />
      <Route path="/BidsPage" element={<BidsPage />} />
      <Route path="/BidDetails/:id" element={<ViewBidDetails />} />
      <Route path="/JoinBidPayment/:id" element={<JoinBidPayment />} />
      <Route path="/OnGoingBid/:id" element={<OnGoingBid />} />
      <Route path="/JoinedBids" element={<JoinedBids />} />
      <Route path="/HistoryBids" element={<ShowHistoryBids />} />
      <Route path="/BidWon" element={<BiddingWons />} />
      <Route path="/Recipt/:id" element={<Recipt />} />


    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
