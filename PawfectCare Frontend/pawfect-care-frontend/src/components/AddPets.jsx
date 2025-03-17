import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPets = () => {
  const navigate = useNavigate();
  
  // Initialize state for pet details
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = localStorage.getItem("id"); // Retrieve customer ID from localStorage

    if (!customerId) {
      alert("Please log in first.");
      return;
    }

    const petData = {
      ...pet,
      customerId: parseInt(customerId), // Assign customer ID from localStorage
      createdAt: new Date(), // Set created date to current time
    };

    // Send POST request to backend API
    const response = await fetch("http://localhost:5021/api/Customer/CreatePet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petData),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Pet added successfully!");
      navigate("/customer/pets"); // Redirect after successful creation
    } else {
      alert("Failed to add pet. Try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">Add Pet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Pet Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={pet.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Breed</label>
            <input
              type="text"
              className="form-control"
              name="breed"
              value={pet.breed}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              name="age"
              value={pet.age}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPets;
