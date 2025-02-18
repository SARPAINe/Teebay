import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TransactionPage from "./pages/TransactionPage";
import { ToastContainer } from "react-toastify";
import ProductDetail from "./pages/ProductDetail";
import Header from "./components/Header"; // Import the Header component

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer />
        <Header /> {/* Include the Header component */}
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/products" />
          <Route path="/user/create" />
          <Route path="/user/transaction" element={<TransactionPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
