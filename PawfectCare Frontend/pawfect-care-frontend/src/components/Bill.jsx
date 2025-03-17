import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Bill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { appointmentId, serviceAmount } = location.state || {};
  
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!cardNumber || !cvv || !serviceAmount) {
      alert("Please fill in all payment details.");
      return;
    }

    const paymentData = {
      appointmentId,
      billAmount: serviceAmount,
      cvvno: cvv,
      cardno: cardNumber,
      status: "completed", // Can be dynamic based on actual payment status
    };

    try {
      const response = await fetch("http://localhost:5152/api/Bill/processpayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        setPaymentStatus("Payment Successful");
        alert("Payment processed successfully!");
        // Navigate to a confirmation page or appointment details page
        navigate(`/customer/customerhome`);
      } else {
        setPaymentStatus("Payment Failed");
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      setPaymentStatus("Payment Failed");
      console.error("Error processing payment:", error);
      alert("An error occurred while processing the payment.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Payment for Appointment</h2>
      <form onSubmit={handlePayment}>
        <div className="mb-3">
          <label className="form-label">Appointment ID</label>
          <input type="text" className="form-control" value={appointmentId} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Bill Amount</label>
          <input type="text" className="form-control" value={serviceAmount} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Card Number</label>
          <input
            type="text"
            className="form-control"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">CVV</label>
          <input
            type="text"
            className="form-control"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Pay Now
        </button>
      </form>
      {paymentStatus && <div className="mt-3 text-center">{paymentStatus}</div>}
    </div>
  );
};

export default Bill;
