import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';
const ApiUrl="http://localhost:5152/api/Services";

const ManageServicesAdd = () => {
  
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
  const response= await axios.post(ApiUrl,formData)  
  console.log("Service added",response.data);
  
  alert("Service added successfully ! ");
  
  setFormData({
    name:'',
    description:'',
    price:''
  });
  navigate("/admin/manageservices");
    }
    catch(error)
    {console.error("error in adding service : ",error);
      alert("Failed to add service");

    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Add Service</h2>
      <form onSubmit={handleSubmit}>
       
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

export default ManageServicesAdd;