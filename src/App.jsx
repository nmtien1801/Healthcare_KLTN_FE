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
import Header from "./routes/Header";
import FoodTrackerApp from "./pages/patient/nutrition/FoodTrackerApp";
import SuggestedFood from "./pages/patient/nutrition/SuggestedFood";
import { getAuth } from 'firebase/auth';
import AttendanceTab from "./pages/doctor/AttendanceTab";
import FormPatient from "./pages/patient/assistant/FormPatient";
import { dbCall } from "../firebase";
import VideoCallModal from './components/call/videoModalCall'
import {
  ref,
  onValue,
  off,
} from "firebase/database";
import {
  acceptCall,
  endCall,
  createCall,
  generateJitsiUrl,
} from './components/call/functionCall';
import E_wallet from "./pages/payment/E_wallet";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  console.log('Redux user:', user);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  // authContext -> duy trì trạng thái đăng nhập của người dùng
  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged((firebaseUser) => {
      if (firebaseUser) {
        // Có Firebase user, kiểm tra localStorage
        let userInfo = null;
        try {
          userInfo = JSON.parse(localStorage.getItem('userInfo'));
        } catch (error) {
          console.error('Error parsing userInfo from localStorage:', error);
          userInfo = null;
        }

        if (userInfo && userInfo.userId) {
          // Có đầy đủ thông tin từ MongoDB
          dispatch(setUser({
            userId: userInfo.userId,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: userInfo.username || firebaseUser.displayName || 'User',
            avatar: userInfo.avatar || firebaseUser.photoURL || '',
            role: userInfo.role || 'patient',
            address: userInfo.address || '',
            phone: userInfo.phone || '',
            dob: userInfo.dob || '',
            gender: userInfo.gender || '',
          }));

          if (firebaseUser.accessToken !== localStorage.getItem('access_Token')) {
            localStorage.setItem("access_Token", firebaseUser.accessToken);
          }
          setIsLoading(false);
        } else {
          // Firebase user exists but no valid userInfo in localStorage
          setIsLoading(false);
          dispatch(setUser(null));
          localStorage.clear();
          // Có thể redirect về login page ở đây
        }
      } else {
        // Không có Firebase user
        console.log('No Firebase user - logging out');
        setIsLoading(false);
        dispatch(setUser(null));
        localStorage.clear();
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  console.log('user', user);

  // Gọi điện
  const [isCalling, setIsCalling] = useState(false);
  const [jitsiUrl, setJitsiUrl] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);

  const handleStartCall = (caller, callee, role) => {
    const setCallStates = {
      setIsCalling,
      setIsInitiator,
      setReceiver
    };

    // Thêm role cho caller
    const callerWithRole = { ...caller, role: role };

    createCall(callerWithRole, callee, dbCall, setCallStates);
  };

  const handleAcceptCall = async () => {
    const setCallStates = {
      setIsCalling,
      setIncomingCall,
      setReceiver,
      setJitsiUrl
    };

    await acceptCall(incomingCall, user, dbCall, setCallStates);
  };

  const handleEndCall = async () => {
    const setCallStates = {
      setIsCalling,
      setIncomingCall,
      setIsInitiator,
      setReceiver,
      setJitsiUrl
    };

    await endCall(receiver, isInitiator, user, dbCall, setCallStates);
  };

  // Lắng nghe trạng thái cuộc gọi khi là người khởi tạo
  useEffect(() => {
    if (isInitiator && receiver && receiver.uid) {
      const callRef = ref(dbCall, `calls/${receiver.uid.replace(/[.#$[\]]/g, '_')}`);
      const unsubscribe = onValue(
        callRef,
        (snapshot) => {
          const callData = snapshot.val();
          if (callData && callData.status === "accepted") {
            const { from, to } = callData;
            setJitsiUrl(generateJitsiUrl(from.uid, to.uid));
            setIsCalling(true);
          }
        },
        (err) => {
          console.error("Lỗi khi lắng nghe trạng thái cuộc gọi:", err);
        }
      );

      return () => {
        off(callRef);
      };
    }
  }, [isInitiator, receiver]);

  // Lắng nghe cuộc gọi đến
  useEffect(() => {
    if (user && user.uid) {
      const callListener = ref(dbCall, `calls/${user.uid.replace(/[.#$[\]]/g, '_')}`);
      const unsubscribe = onValue(
        callListener,
        (snapshot) => {
          const callData = snapshot.val();
          if (callData && callData.status === "pending") {
            const { from, to } = callData;
            if (from?.uid && to?.uid) {
              setIncomingCall(from);
              setReceiver(to);
            }
          } else if (callData && callData.status === "accepted") {
            const { from, to } = callData;
            if (from?.uid && to?.uid) {
              setJitsiUrl(generateJitsiUrl(from.uid, to.uid));
              setIsCalling(true);
            }
          } else {
            setIncomingCall(null);
            setJitsiUrl(null);
          }
        },
        (err) => {
          console.error("Lỗi khi lắng nghe cuộc gọi:", err);
        }
      );

      return () => {
        off(callListener);
      };
    }
  }, [user]);

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
                      <Route path="/patientTab" element={<PatientTab handleStartCall={handleStartCall} />} />
                      <Route path="/appointmentTab" element={<AppointmentTab />} />
                      <Route path="/informationTab" element={<InformationTab />} />
                      <Route path="/attendanceTab" element={<AttendanceTab />} />
                      <Route path="/payment" element={<E_wallet />} />
                      {/* Nếu user đã login mà truy cập đường dẫn không hợp lệ thì chuyển về /overviewTab */}
                      <Route path="*" element={<Navigate to="/overviewTab" replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/home" element={<Home />} />
                      <Route path="/healthTabs" element={<HealthTabs />} />
                      <Route path="/nutrition" element={<FoodTrackerApp />} />
                      <Route path="/suggestedFood" element={<SuggestedFood />} />
                      <Route path="/bookingTabs" element={<BookingTabs handleStartCall={handleStartCall} />} />
                      <Route path="/personalTabs" element={<PersonalTabs />} />
                      <Route path="/assitant" element={<FormPatient />} />
                      <Route path="/payment" element={<E_wallet />} />
                      {/* Nếu user đã login mà truy cập đường dẫn không hợp lệ thì chuyển về /home */}
                      <Route path="*" element={<Navigate to="/healthTabs" replace />} />
                    </>
                  )}
                </>
              )}

            </Routes>
          </div>
        </div>
      </div>

      {/* call popup */}
      {!isInitiator && incomingCall && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center p-4">
                <h5 className="mb-3">{incomingCall.username || "Người dùng"} đang gọi bạn...</h5>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-success" onClick={handleAcceptCall}>
                    Chấp nhận
                  </button>
                  <button className="btn btn-danger" onClick={handleEndCall}>
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isCalling && (
        <VideoCallModal
          jitsiUrl={jitsiUrl}
          onClose={handleEndCall}
        />
      )}

      <ToastContainer
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
      />
    </Router>
  );
}

export default App;

