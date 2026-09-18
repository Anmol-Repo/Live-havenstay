import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import  Navbar from "./component/common/Navbar"
import RegisterPage from './component/auth/Register';
import LoginPage from './component/auth/LoginPage';
import HomePage from './component/home/HomePage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';
import RoomDetailsPage from './component/booking_rooms/RoomDetailsPage';
import {AdminRoute, CustomerRoute} from './service/Guard'
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


function App() {
  return (  
    <BrowserRouter>
    <div className="App">
       <Navbar/> 
       <div className="content">
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/rooms" element={<AllRoomsPage/>}/>
          <Route path="/how-it-works" element={<HowItWorksPage/>}/>
          <Route path="/find-booking" element={<FindBookingPage/>}/>

         <Route path="/room-details/:roomId" element={<RoomDetailsPage/>} />

          <Route path="/profile" 
          element={<CustomerRoute element={<ProfilePage/>}/>} />
         
          <Route path="/edit-profile" 
          element={<CustomerRoute element={<EditProfilePage/>}/>} />

          <Route
           path="/payment/:bookingReference"
           element={<CustomerRoute element={<PaymentPage/>} />}/>

          <Route
          path="/payment-success/:bookingReference"
         element={<CustomerRoute element={<PaymentSuccess/>} />}/>

          <Route
          path="/payment-failure/:bookingReference"
         element={<CustomerRoute element={<PaymentFailure/>} />}/>

         {/*ADMIN ROUTES */}
         <Route path="/admin"
         element={<AdminRoute element={<AdminPage/>} />}/>
          {/* The ADMIN Route only can be accessed by a ADMIN */}

         <Route path="/admin/manage-rooms"
         element={<AdminRoute element={<ManageRoomPage/>} />}/>
         
         <Route path="/admin/add-room"
         element={<AdminRoute element={<AddRoomPage/>} />}/>
         
         <Route path="/admin/edit-room/:roomId"
         element={<AdminRoute element={<EditRoomPage/>} />}/>
         
         <Route path="/admin/manage-bookings"
         element={<AdminRoute element={<ManageBookingsPage/>} />}/>
         
         <Route path="/admin/edit-booking/:bookingCode"
         element={<AdminRoute element={<EditBookingPage/>} />}/>
         
         <Route path="/admin-register"
         element={<AdminRoute element={<AdminRegisterPage/>} />}/>


        
        {/* FALLBACK URL */}
        <Route path="*" element={<Navigate to="/home" />} />
        </Routes>

       </div>
       <Footer />
    </div>
    </BrowserRouter>  
  );
}

export default App;
