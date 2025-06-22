// import { Navigate, Outlet } from "react-router-dom";
// import jwtDecode from "jwt-decode";

// const isTokenValid = () => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return false;

//     try {
//         const { exp } = jwtDecode(token);
//         if (!exp) return false;
//         return Date.now() < exp * 1000;
//     } catch {
//         return false;
//     }
// };

// function ProtectedRoute() {
//     const valid = isTokenValid();
//     return valid ? <Outlet /> : <Navigate to="/login" replace />;
// }

// export default ProtectedRoute;