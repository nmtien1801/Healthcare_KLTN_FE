import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access_Token');
  
  if (!isAuthenticated) {
    // Nếu chưa đăng nhập thì redirect về login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
