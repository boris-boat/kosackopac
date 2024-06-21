import React, { useContext } from "react";
import { LoadingContext } from "../../Context/LoadingContext/LoadingContext";
import "./Overlay.styles.css"; // Import your CSS for overlay styling
import { Spinner } from "../Spinner/Spinner";

const Overlay = () => {
  const { loading } = useContext(LoadingContext);
  if (!loading) return null;

  return (
    <div className="overlay">
      <Spinner />
    </div>
  );
};

export default Overlay;
