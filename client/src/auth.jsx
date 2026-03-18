import { createContext, useContext, useEffect, useState } from "react";

// สร้าง Context สำหรับแชร์ข้อมูลการเข้าสู่ระบบ
const AuthContext = createContext();

// AuthProvider - Component ที่ห้อหุ้มแอปทั้งหมดเพื่อให้เข้าถึง auth state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        
  const [ready, setReady] = useState(false);     

  // เมื่อ component mount, ตรวจสอบ localStorage ว่ามีข้อมูลการเข้าสู่ระบบหรือไม่
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");   
      if (raw) setUser(JSON.parse(raw));          
    } finally {
      setReady(true);                             
    }
  }, []);

  // ฟังก์ชันเข้าสู่ระบบ - เก็บข้อมูลใน localStorage และ state
  const signIn = (u) => { 
    localStorage.setItem("user", JSON.stringify(u)); 
    setUser(u); 
  };
  
  // ฟังก์ชันออกจากระบบ - ลบข้อมูลจาก localStorage และ state
  const signOut = () => { 
    localStorage.removeItem("user"); 
    setUser(null); 
  };

  // ส่งข้อมูลและฟังก์ชันให้ component ลูกใช้งาน
  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook สำหรับเข้าถึง AuthContext อย่างง่ายดาย
export const useAuth = () => useContext(AuthContext);
