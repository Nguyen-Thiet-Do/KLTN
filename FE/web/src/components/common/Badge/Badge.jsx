import "./Badge.css";

export default function Badge({ 
  children, 
  variant = "primary",
  className = "",
  ...props 
}) {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}