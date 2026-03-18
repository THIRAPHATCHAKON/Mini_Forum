import { useEffect, useState } from "react";
import { useAuth } from "../auth.jsx";
import Header from "./Header";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ManageRoles() {
  const { user } = useAuth();                    // ข้อมูลผู้ใช้ปัจจุบัน (ต้องเป็น admin)
  const [users, setUsers] = useState([]);       // รายการผู้ใช้ทั้งหมดในระบบ

  useEffect(() => {
    fetch(`${API}/api/users`, {
      headers: { "Authorization": `Bearer ${user.token}` }  // ส่ง token สำหรับตรวจสอบสิทธิ์ admin
    })
      .then(res => res.json())                              // แปลง response เป็น JSON
      .then(data => setUsers(data.users || []));           // เก็บรายการผู้ใช้ (fallback เป็น array ว่าง)
  }, []);

  const changeRole = async (id, newRole) => {
    const res = await fetch(`${API}/api/users/${id}/role`, {
      method: "PATCH",                                      // ใช้ PATCH เพื่ออัปเดตข้อมูลบางส่วน
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`             // ต้องมี token admin เท่านั้น
      },
      body: JSON.stringify({ role: newRole })               // ส่ง role ใหม่
    });
    
    if (res.ok) {
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } else {
      alert("เปลี่ยนสิทธิ์ไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  return (
    <>
    <Header />
        <div className="container py-4">
      <h3>เปลี่ยน Role User</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>เปลี่ยน Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => changeRole(u.id, e.target.value)}
                  className="form-select form-select-sm"
                  style={{ width: 120 }}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}