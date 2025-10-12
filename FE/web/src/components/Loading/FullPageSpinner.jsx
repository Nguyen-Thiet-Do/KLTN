import { BounceLoader } from 'react-spinners';
import './FullPageSpinner.css';

export default function FullPageSpinner({ message = 'Đang xử lý...' }) {
  return (
    <div className="full-page-spinner">
      <div className="spinner-content">
        <BounceLoader color="#667eea" size={80} />
        <p className="spinner-message">{message}</p>
      </div>
    </div>
  );
}