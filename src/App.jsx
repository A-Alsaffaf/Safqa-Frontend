import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
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

// Account Imports
import AccountLayout from "./pages/Account/AccountLayout";
import AccountWatchlist from "./pages/Account/AccountWatchlist";
import AccountBids from "./pages/Account/AccountBids";
import AccountCategories from "./pages/Account/AccountCategories";

// Order Imports
import MyOrders from "./pages/Orders/MyOrders";
import OrderDetails from "./pages/Orders/OrderDetails";


//Report Imports 
import ReportForm from './pages/Report/ReportForm'
import AllReports from "./pages/Report/AllReports";
import ReportDetails from './pages/Report/ReportDetails'





function App() {
  function getUserFromToken() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    return JSON.parse(atob(token.split(".")[1]));
  }

  const [user, setUser] = useState(getUserFromToken());
  const { pathname } = useLocation();
  const onAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  function handleLogout() {
    logout();
    setUser(null);
  }

  return (
    <div>
      {/* The log in and register pages have their own full-page layout, without the main navigation */}
      {!onAuthPage && <Navbar user={user} handleLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SignInPage setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/sign-in" />}
        />

        {/* Listing Routes */}
        <Route path="/listings" element={<AllListings />} />
        <Route path="/listings/new" element={<CreateListing />} />
        <Route path="/listings/:listingId/edit" element={<EditListing user={user} />} />
        <Route path="/listings/:listingId" element={<ListingDetails user={user} />} />
        <Route path="/listings/my-listings" element={<MyListings />} />

        {/* Account Routes (logged-in users only) */}
        {/* /account has no page of its own: it opens the first tab */}
        <Route path="/account" element={<Navigate to="/account/listings" replace />} />
        {/* The tab pages share the account header and tab bar */}
        <Route
          element={
            user ? (
              <AccountLayout user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        >
          <Route path="/account/listings" element={<MyListings />} />
          <Route path="/account/watchlist" element={<AccountWatchlist />} />
          <Route path="/account/bids" element={<AccountBids user={user} />} />
          <Route path="/account/orders" element={<MyOrders />} />
          {/* Admin tabs: anyone else is sent back to the first tab */}
          <Route
            path="/account/reports"
            element={
              user?.role === "Admin" ? (
                <div className="account-reports">
                  <AllReports />
                </div>
              ) : (
                <Navigate to="/account/listings" replace />
              )
            }
          />
          <Route
            path="/account/categories"
            element={
              user?.role === "Admin" ? <AccountCategories /> : <Navigate to="/account/listings" replace />
            }
          />
        </Route>

        {/* Order Routes */}
        {/* The orders list lives in the account tabs, so /orders (for example the "Back to Orders" link) goes there */}
        <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
        <Route path="/orders/:orderId" element={<OrderDetails user={user} />} />

        {/* Report Routes  */}
        <Route path="/listings/:id/reports" element={<ReportForm />} />
        {/* The reports list lives in the account tabs, so /admin/reports (for example after deleting a report) goes there */}
        <Route path="/admin/reports" element={<Navigate to="/account/reports" replace />} />
        <Route path="/admin/reports/:id" element={<ReportDetails />} />


      </Routes>
    </div>
  );
}

export default App;
