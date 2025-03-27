import React, { useContext, useEffect, useState } from "react";
import "./Login.styles.css";
import { supabase } from "../../Utils/database";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { fetchJobs } from "../../redux/slices/jobSlice";
import { fetchCustomers } from "../../redux/slices/customerSlice";
import { toast } from "react-toastify";
import { LoadingContext } from "../../Context/LoadingContext/LoadingContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const dispatch = useDispatch();
  console.log(supabase)
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
    startLoading();
    await supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then((data) => {
        console.log(data)
        if (data.error) {
          toast("Invalid username/password", {
            position: "bottom-center",
            type: "error",
          });
          stopLoading();
          return;
        }
        dispatch(setUser(data.data.user));
        dispatch(fetchJobs(data.data.user.id));
        dispatch(fetchCustomers(data.data.user.id));
        stopLoading();
      });
  };

  useEffect(() => {
    const get = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session?.user) {
        startLoading();
        const setUserPromise: Promise<void> = new Promise((resolve) => {
          dispatch(setUser(data.session.user));
          resolve();
        });
        const fetchJobsPromise: Promise<void> = new Promise((resolve) => {
          dispatch(fetchJobs(data.session.user.id));
          resolve();
        });
        const fetchCustomersPromise: Promise<void> = new Promise((resolve) => {
          dispatch(fetchCustomers(data.session.user.id));
          resolve();
        });
        // Wait for all promises to complete
        await Promise.all([
          setUserPromise,
          fetchJobsPromise,
          fetchCustomersPromise,
        ]);
        stopLoading();
      }
    };
    get();
  }, []);

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
