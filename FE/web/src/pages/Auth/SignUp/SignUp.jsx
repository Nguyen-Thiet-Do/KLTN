import { useState } from "react";
import "./SignUp.css";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMsg("Mật khẩu không khớp");
      return;
    }
    setMsg("Đăng ký thành công (demo)");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-logo">
          <img src="/logo.png" alt="Logo" />
          <h3>Tạo tài khoản mới</h3>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Họ và tên</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />

          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
          />

          <button type="submit">ĐĂNG KÝ</button>
          <p className="msg">{msg}</p>
        </form>

        <p className="signup-footer">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
