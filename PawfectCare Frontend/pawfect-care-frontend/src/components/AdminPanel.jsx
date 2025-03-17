import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setAdmin(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("user"); // Remove user details
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">Pawfect Admin Panel</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/admin/manageservices" className="nav-link">Manage Services</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/view-feedback" className="nav-link">View Feedback</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/view-appointments" className="nav-link">View Appointments</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/view-customers" className="nav-link">View Customers</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Admin Panel Content */}
      <div className="container mt-4">
        <h2 className="text-center">Welcome to the Pawfect Care Admin Panel</h2>
        {admin && <p className="text-center text-muted">Logged in as: <strong>{admin.name}</strong></p>}
      
        {/* Nested Routes will be displayed here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
