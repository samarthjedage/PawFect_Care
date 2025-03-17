import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const ManagePets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]); // Initialize pets as an empty array
  const { petId } = useParams(); // Retrieve petId from URL

  const [user, setUser] = useState(null);
  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
  });

  const [editing, setEditing] = useState(false);
  const [editPetId, setEditPetId] = useState(null);

  // Fetch user data and set userId from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObject = JSON.parse(storedUser);
      setUser(userObject);
      fetchPets(userObject.id); // Get pets for this user
    } else {
      navigate("/customer/customerhome"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Fetch pets from API using customer ID
  const fetchPets = async (customerid) => {
    const response = await fetch(`http://localhost:5152/api/Pets/pets/${customerid}`);
    const data = await response.json();
    setPets(Array.isArray(data) ? data : []); // Ensure data is an array
  };

  // Handle input changes for pet form
  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  // Add or update pet
  const handleSubmit = async (e) => {
    e.preventDefault();
    const customerId = user.id;

    const response = editing
      ? await fetch(`http://localhost:5152/api/Pets/${editPetId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...pet, customerId }),
        })
      : await fetch(`http://localhost:5152/api/Pets/Create Pet`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...pet, customerId }),
        });

    if (response.ok) {
      alert(editing ? "Pet updated successfully!" : "Pet added successfully!");
      fetchPets(customerId); // Refresh pets list
      setPet({ name: "", breed: "", age: "" }); // Reset form
      setEditing(false);
      setEditPetId(null);
    } else {
      alert("Error occurred. Please try again.");
    }
  };

  // Edit pet
  const handleEdit = (pet) => {
    setPet({ name: pet.name, breed: pet.breed, age: pet.age });
    setEditing(true);
    setEditPetId(pet.petId);
  };

  // Delete pet
  const handleDelete = async (petId) => {
    const response = await fetch(`http://localhost:5152/api/Pets/${petId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Pet deleted successfully!");
      fetchPets(user.id); // Refresh pets list
    } else {
      alert("Error deleting pet. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Your Pets</h2>

      <div className="row mb-4">
        <div className="col-12 col-md-6 offset-md-3">
          <h3>{editing ? "Edit Pet" : "Add Pet"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Pet Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={pet.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="breed" className="form-label">Breed</label>
              <input
                type="text"
                className="form-control"
                id="breed"
                name="breed"
                value={pet.breed}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                value={pet.age}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {editing ? "Update Pet" : "Add Pet"}
            </button>
          </form>
        </div>
      </div>

      <h3>Your Pets</h3>
      <div className="row">
        {pets.length === 0 ? (
          <p>No pets found. Add a new pet!</p>
        ) : 
        (
          pets.map((pet) => (
            <div key={pet.petId} className="col-12 col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{pet.name}</h5>
                  <p className="card-text">
                    <strong>Breed:</strong> {pet.breed} <br />
                    <strong>Age:</strong> {pet.age} years
                  </p>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(pet)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(pet.petId)}
                  >
                    Delete
                  </button>
                  <button className="btn btn-primary m-2"  onClick={() => navigate(`/customer/bookappointments1/${pet.petId}`)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagePets;
