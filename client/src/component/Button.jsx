import React from "react";

function Button({ children, className, onClick, disabled }) {
  return (
    <div>
      <button
        className={`bg-black text-white py-3 px-6 rounded-lg mt-4 hover:scale-105 transition-transform ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
