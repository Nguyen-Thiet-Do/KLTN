import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ButtonLoader from '../../../components/Loading/ButtonLoader';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Auto redirect nếu đã login
  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = {
        1: '/admin',
        2: '/librarian',
        3: '/reader',
      };
      navigate(routes[user.roleId] || '/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const account = await login(formData.email, formData.password);

      const routes = {
        1: '/admin',
        2: '/librarian',
        3: '/reader',
      };

      navigate(routes[account.roleId] || '/admin');

    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="Logo" />
          <h3>Thư Viện Cộng Đồng KDC Hoàng Mai</h3>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="alert alert-error">
              {apiError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              disabled={isSubmitting}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              disabled={isSubmitting}
              className={errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit"
          >
            {isSubmitting ? (
              <span className="btn-loading">
                <ButtonLoader color="#ffffff" size={8} />
                <span>ĐANG ĐĂNG NHẬP...</span>
              </span>
            ) : (
              'ĐĂNG NHẬP'
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="/forgot-password">Bạn quên mật khẩu?</a>
          <p>
            Chưa có tài khoản?{' '}
            <a href="/signup" className="link-register">
              Đăng ký ngay Mixi
            </a> 
          </p>
        </div>
      </div>
    </div>
  );
}
