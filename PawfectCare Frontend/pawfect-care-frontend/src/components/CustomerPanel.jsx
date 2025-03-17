import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerPanel = () => {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCustomer(JSON.parse(storedUser));
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
          <a className="navbar-brand" href="#">Welcome Customer </a>
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
                <Link to="/customer/customerhome" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/customer/updateprofile" className="nav-link">Manage Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/customer/managepets" className="nav-link">Manage Pets</Link>
              </li>
              <li className="nav-item">
                <Link to="/customer/viewmyappointments" className="nav-link">View Appointments</Link>
              </li>
             

              <li className="nav-item">
                <Link to="/customer/givefeedback" className="nav-link">Give Feedback</Link>
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
        <h2 className="text-center">Welcome to the Pawfect Care </h2>
        {customer && <p className="text-center text-muted">Logged in as: <strong>{customer.name}</strong></p>}
      
        {/* Nested Routes will be displayed here */}
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerPanel;
