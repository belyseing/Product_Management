import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/pages/Login";
import SubHeader from "./components/layouts/SubHeader";
import Header from "./components/layouts/Header";
import Hero from "./components/pages/Hero";
import Categories from "./components/pages/Categories";
import ProductList from "./product/ProductList";
import ProductView from "./components/pages/ProductView";
import ProductEdit from "./components/pages/ProductEdit"; 
import CartPage from "./components/pages/CartPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/ProductList"
            element={
              <ProtectedRoute>
                <SubHeader />
                <Header />
                <Hero />
                <Categories />
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <ProductEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
