// src/pages/Auth/Login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập
      const res = await axios.post("http://localhost:8080/api/auth/login", form);

      console.log("Kết quả trả về từ backend:", res.data);

      // Kiểm tra phản hồi hợp lệ
      const { success, data } = res.data;
      if (!success || !data || !data.account) {
        alert("Đăng nhập thất bại. Kiểm tra lại email hoặc mật khẩu.");
        return;
      }

      const { accessToken, refreshToken, account } = data;

      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(account));

      // Điều hướng dựa theo vai trò người dùng
      switch (account.roleId) {
        case 1:
          navigate("/admin");
          break;
        case 2:
          navigate("/librarian");
          break;
        case 3:
          navigate("/reader");
          break;
        default:
          alert("Không xác định vai trò người dùng.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert("Đăng nhập thất bại. Kiểm tra lại email hoặc mật khẩu.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="Logo" />
          <h3>Thư Viện Cộng Đồng KDC Hoàng Mai</h3>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email đăng nhập"
            required
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            required
          />

          <button type="submit">ĐĂNG NHẬP</button>
        </form>

        <div className="login-footer">
          <a href="#">Bạn quên mật khẩu?</a>
          <p>
            Chưa có tài khoản?{" "}
            <a href="/signup" className="link-register">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
