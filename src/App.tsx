import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SubHeader from "./components/layouts/SubHeader";
import Header from "./components/layouts/Header";
import Hero from "./components/pages/Hero";
import Categories from "./components/pages/Categories";
import ProductList from "./product/ProductList";
import ProductView from "./components/pages/ProductView";
import ProductEdit from "./components/pages/ProductEdit"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage with all sections */}
        <Route
          path="/"
          element={
            <>
              <SubHeader />
              <Header />
              <Hero />
              <Categories />
              <ProductList />
            </>
          }
        />

        {/* Product View page */}
        <Route path="/edit-product/:id" element={<ProductEdit />} />
        <Route path="/product/:id" element={<ProductView />} />
      </Routes>
    </Router>
  );
}

export default App;