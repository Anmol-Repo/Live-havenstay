import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from "./component/common/Navbar";
import RegisterPage from './component/auth/Register';
import LoginPage from './component/auth/LoginPage';
import HomePage from './component/home/HomePage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';
import RoomDetailsPage from './component/booking_rooms/RoomDetailsPage';
import { AdminRoute, CustomerRoute } from './service/Guard';
import FindBookingPage from './component/booking_rooms/FindBookingPage';
import ProfilePage from './component/profile/ProfilePage';
import EditProfilePage from './component/profile/EditProfile';
import PaymentPage from "./component/payment/PaymentPage";
import PaymentSuccess from "./component/payment/PaymentSuccess";
import PaymentFailure from "./component/payment/PaymentFailure";
import AdminPage from './component/admin/AdminPage';
import ManageRoomPage from './component/admin/ManageRoomPage';
import AddRoomPage from './component/admin/AddRoomPage';
import EditRoomPage from './component/admin/EditRoomPage';
import ManageBookingsPage from './component/admin/ManageBookingsPage';
import EditBookingPage from './component/admin/EditBookingPage';
import AdminRegisterPage from './component/admin/AdminRegisterPage';
import HowItWorksPage from './component/how_it_works/HowItWorksPage';
import Footer from './component/common/Footer';

const HowItWorksPrompt = () => {

const location = useLocation();
const navigate = useNavigate();

const [showPrompt, setShowPrompt] = useState(false);

useEffect(() => {

if (location.pathname === "/how-it-works") {
  setShowPrompt(false);
  return;
}

const alreadyShown = sessionStorage.getItem(
  "havenstayHowItWorksPrompt"
);

if (!alreadyShown) {
  setShowPrompt(true);

  sessionStorage.setItem(
    "havenstayHowItWorksPrompt",
    "true"
  );
}

}, [location.pathname]);

useEffect(() => {

if (showPrompt) {

  const timer = setTimeout(() => {
    setShowPrompt(false);
  }, 2500);

  return () => clearTimeout(timer);
}

}, [showPrompt]);

if (!showPrompt) {
return null;
}

return (
<div className="havenstay-how-it-works-prompt">

  <div className="havenstay-prompt-content">

    <div className="havenstay-prompt-text">

      <h3>See HavenStay in Action</h3>

      <p>
        Watch the video walkthrough to see the booking flow and key
        features working live.
      </p>

    </div>


  </div>

</div>

);
};

function App() {

return (

<BrowserRouter>

  <div className="App">

    <Navbar />

    <HowItWorksPrompt />


    <div className="content">

      <Routes>

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<HomePage />} />

        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />

        <Route
          path="/rooms"
          element={<AllRoomsPage />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorksPage />}
        />

        <Route
          path="/find-booking"
          element={<FindBookingPage />}
        />


        <Route
          path="/room-details/:roomId"
          element={<RoomDetailsPage />}
        />


        <Route
          path="/profile"
          element={<CustomerRoute element={<ProfilePage />} />}
        />


        <Route
          path="/edit-profile"
          element={<CustomerRoute element={<EditProfilePage />} />}
        />


        <Route
          path="/payment/:bookingReference"
          element={<CustomerRoute element={<PaymentPage />} />}
        />


        <Route
          path="/payment-success/:bookingReference"
          element={<CustomerRoute element={<PaymentSuccess />} />}
        />


        <Route
          path="/payment-failure/:bookingReference"
          element={<CustomerRoute element={<PaymentFailure />} />}
        />


        {/* ADMIN ROUTES */}

        <Route
          path="/admin"
          element={<AdminRoute element={<AdminPage />} />}
        />


        <Route
          path="/admin/manage-rooms"
          element={<AdminRoute element={<ManageRoomPage />} />}
        />


        <Route
          path="/admin/add-room"
          element={<AdminRoute element={<AddRoomPage />} />}
        />


        <Route
          path="/admin/edit-room/:roomId"
          element={<AdminRoute element={<EditRoomPage />} />}
        />


        <Route
          path="/admin/manage-bookings"
          element={<AdminRoute element={<ManageBookingsPage />} />}
        />


        <Route
          path="/admin/edit-booking/:bookingCode"
          element={<AdminRoute element={<EditBookingPage />} />}
        />


        <Route
          path="/admin-register"
          element={<AdminRoute element={<AdminRegisterPage />} />}
        />


        {/* FALLBACK URL */}

        <Route
          path="*"
          element={<Navigate to="/home" />}
        />

      </Routes>

    </div>


    <Footer />

  </div>

</BrowserRouter>

);
}

export default App;