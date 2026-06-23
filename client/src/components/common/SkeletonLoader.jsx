import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 8, type = 'card' }) => {
  if (type === 'detail') {
    return (
      <div className="skeleton-detail-container container animate-shimmer">
        <div className="skeleton-detail-grid">
          <div className="skeleton-detail-img"></div>
          <div className="skeleton-detail-info">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-stars"></div>
            <div className="skeleton-line skeleton-price"></div>
            <div className="skeleton-line skeleton-text-large"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-grid container animate-shimmer">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton-card-img"></div>
          <div className="skeleton-card-info">
            <div className="skeleton-line skeleton-category"></div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-rating"></div>
            <div className="skeleton-card-footer">
              <div className="skeleton-line skeleton-price"></div>
              <div className="skeleton-line skeleton-btn"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
