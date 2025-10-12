import { ClipLoader } from 'react-spinners';
import './PageLoader.css';

export default function PageLoader({ message = 'Đang tải...', color = '#667eea' }) {
  return (
    <div className="page-loader">
      <div className="loader-content">
        <ClipLoader color={color} size={60} />
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
}