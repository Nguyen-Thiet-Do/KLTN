import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '72px', margin: 0, color: '#667eea' }}>404</h1>
        <h2 style={{ fontSize: '24px', marginTop: '20px', color: '#333' }}>
          Không Tìm Thấy Trang
        </h2>
        <p style={{ color: '#6b7280', marginTop: '10px' }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
}