import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EditProfile() {
  const { user, signIn } = useAuth();           // ข้อมูลผู้ใช้และฟังก์ชันอัปเดต auth
  const navigate = useNavigate();               // สำหรับการนำทางหลังแก้ไขเสร็จ
  const [username, setUsername] = useState("");  // ชื่อผู้ใช้
  const [email, setEmail] = useState("");        // อีเมล
  const [avatar, setAvatar] = useState(null);    // ไฟล์รูปอวตาร์ใหม่
  const [preview, setPreview] = useState(`${API}/static/avatars/default.png`);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [original, setOriginal] = useState({});

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setSocialLink(user.socialLink || "");
      setPreview(user.avatarUrl ? `${API}${user.avatarUrl}` : `${API}/static/avatars/default.png`);
      setOriginal({
        username: user.username || "",
        bio: user.bio || "",
        socialLink: user.socialLink || "",
        avatarUrl: user.avatarUrl || "/static/avatars/default.png"
      });
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      // สร้าง URL สำหรับ preview
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    const isChanged =
      username !== original.username ||
      bio !== original.bio ||
      socialLink !== original.socialLink ||
      avatar !== null;

    if (!isChanged) {
      alert("ไม่มีการเปลี่ยนแปลงข้อมูล");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("socialLink", socialLink);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await fetch(`${API}/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "แก้ไขไม่สำเร็จ");

      signIn({ ...user, ...data.user });
      alert("บันทึกการเปลี่ยนแปลงแล้ว");
      navigate("/thread");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเปลี่ยนรหัสผ่าน
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwLoading) return;
    setPwLoading(true);
    try {
      const res = await fetch(`${API}/api/users/${user.id}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      alert("เปลี่ยนรหัสผ่านสำเร็จ");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
    <Header />
      <div className="container my-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">แก้ไขโปรไฟล์</h3>
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-3">
                <img
                  src={preview}
                  alt="Avatar"
                  className="rounded-circle mb-2"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `${API}/static/avatars/default.png`;
                  }}
                />
                <div>
                  <label className="btn btn-outline-secondary btn-sm">
                    เปลี่ยนรูปโปรไฟล์
                    <input
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">อีเมล</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Social Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={socialLink}
                  onChange={e => setSocialLink(e.target.value)}
                  placeholder="https://twitter.com/yourname"
                />
              </div>

              <button className="btn btn-primary" disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
              </button>
            </form>
            <hr />
            <h5 className="mb-3">เปลี่ยนรหัสผ่าน</h5>
            <form onSubmit={handleChangePassword}>
              <div className="mb-2">
                <label className="form-label">รหัสผ่านเดิม</label>
                <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button className="btn btn-warning" disabled={pwLoading}>
                {pwLoading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}