import React, { useState } from "react";
import "./Login.styles.css";
function Login() {
  // State variables to store user input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Simulate login logic (replace with your actual authentication)
    if (username === "admin" && password === "password123") {
      setErrorMessage("");
      // Handle successful login (redirect, etc.)
      console.log("Login successful!");
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <div className="button-wrapper">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
