import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Product from "./pages/Product";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProducts from "./pages/UserProducts";
import CreateProduct from "./pages/CreateProduct";
import useAuth from "./hooks/useAuth";

const App = () => {
  const isAuthenticated = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/products"
          // element={
          //   isAuthenticated ? <UserProducts /> : <Navigate to="/signin" />
          // }
        />
        <Route
          path="/products/create"
          element={
            isAuthenticated ? <CreateProduct /> : <Navigate to="/signin" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
