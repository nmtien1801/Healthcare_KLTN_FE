import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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
import { setUser, clearUser } from "./redux/authSlice";
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
import FoodTrackerApp from "./pages/patient/nutrition/FoodTrackerApp";
import SuggestedFood from "./pages/patient/nutrition/SuggestedFood";
import { getAuth } from 'firebase/auth';
import AttendanceTab from "./pages/doctor/AttendanceTab";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  // authContext -> duy trì trạng thái đăng nhập của người dùng
  useEffect(() => {

    const unsubscribe = auth.onIdTokenChanged((firebaseUser) => {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (firebaseUser) {
        dispatch(setUser({
          userId: userInfo.userId,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: userInfo.role,
          address: userInfo.address,
          phone: userInfo.phone,
          dob: userInfo.dob,
          gender: userInfo.gender,
        }));
        if (firebaseUser.accessToken !== localStorage.getItem('access_Token')) {
          localStorage.setItem("access_Token", firebaseUser.accessToken);
          // window.location.reload();
        }
        setIsLoading(false);
        return;
      } else {
        // reset user info
        console.log('reset');
        setIsLoading(false);
        dispatch(setUser(null));
        localStorage.clear();
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  console.log('user', user);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column vh-100 w-100 bg-gray-50 text-gray-800 font-sans">
        {/* Header */}
        {user && <div className="header bg-white shadow-sm w-100 fixed top-0"
          style={{ zIndex: 1050 }}>
          <Header />
        </div>}


        {/* NavbarLeft */}
        <div className="d-flex flex-grow-1 overflow-hidden"
          style={{ marginTop: user ? "80px" : "0px" }}>
          {user && <NavbarLeft />}

          {/* Nội dung chính */}
          <div className="content flex-grow-1 overflow-auto p-3">
            <Routes>
              {!user ? (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ResetPassword />} />

                  {/* Nếu user chưa login mà truy cập đường dẫn khác thì redirect về /login */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  {user.role === "doctor" ? (
                    <>
                      <Route path="/overviewTab" element={<OverviewTab />} />
                      <Route path="/patientTab" element={<PatientTab />} />
                      <Route path="/appointmentTab" element={<AppointmentTab />} />
                      <Route path="/settingTabs" element={<SettingTabs />} />
                      <Route path="/informationTab" element={<InformationTab />} />
                      <Route path="/attendanceTab" element={<AttendanceTab />} />
                      {/* Nếu user đã login mà truy cập đường dẫn không hợp lệ thì chuyển về /overviewTab */}
                      <Route path="*" element={<Navigate to="/overviewTab" replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/home" element={<Home />} />
                      <Route path="/healthTabs" element={<HealthTabs />} />
                      <Route path="/nutrition" element={<FoodTrackerApp />} />
                      <Route path="/suggestedFood" element={<SuggestedFood />} />
                      <Route path="/bookingTabs" element={<BookingTabs />} />
                      <Route path="/personalTabs" element={<PersonalTabs />} />
                      {/* Nếu user đã login mà truy cập đường dẫn không hợp lệ thì chuyển về /home */}
                      <Route path="*" element={<Navigate to="/home" replace />} />
                    </>
                  )}
                </>
              )}

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
