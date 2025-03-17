import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GiveFeedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ description: "" });
  const [customerId, setCustomerId] = useState(null);

  // Fetch customerId from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObject = JSON.parse(storedUser);
      setCustomerId(userObject.id); // Assuming user object has an 'id' field
    } else {
      navigate("/customer/customerhome"); // Redirect to home if user not logged in
    }
  }, [navigate]);

  // Handle form input change
  const handleChange = (e) => {
    setFeedback({ ...feedback, description: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      alert("Customer ID not found. Please log in again.");
      return;
    }

    const response = await fetch("http://localhost:5152/api/Feedback/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...feedback, customerId }), // Include customerId
    });

    if (response.ok) {
      alert("Feedback submitted successfully!");
      setFeedback({ description: "" }); // Reset form
    } else {
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Give Feedback</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Your Feedback
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={feedback.description}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GiveFeedback;
