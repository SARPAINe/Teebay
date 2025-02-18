import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccessToken, setAccessToken } from "../utils/tokenManager";
import { LOGOUT_MUTATION } from "../graphql/mutation";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getAccessToken();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      toast.success("Logged out successfully");
      setAccessToken(null);
      setIsLoggedIn(false);
      navigate("/signin");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">Teebay</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-purple-600">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/user/transaction"
                className="text-gray-600 hover:text-purple-600"
              >
                Transactions
              </Link>
              <Link
                to="/user/products"
                className="text-gray-600 hover:text-purple-600"
              >
                My Products
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-purple-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-gray-600 hover:text-purple-600"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-gray-600 hover:text-purple-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
