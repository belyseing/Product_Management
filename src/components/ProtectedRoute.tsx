// import { ReactNode } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return user ? <>{children}</> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;