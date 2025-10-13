import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getLibrarians = async (token) => {
  const res = await axios.get(`${API_URL}/librarian`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ➕ Thêm mới thủ thư
export const createLibrarian = async (token, data) => {
  const res = await axios.post(`${API_URL}/librarian`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
// 🗑️ Xóa thủ thư
export const deleteLibrarian = async (id, token) => {
  const res = await axios.delete(`${API_URL}/librarian/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✏️ Cập nhật thông tin thủ thư
export const updateLibrarian = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/librarian/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
