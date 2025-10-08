import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đăng nhập: ${form.username}`);
  };

  return (
  <div className="login-page">
    <div className="login-card">
      <div className="login-logo">
        <img src="/logo.png" alt="Logo" />
        <h3>Thư Viện Cộng Đồng KDC Hoàng Mai</h3>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>Tên đăng nhập</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Nhập tên đăng nhập"
        />

        <label>Mật khẩu</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Nhập mật khẩu"
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
