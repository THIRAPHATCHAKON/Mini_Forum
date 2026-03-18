import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");               // อีเมลที่ต้องการยืนยัน
    const [submitting, setSubmitting] = useState(false);  // สถานะการส่งข้อมูล
    const [error, setError] = useState("");               // ข้อความแสดงข้อผิดพลาด
    const navigate = useNavigate();                       // สำหรับ redirect ไปหน้าถัดไป

    async function verifyEmail(e) {
        e.preventDefault();                              // ป้องกันการ refresh หน้า
        if (submitting) return;                          // ป้องกันการส่งซ้ำ
        
        if (!email.trim() || !email.includes("@")) {
            setError("กรุณาใส่อีเมลที่ถูกต้อง");
            return;
        }
        setSubmitting(true);                             // ตั้งสถานะเป็นกำลังส่ง
        setError("");                                    // ล้างข้อความ error
        try {
            const res = await fetch("/api/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email.trim()                  // ตัดช่องว่างหน้า-หลัง
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "ไม่พบอีเมลนี้ในระบบ");
            navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
        } catch (err) {
            setError(err.message || "เกิดข้อผิดพลาดในการยืนยันอีเมล");
        } finally {
            setSubmitting(false);                        // รีเซ็ตสถานะการส่ง
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 col-11 col-sm-8 col-md-5 col-lg-4">
                {/* 📋 Header */}
                <div className="text-center mb-4">
                    <div className="mb-3">
                        <i className="bi bi-key text-primary" style={{fontSize: '3rem'}}></i>
                    </div>
                    <h3>ลืมรหัสผ่าน</h3>
                    <p className="text-muted small">
                        ใส่อีเมลของคุณเพื่อยืนยันตัวตน<br/>
                        เราจะตรวจสอบว่าอีเมลนี้มีในระบบหรือไม่
                    </p>
                </div>

                {/* 📝 Form ยืนยันอีเมล */}
                <form onSubmit={verifyEmail}>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="email">
                            <i className="bi bi-envelope me-2"></i>
                            อีเมลของคุณ
                        </label>
                        <input
                            type="email"
                            className={`form-control ${error ? 'is-invalid' : ''}`}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                            autoComplete="email"
                            disabled={submitting}
                            autoFocus
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={submitting}>
                        {submitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                กำลังตรวจสอบ...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-search me-2"></i>
                                ยืนยันอีเมล
                            </>
                        )}
                    </button>
                </form>

                {/* 🔗 ลิงก์กลับ */}
                <div className="text-center">
                    <small>
                        จำรหัสผ่านได้แล้ว? 
                        <Link to="/login" className="text-decoration-none ms-1">
                            <i className="bi bi-arrow-left me-1"></i>
                            กลับไปเข้าสู่ระบบ
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
