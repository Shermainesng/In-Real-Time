import React from "react";
import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div>
      <div className="overlay">
        <div className="spinner-container">
          <div className="border-t-4 border-pink border-solid rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
