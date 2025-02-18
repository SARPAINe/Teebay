import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">Teebay</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-purple-600">
            Home
          </Link>
          <Link
            to="/user/transaction"
            className="text-gray-600 hover:text-purple-600"
          >
            Transactions
          </Link>
          <Link to="/signin" className="text-gray-600 hover:text-purple-600">
            Sign In
          </Link>
          <Link to="/signup" className="text-gray-600 hover:text-purple-600">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
