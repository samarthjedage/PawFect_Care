import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewMyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  // Retrieve the user object from localStorage and extract the id
  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user ? user.id : null;

  useEffect(() => {
    if (customerId) {
      fetchAppointments(customerId);
    } else {
      setError("Customer ID not found in local storage.");
    }
  }, [customerId]);

  const fetchAppointments = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:5152/api/Appointment/Customer/${customerId}`);
      setAppointments(response.data);
    } catch (error) {
      setError("Error fetching appointments: " + error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5152/api/Appointment/Delete/${appointmentId}`);
      setAppointments(appointments.filter((appointment) => appointment.appointmentId !== appointmentId));
    } catch (error) {
      setError("Error canceling appointment: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Appointments</h2>

      {error && <p className="text-danger">{error}</p>}

      {appointments.length === 0 ? (
        <p className="text-center">No appointments found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Appointment ID</th>
                <th>Customer Name</th>
                <th>Pet Name</th>
                <th>Service Name</th>
                <th>Appointment Date</th>
                <th>appointment Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.appointmentId}>
                  <td>{appointment.appointmentId}</td>
                  <td>{appointment.customerName}</td>
                  <td>{appointment.petName}</td>
                  <td>{appointment.serviceName}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => cancelAppointment(appointment.appointmentId)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewMyAppointments;
