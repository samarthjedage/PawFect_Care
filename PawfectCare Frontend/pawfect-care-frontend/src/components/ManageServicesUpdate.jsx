import React, { useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from "axios";
const ApiUrl="http://localhost:5152/api/Services";


const ManageServicesUpdate = () => {
  const {id}=useParams();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    description: '',
    price: ''
  });
  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.put(`${ApiUrl}/${id}`, formData);
      alert("Service updated successfully!");
      navigate("/admin/manageservices");
    } catch (error) {
      console.error("Error updating service:", error);
    } 
  };

  return (
    <div className="container">
      <h2 className="mt-4">Update Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="id" className="form-label" >Service ID</label>
          <input
            type="text"
            className="form-control"
            id="id"
            name="id"
            value={formData.serviceId}
          readOnly
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Service Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ManageServicesUpdate;