import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import SignInPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import { logout } from "./services/authService";

// Listing Imports
import AllListings from "./pages/Listing/AllListings";
import CreateListing from "./pages/Listing/CreateListing";
import EditListing from "./pages/Listing/EditListing";
import ListingDetails from "./pages/Listing/ListingDetails";
import MyListings from "./pages/Listing/MyListings";


// Report Imports
import ReportForm from "./pages/Report/ReportForm";

//Order Imports
import MyOrders from './pages/Orders/MyOrders'
import OrderDetails from './pages/Orders/OrderDetails'

function App() {
  function  getUserFromToken (){
    const token = localStorage.getItem("token");

    if (!token) return null;

    return JSON.parse(atob(token.split(".")[1]));
  };


  const [user, setUser] = useState(getUserFromToken());

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/sign-in" />}
        />

        {/* Listing Routes */}
        <Route path="/listings" element={<AllListings/>}/>
        <Route path="/listings/new" element={<CreateListing/>}/>
        <Route path="/listings/:listingId/edit" element={<EditListing/>}/>
        <Route path="/listings/:listingId" element={<ListingDetails/>}/>
        <Route path="/listings/my-listings" element={<MyListings/>}/>


        {/* Report Routes (the form is a stub until it is built) */}
        <Route path="/reports/new" element={<ReportForm />}/>

        {/* Order Routes*/}
        <Route path='/orders' element={<MyOrders />}/>
        <Route path="/orders/:orderId" element={<OrderDetails />}/>


      </Routes>
    </div>
  );
}

export default App;
