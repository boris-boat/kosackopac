import React, { useEffect, useState } from "react";
import "./Login.styles.css";
import { supabase } from "../../Utils/database";
import { useDispatch } from "react-redux";
import { loginUser, setUser } from "../../redux/slices/userSlice";
import { fetchJobs } from "../../redux/slices/jobSlice";
import { fetchCustomers } from "../../redux/slices/customerSlice";
function Login() {
  // State variables to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((data) => {
        dispatch(setUser(data.data.user));
        dispatch(fetchJobs(data.data.user.id));
        dispatch(fetchCustomers(data.data.user.id));
      });
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Login</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="email"
            value={email}
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
    </div>
  );
}

export default Login;
