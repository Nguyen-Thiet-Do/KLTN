import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './TableLoader.css';

export default function TableLoader({ rows = 5, columns = 4 }) {
  return (
    <div className="table-loader">
      <div className="table-container">
        {/* Header */}
        <div className="skeleton-row skeleton-header">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton-cell">
              <Skeleton height={30} />
            </div>
          ))}
        </div>
        
        {/* Body */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton-row">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="skeleton-cell">
                <Skeleton height={40} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}