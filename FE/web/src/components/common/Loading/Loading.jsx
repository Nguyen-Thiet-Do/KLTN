import "./Loading.css";

export default function Loading({ fullScreen = false }) {
  const loadingClass = fullScreen ? "loading-fullscreen" : "loading";
  
  return (
    <div className={loadingClass}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}