import React from "react";
import "./Loading.css";

const Loading = ({ fullscreen = false, message = "Loading..." }) => {
  return (
    <div className={fullscreen ? "loading-overlay" : "loading-inline"}>
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;
