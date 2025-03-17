import React, { useState, useEffect } from "react";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5152/api/Feedback/all")
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching feedbacks:", error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Customer Feedback</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Feedback ID</th>
            <th>Customer Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No feedbacks found.</td>
            </tr>
          ) : (
            feedbacks.map((feedback) => (
              <tr key={feedback.feedbackId}>
                <td>{feedback.feedbackId}</td>
                <td>{feedback.customerName}</td>
                <td>{feedback.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFeedback;
