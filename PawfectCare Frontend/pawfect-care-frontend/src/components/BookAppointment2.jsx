import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookAppointment2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, petId, appointmentDate, selectedTimeSlot, selectedService, selectedServiceName, availableSlots } = location.state || {};

  const [serviceAmount, setServiceAmount] = useState(0);

  useEffect(() => {
    const fetchServicePrice = async () => {
      try {
        const response = await fetch(`http://localhost:5152/api/Services/${selectedService}`);
        const data = await response.json();
        setServiceAmount(data.price); // Assuming the response has a "price" field
      } catch (error) {
        console.error("Error fetching service price:", error);
      }
    };

    if (selectedService) {
      fetchServicePrice();
    }
  }, [selectedService]);

  const handleConfirmBooking = async () => {
    const appointmentData = {
      customerId,
      petId,
      appointmentDate,
      appointmentTime: selectedTimeSlot,
      serviceId: selectedService,
    };

    const response = await fetch("http://localhost:5152/api/Appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentData),
    });

    if (response.ok) {
      const result = await response.json();
      const appointmentId = result.appointmentId;

      navigate("/customer/bill", {
        state: {
          appointmentId,
          serviceId: selectedService,
          serviceAmount,
        },
      });
    } else {
      alert("Error booking appointment.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Confirm Appointment</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Customer ID</label>
          <input type="text" className="form-control" value={customerId} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Pet ID</label>
          <input type="text" className="form-control" value={petId} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Appointment Date</label>
          <input type="text" className="form-control" value={appointmentDate} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Time Slot</label>
          <input type="text" className="form-control" value={selectedTimeSlot} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Selected Service</label>
          <input type="text" className="form-control" value={selectedService} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Available Slots</label>
          <input type="text" className="form-control" value={availableSlots} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Service Price</label>
          <input type="text" className="form-control" value={serviceAmount} readOnly />
        </div>
        <button type="button" className="btn btn-success w-100" onClick={handleConfirmBooking}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookAppointment2;