import React from "react";
import Pet1 from "../assets/hero-pets.jpg";
import Pet2 from "../assets/hero-pets-2.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap is imported

const Customerhome = () => {
  return (
    <div className="container-fluid hero-section py-5">
      <div className="row align-items-start">
        
        <div className="d-flex justify-content-evenly">
          {/* Left side with cat image */}
          <div className="text-center">
            <img
              src={Pet2}
              alt="Cute Cat"
              className="img-fluid align-self-start"
              style={{ width: "250px", objectFit: "contain" }}
            />
          </div>

          {/* Right side with dog image */}
          <div className="text-center">
            <img
              src={Pet1}
              alt="Cute Dog"
              className="img-fluid align-self-start"
              style={{ width: "400px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Centered text and paragraph */}
        <div className="text-center mt-4">
          <h2 className="hero-heading mb-4">Pawfect Care Grooming</h2>
          <p className="fs-6">
            At Pawfect Care Grooming, we provide top-notch grooming services for all types of pets! 
            From cats to dogs, rabbits to birds, we ensure your furry (or feathery) friends leave feeling 
            clean, pampered, and happy. Our professional groomers offer everything from haircuts and baths 
            to nail trimming and teeth cleaning. Let us give your pet the care they deserve in a safe and loving environment!
          </p>
        </div>

      </div>
    </div>
  );
};

export default Customerhome;
