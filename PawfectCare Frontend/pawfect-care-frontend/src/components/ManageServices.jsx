import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ApiUrl = "http://localhost:5152/api/Services";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(ApiUrl)
      .then((response) => {
        setServices(response.data); // Update state with API data
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${ApiUrl}/${id}`);
        setServices(services.filter((service) => service.serviceId !== id)); // Remove from state
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/manageservices-add" className="btn btn-success">
          Add Service
        </Link>
        <h2 className="text-center flex-grow-1">Manage Services</h2>
      </div>
      <table className="table table-bordered">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Updated At </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.serviceId}>
              <td>{service.serviceId}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.price}</td>
              <td>{service.updatedAt}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    navigate(`/manageservices-update/${service.serviceId}`)
                  }
                >
                  Update
                </button>
                <Link
                  to=""
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(service.serviceId)}
                >
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageServices;
