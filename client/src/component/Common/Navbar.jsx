import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MERN CRUD Project
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboards" className="hover:underline">Dashboard</Link>
              <Link to="/profile" className="hover:underline">Profile</Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hover:underline">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
