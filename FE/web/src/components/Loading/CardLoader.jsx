import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './CardLoader.css';

export default function CardLoader({ count = 3 }) {
  return (
    <div className="card-loader-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <Skeleton height={180} />
          <div className="skeleton-card-content">
            <Skeleton height={24} width="70%" />
            <Skeleton count={2} height={16} />
            <Skeleton height={16} width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}