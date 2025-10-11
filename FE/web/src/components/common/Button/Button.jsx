import "./Button.css";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  onClick,
  className = "",
  ...props 
}) {
  const btnClass = `btn btn-${variant} btn-${size} ${className}`;
  
  return (
    <button 
      className={btnClass} 
      disabled={disabled} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}