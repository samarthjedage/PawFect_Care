import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h2 className="text-primary mb-4">About Pawfect Care</h2>
          <p className="lead">
            Welcome to <strong>Pawfect Care</strong>, your trusted pet grooming center! We provide professional and caring grooming services to keep your furry friends happy and healthy.
          </p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <img src="https://via.placeholder.com/500" alt="Pet Grooming" className="img-fluid rounded" />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <p>
            At <strong>Pawfect Care</strong>, our skilled groomers use the best products and techniques to ensure a comfortable grooming experience for your pets. Whether it's a simple bath, a stylish haircut, or a full grooming session, we tailor our services to your pet's needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
