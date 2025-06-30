import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import Login from "./pages/auth/login";
import NavbarLeft from "./routes/Router";
import Register from "./pages/auth/register";
import { useSelector, useDispatch } from "react-redux";
import { doGetAccount } from "./redux/authSlice";
import ResetPassword from "./pages/auth/ResetPassword";
import './App.css'
import HealthTabs from "./pages/patient/HealthTabs";
import PersonalTabs from "./pages/patient/PersonalTabs";
import Home from "./pages/patient/Home";
import BookingTabs from "./pages/patient/BookingTabs";
import OverviewTab from "./pages/doctor/OverviewTab";
import InformationTab from "./pages/doctor/InformationTab";
import AppointmentTab from "./pages/doctor/AppointmentTab";
import PatientTab from "./pages/doctor/PatientTab";
import SettingTabs from "./pages/doctor/SettingTabs";
import Header from "./routes/Header";

function App() {
  const dispatch = useDispatch();
  let isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.userInfo);

  // const fetchDataAccount = async () => {
  //   if (!user || !user?.access_Token) {
  //     await dispatch(doGetAccount()).unwrap(); // Chờ API hoàn tất
  //   }
  // };

  // useEffect(() => {
  //   fetchDataAccount();
  // }, [dispatch, user?.access_Token]); // Chỉ phụ thuộc vào dispatch và access_Token

  return (
    <Router>
      <div className="d-flex flex-column vh-100 w-100 bg-gray-50 text-gray-800 font-sans">
        {/* Header */}
        <Header />

        {/* NavbarLeft */}
        <div className="d-flex flex-grow-1 overflow-hidden">
          {/* {isLoggedIn && <NavbarLeft />} */}
          <NavbarLeft />

          {/* Nội dung chính */}
          <div className="content flex-grow-1 overflow-auto p-3">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ResetPassword />} />

              <Route path="/overviewTab" element={<OverviewTab />} />
              <Route path="/patientTab" element={<PatientTab />} />
              <Route path="/appointmentTab" element={<AppointmentTab />} />
              <Route path="/settingTabs" element={<SettingTabs />} />
              <Route path="/informationTab" element={<InformationTab />} />

              <Route path="/home" element={<Home />} />
              <Route path="/healthTabs" element={<HealthTabs />} />
              <Route path="/bookingTabs" element={<BookingTabs />} />
              <Route path="/personalTabs" element={<PersonalTabs />} />

            </Routes>
          </div>
        </div>

      </div>

      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </Router>
  );
}

export default App;
