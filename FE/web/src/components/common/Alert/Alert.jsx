import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./Alert.css";

export default function Alert({ 
  type = "info", 
  message, 
  onClose,
  autoClose = true,
  duration = 5000 
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  // Auto close
  if (autoClose) {
    setTimeout(handleClose, duration);
  }

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">{message}</div>
      <button className="alert-close" onClick={handleClose}>
        <FaTimes />
      </button>
    </div>
  );
}