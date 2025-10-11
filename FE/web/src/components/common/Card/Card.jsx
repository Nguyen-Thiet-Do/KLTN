import "./Card.css";

export default function Card({ 
  children, 
  title, 
  className = "",
  ...props 
}) {
  return (
    <div className={`card ${className}`} {...props}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}