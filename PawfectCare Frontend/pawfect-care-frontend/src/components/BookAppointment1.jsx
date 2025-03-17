import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookAppointment1 = () => {
  const { petId } = useParams(); // Get petId from URL params
  const navigate = useNavigate();
  const customerId = JSON.parse(localStorage.getItem("user"))?.id || null; // Get customerId from localStorage

  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch("http://localhost:5152/api/Services");
      const data = await response.json();
      setServices(data);
    };
    fetchServices();
  }, []);
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0]; // Ensures correct format
  };
  
  const checkSlotAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:5152/api/Appointment/Viewslots?appointmentDate=${formatDate(appointmentDate)}&appointmentTime=${selectedTimeSlot}`
      );
      const data = await response.json();
      if (data.availableSlots !== undefined) {
        return data.availableSlots;
      } else {
        alert("No slots available for this time slot. Please choose another time.");
      return 0;
      }
    } catch (error) {
      console.error("Error fetching slot count:", error);
      return 0; // Assume full if error occurs
    }
  };

  const handleViewSlots = async (e) => {
    e.preventDefault();

    if (!selectedTimeSlot || !selectedService || !appointmentDate) {
      alert("Please fill all the details.");
      return;
    }

    const availableSlots = await checkSlotAvailability();

    if (availableSlots > 0) {
      navigate("/customer/bookappointment2", {
        state: {
          customerId,
          petId,
          appointmentDate,
          selectedTimeSlot,
          selectedService,
          selectedServiceName: services.find(service => service.serviceId === selectedService)?.name || "",
          availableSlots,  // Pass availableSlots to next component
        },
      });
    } else {
      alert("No slots available for this time slot.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Book Appointment</h2>
      <form onSubmit={handleViewSlots}>
        <div className="mb-3">
          <label className="form-label">Customer ID</label>
          <input type="text" className="form-control" value={customerId} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Pet ID</label>
          <input type="text" className="form-control" value={petId} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Select Date</label>
          <input type="date" className="form-control" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Select Time Slot</label>
          <div>
            <label className="me-3">
              <input type="radio" name="timeSlot" value="10 AM - 12 PM" onChange={(e) => setSelectedTimeSlot(e.target.value)} required /> 10 AM - 12 PM
            </label>
            <label className="me-3">
              <input type="radio" name="timeSlot" value="1 PM - 3 PM" onChange={(e) => setSelectedTimeSlot(e.target.value)} required /> 1 PM - 3 PM
            </label>
            <label>
              <input type="radio" name="timeSlot" value="4 PM - 6 PM" onChange={(e) => setSelectedTimeSlot(e.target.value)} required /> 4 PM - 6 PM
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Select Service</label>
          <select className="form-control" value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">View Slots Availability</button>
      </form>
    </div>
  );
};

export default BookAppointment1;