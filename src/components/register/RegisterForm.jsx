import React, { useState } from "react";
import "./Registerform.css";

import { useRegister } from "../../hooks/useRegister";

const RegisterForm = () => {
  const { mutate: registerUser, isLoading } = useRegister();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "", // ✅ ADDED
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    registerUser(formData, {
      onSuccess: () => {
        alert("Registration successful!");
        window.location.href = "/login";
      },
      onError: (err) => {
        alert(
          err?.response?.data
            ? JSON.stringify(err.response.data)
            : "Registration failed"
        );
      },
    });
  };

  return (
    <div className="hero">
      <div className="overlay"></div>

      <div className="left-text">
        <img src="images/Logo-Color.png" alt="MyNeuron Logo" className="logo" />
        <h1>Revolutionizing Health Science Connections</h1>
        <p>
          Connecting brilliant minds to advance healthtech research and
          solutions.
        </p>
      </div>

      <div className="form-box">
        <h2>Registration</h2>

        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="form-group">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Middle Name */}
          <div className="form-group">
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name (optional)"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Terms */}
          <div className="checkbox">
            <input type="checkbox" required />
            <label>
              By creating an account, I agree to the{" "}
              <a href="#">Terms of Use</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" className="btn3" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
