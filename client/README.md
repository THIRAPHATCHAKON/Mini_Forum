# 🎨 Web Board Database - Frontend Client

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-blueviolet.svg)](https://getbootstrap.com/)
[![React Router](https://img.shields.io/badge/React%20Router-6.x-red.svg)](https://reactrouter.com/)

## 📋 คำอธิบายโครงการ

แอปพลิเคชัน Frontend สำหรับระบบกระดานสนทนา (Web Board) ที่สร้างด้วย React + Vite พร้อมด้วย UI/UX ที่ทันสมัยและ responsive design รองรับการใช้งานในทุกอุปกรณ์

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบจัดการผู้ใช้
- ✅ หน้าเข้าสู่ระบบ / สมัครสมาชิก
- ✅ การจัดการ Authentication ผ่าน Context API
- ✅ แก้ไขโปรไฟล์และอัพโหลดอวตาร์
- ✅ ระบบลืมรหัสผ่าน
- ✅ ระบบสิทธิ์ (User/Admin)

### 💬 ระบบกระทู้และคอมเมนต์
- ✅ แสดงรายการกระทู้แบบ Real-time
- ✅ ระบบค้นหาแบบ Smart Search (Ctrl+K)
- ✅ กรองตามหมวดหมู่
- ✅ สร้าง/แก้ไข/ลบกระทู้
- ✅ ระบบคอมเมนต์พร้อมการแก้ไข
- ✅ อัพโหลดรูปภาพประกอบ
- ✅ ระบบแท็ก (Tags)

### 📊 ระบบจัดการ (Admin Panel)
- ✅ Dashboard สำหรับ Admin
- ✅ จัดการสิทธิ์ผู้ใช้
- ✅ จัดการหมวดหมู่
- ✅ ดูและจัดการรายงานกระทู้
- ✅ สถิติการใช้งานระบบ

### 🎨 UI/UX Features
- ✅ Responsive Design (Mobile-First)
- ✅ Dark/Light Mode Support
- ✅ Loading States และ Skeleton UI
- ✅ Toast Notifications
- ✅ Image Preview และ Lightbox
- ✅ Infinite Scroll
- ✅ Keyboard Shortcuts

### ⚡ การเพิ่มประสิทธิภาพ
- ✅ Code Splitting และ Lazy Loading
- ✅ React.memo สำหรับ Component Optimization
- ✅ useMemo และ useCallback
- ✅ Image Optimization
- ✅ Bundle Size Optimization

## 🏗️ สถาปัตยกรรม

```
client/
├── public/
│   ├── index.html          # 📄 HTML Template
│   └── meme.jpg           # 🖼️ Static Assets
├── src/
│   ├── App.jsx            # 🚀 Main App Component
│   ├── auth.jsx           # 🔐 Authentication Context
│   ├── main.jsx           # ⚡ App Entry Point
│   ├── App.css            # 🎨 Global Styles
│   ├── index.css          # 🎨 Base Styles
│   ├── assets/
│   │   └── react.svg      # ⚛️ React Logo
│   └── pages/
│       ├── Header.jsx     # 📋 Navigation Header
│       ├── Footer.jsx     # 📋 Page Footer
│       ├── Login.jsx      # 🔐 Login Page
│       ├── Register.jsx   # 📝 Registration Page
│       ├── Thread.jsx     # 💬 Main Thread Page
│       ├── New_Thread.jsx # ✏️ Create Thread Page
│       ├── EditThread.jsx # ✏️ Edit Thread Page
│       ├── EditProfile.jsx # 👤 Profile Edit Page
│       ├── ForgotPassword.jsx # 🔑 Password Reset Page
│       ├── Dashboard.jsx  # 📊 Admin Dashboard
│       ├── ManageRoles.jsx # 👥 User Management
│       ├── ManageCategories.jsx # 📂 Category Management
│       └── ReportList.jsx # 🚨 Report Management
├── package.json           # 📦 Dependencies
├── vite.config.js        # ⚡ Vite Configuration
├── eslint.config.js      # 🔍 ESLint Configuration
└── Dockerfile            # 🐳 Docker Configuration
```

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | วัตถุประสงค์ |
|------------|----------|-------------|
| **React** | ^18.3.1 | UI Library |
| **Vite** | ^6.0.1 | Build Tool & Dev Server |
| **React Router DOM** | ^6.28.0 | Client-side Routing |
| **Bootstrap** | ^5.3.0 | CSS Framework |
| **Bootstrap Icons** | ^1.11.0 | Icon Library |

### 🎨 UI Components & Styling
- **Bootstrap 5** - Modern CSS Framework
- **Bootstrap Icons** - Comprehensive Icon Set
- **Custom CSS** - Enhanced styling และ animations
- **Responsive Grid System** - Mobile-first design

### 🔧 Development Tools
- **ESLint** - Code quality และ consistency
- **Vite HMR** - Hot Module Replacement
- **React DevTools** - Development debugging

## ⚙️ การติดตั้งและเรียกใช้งาน

### 📋 ความต้องการของระบบ
- Node.js 18 หรือสูงกว่า
- npm หรือ yarn
- Backend Server (ดู server/README.md)

### 🚀 ขั้นตอนการติดตั้ง

1. **โคลนโปรเจค**
   ```bash
   git clone <repository-url>
   cd Web_Broad_DataBase/client
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**
   ```bash
   # สร้างไฟล์ .env
   touch .env
   ```
   
   เพิ่มการกำหนดค่าใน `.env`:
   ```env
   # API Backend URL
   VITE_API_URL=http://localhost:3000
   
   # App Configuration
   VITE_APP_NAME=Web Board Database
   VITE_APP_VERSION=1.0.0
   ```

4. **เริ่มต้น Development Server**
   ```bash
   npm run dev
   ```

5. **เปิดในเบราว์เซอร์**
   ```
   http://localhost:5173
   ```

6. **Build สำหรับ Production**
   ```bash
   npm run build
   ```

## 📱 หน้าจอและฟีเจอร์

### 🏠 หน้าหลัก (Thread Page)
**Path:** `/` หรือ `/thread`

**ฟีเจอร์:**
- 📋 แสดงรายการกระทู้ทั้งหมด
- 🔍 ระบบค้นหาแบบ Real-time (Ctrl+K)
- 📂 กรองตามหมวดหมู่
- 💬 แสดงและจัดการคอมเมนต์
- 🖼️ อัพโหลดรูปภาพประกอบคอมเมนต์
- 🚨 ระบบรายงานกระทู้

**UI Components:**
```jsx
// การใช้งานระบบค้นหา
const [searchQuery, setSearchQuery] = useState("");

// Keyboard shortcut (Ctrl+K)
useEffect(() => {
  const handleKeyboard = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      // Focus ช่องค้นหา
    }
  };
}, []);
```

**Sidebar Features:**
- 📅 ปฏิทินแบบ Interactive
- 🔥 กระทู้ยอดฮิต
- 🏷️ หมวดหมู่ยอดนิยม
- ⏰ นาฬิกาแสดงเวลาปัจจุบัน

### 🔐 หน้าเข้าสู่ระบบ (Login Page)
**Path:** `/login`

**ฟีเจอร์:**
- 📧 เข้าสู่ระบบด้วย Username/Email
- 🔒 Password Input พร้อม Toggle Visibility
- 💾 Remember Me Functionality
- 🔄 Loading States
- 🚨 Error Handling

### 📝 หน้าสมัครสมาชิก (Register Page)
**Path:** `/register`

**ฟีเจอร์:**
- 📋 Form Validation แบบ Real-time
- 🔒 Password Confirmation
- 📧 Email Format Validation
- ✅ Success/Error Messages

### ✏️ หน้าสร้างกระทู้ (New Thread Page)
**Path:** `/new-thread`

**ฟีเจอร์:**
- 📝 Rich Text Editor
- 🖼️ Image Upload พร้อม Preview
- 🏷️ Tag System
- 📂 Category Selection
- ➕ สร้างหมวดหมู่ใหม่ (Modal)
- 💾 Auto-save Draft (localStorage)

```jsx
// การจัดการการอัพโหลดรูป
const handleImageUpload = (file) => {
  if (file && file.type.startsWith('image/')) {
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setSelectedFile(file);
  }
};
```

### 👤 หน้าแก้ไขโปรไฟล์ (Edit Profile Page)  
**Path:** `/profile/edit`

**ฟีเจอร์:**
- 🖼️ Avatar Upload พร้อม Crop Tool
- 📝 Bio Editor
- 🔗 Social Media Links
- 🔒 Change Password
- 📊 Account Statistics

### 🔑 หน้ารีเซ็ตรหัสผ่าน (Forgot Password Page)
**Path:** `/forgot-password`

**ฟีเจอร์:**
- 📧 Email Input สำหรับรีเซ็ต
- 🔒 New Password Input
- ✅ Success Message
- 🔄 Loading States

## 👨‍💼 Admin Panel

### 📊 Dashboard (Admin Only)
**Path:** `/admin/dashboard`

**ฟีเจอร์:**
- 📈 สถิติการใช้งาน (Charts)
- 👥 จำนวนผู้ใช้
- 💬 จำนวนกระทู้และคอมเมนต์
- 🚨 รายงานล่าสุด
- 📊 Activity Logs

### 👥 จัดการผู้ใช้ (Manage Roles)
**Path:** `/admin/users`

**ฟีเจอร์:**
- 📋 รายการผู้ใช้ทั้งหมด
- 🔄 เปลี่ยนสิทธิ์ (User/Admin)
- 🔍 ค้นหาผู้ใช้
- 📊 User Statistics

### 📂 จัดการหมวดหมู่ (Manage Categories)
**Path:** `/admin/categories`

**ฟีเจอร์:**
- ➕ เพิ่มหมวดหมู่ใหม่
- ✏️ แก้ไขหมวดหมู่
- 🗑️ ลบหมวดหมู่
- 📊 สถิติกระทู้ในแต่ละหมวดหมู่

### 🚨 จัดการรายงาน (Report Management)
**Path:** `/admin/reports`

**ฟีเจอร์:**
- 📋 รายการรายงานทั้งหมด
- ✏️ แก้ไขเหตุผลการรายงาน
- 🗑️ ลบรายงาน
- 🔍 Debug Mode สำหรับตรวจสอบปัญหา

```jsx
// Debug functionality
const debugInfo = () => {
  console.log('Debug Info:', {
    user,
    apiUrl: API,
    reports,
    loading: pageLoading,
    error
  });
};
```

## 🎨 UI/UX Design System

### 🎨 Color Palette
```css
:root {
  --primary: #0d6efd;      /* Bootstrap Primary Blue */
  --secondary: #6c757d;    /* Bootstrap Secondary Gray */
  --success: #198754;      /* Bootstrap Success Green */
  --danger: #dc3545;       /* Bootstrap Danger Red */
  --warning: #ffc107;      /* Bootstrap Warning Yellow */
  --info: #0dcaf0;         /* Bootstrap Info Cyan */
  --light: #f8f9fa;        /* Bootstrap Light Gray */
  --dark: #212529;         /* Bootstrap Dark Gray */
}
```

### 📱 Responsive Breakpoints
```css
/* Mobile First Approach */
/* xs: <576px */
/* sm: ≥576px */
/* md: ≥768px */
/* lg: ≥992px */
/* xl: ≥1200px */
/* xxl: ≥1400px */
```

### 🎭 Animation & Transitions
```css
/* Loading Animations */
.spinner-border {
  animation: spinner-border 0.75s linear infinite;
}

/* Hover Effects */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Search Highlight */
.search-highlight {
  background-color: yellow;
  font-weight: bold;
  padding: 1px 3px;
  border-radius: 3px;
}
```

## 🔧 Component Architecture

### 🏗️ Component Structure
```
src/pages/
├── Layout Components/
│   ├── Header.jsx         # 📋 Navigation + User Menu
│   └── Footer.jsx         # 📋 Site Information
├── Auth Components/
│   ├── Login.jsx          # 🔐 Login Form
│   ├── Register.jsx       # 📝 Registration Form
│   └── ForgotPassword.jsx # 🔑 Password Reset
├── Thread Components/
│   ├── Thread.jsx         # 💬 Main Thread Display
│   ├── New_Thread.jsx     # ✏️ Thread Creation
│   └── EditThread.jsx     # ✏️ Thread Editing
├── Admin Components/
│   ├── Dashboard.jsx      # 📊 Admin Dashboard
│   ├── ManageRoles.jsx    # 👥 User Management
│   ├── ManageCategories.jsx # 📂 Category Management
│   └── ReportList.jsx     # 🚨 Report Management
└── User Components/
    └── EditProfile.jsx    # 👤 Profile Management
```

### 🎭 Context API Usage
```jsx
// Authentication Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Auto-login from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setReady(true);
  }, []);

  const signIn = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 🛡️ Protected Routes
```jsx
function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  
  if (!ready) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
}

// Admin Only Routes
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
```

## 📡 API Integration

### 🔧 API Service Layer
```jsx
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// API Helper Functions
const apiCall = async (url, options = {}) => {
  const response = await fetch(`${API}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Authentication API
export const authAPI = {
  login: (credentials) => apiCall('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => apiCall('/api/register', {
    method: 'POST', 
    body: JSON.stringify(userData)
  })
};
```

### 🔄 State Management Patterns
```jsx
// Custom Hook สำหรับ Data Fetching
function useThreads(category = null) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const url = category ? `/api/threads?category=${category}` : '/api/threads';
        const data = await apiCall(url);
        setThreads(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [category]);

  return { threads, loading, error, refetch: fetchThreads };
}
```

## 🔍 Search & Filter Features

### 🔍 Smart Search Implementation
```jsx
// Real-time search with debouncing
const [searchQuery, setSearchQuery] = useState("");
const [filteredThreads, setFilteredThreads] = useState([]);

useEffect(() => {
  if (!searchQuery.trim()) {
    setFilteredThreads(threads);
    return;
  }

  const searchTimer = setTimeout(() => {
    const filtered = threads.filter(thread => {
      const searchFields = [
        thread.title,
        thread.body,
        thread.author?.username,
        thread.author?.email,
        thread.tags
      ].join(' ').toLowerCase();
      
      return searchFields.includes(searchQuery.toLowerCase());
    });
    
    setFilteredThreads(filtered);
  }, 300); // 300ms debounce

  return () => clearTimeout(searchTimer);
}, [searchQuery, threads]);
```

### 🎯 Search Highlighting
```jsx
const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 
    'gi'
  );
  
  const parts = text.split(regex);
  
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="search-highlight">
        {part}
      </span>
    ) : part
  );
};
```

## 📱 Responsive Design

### 📐 Mobile-First CSS
```css
/* Base styles for mobile */
.container {
  padding: 1rem;
}

.card {
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
  
  .card {
    margin-bottom: 1.5rem;
  }
}

/* Desktop styles */
@media (min-width: 992px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 📱 Touch-Friendly Interface
- 44px minimum touch targets
- Swipe gestures สำหรับ mobile
- Optimized keyboard navigation
- Screen reader accessibility

## 🚀 Performance Optimization

### ⚡ Code Splitting
```jsx
import { lazy, Suspense } from 'react';

// Lazy load admin components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ManageRoles = lazy(() => import('./pages/ManageRoles'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
      </Routes>
    </Suspense>
  );
}
```

### 🧠 Memoization
```jsx
import { memo, useMemo, useCallback } from 'react';

// Memoized Component
const ThreadCard = memo(({ thread, onDelete }) => {
  const formattedDate = useMemo(() => {
    return new Date(thread.createdAt).toLocaleString('th-TH');
  }, [thread.createdAt]);

  const handleDelete = useCallback(() => {
    onDelete(thread.id);
  }, [thread.id, onDelete]);

  return (
    <div className="card">
      {/* Thread content */}
    </div>
  );
});
```

### 🖼️ Image Optimization
```jsx
// Image with loading states
const OptimizedImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`image-container ${className}`}>
      {!loaded && !error && <ImageSkeleton />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
      {error && <ImageErrorPlaceholder />}
    </div>
  );
};
```

## 🔧 Build Configuration

### ⚡ Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Development server
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  // Build optimization
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### 📦 Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx",
    "lint:fix": "eslint src --ext js,jsx --fix"
  }
}
```

## 🐳 Docker Support

### 📄 Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage  
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 🔧 Nginx Configuration
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🎯 Keyboard Shortcuts

| Shortcut | การทำงาน |
|----------|----------|
| `Ctrl+K` / `Cmd+K` | เปิดช่องค้นหา |
| `Esc` | ล้างการค้นหา / ปิด Modal |
| `Ctrl+Enter` | ส่งคอมเมนต์ (ในช่อง textarea) |
| `Alt+N` | สร้างกระทู้ใหม่ |
| `Alt+H` | กลับไปหน้าหลัก |

```jsx
// Keyboard shortcut implementation
useEffect(() => {
  const handleKeyboard = (e) => {
    // Search shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('.search-input')?.focus();
    }
    
    // Clear search
    if (e.key === 'Escape' && searchQuery) {
      setSearchQuery("");
    }
    
    // New thread
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      navigate('/new-thread');
    }
  };

  document.addEventListener('keydown', handleKeyboard);
  return () => document.removeEventListener('keydown', handleKeyboard);
}, [searchQuery, navigate]);
```

## 🧪 Testing Strategy

### 🔍 Component Testing
```jsx
// Example test with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../auth';
import Login from '../pages/Login';

test('login form submission', async () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);

  // Assert expected behavior
});
```

## 🚨 Error Handling

### 🛡️ Error Boundary
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger text-center">
          <h4>เกิดข้อผิดพลาด</h4>
          <p>กรุณารีเฟรชหน้าเว็บหรือติดต่อผู้ดูแลระบบ</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            รีเฟรชหน้า
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 🔄 API Error Handling
```jsx
const handleApiError = (error) => {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    signOut();
    navigate('/login');
  } else if (error.status === 403) {
    // Forbidden - show access denied
    setError('ไม่มีสิทธิ์เข้าถึง');
  } else if (error.status >= 500) {
    // Server error
    setError('เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ภายหลัง');
  } else {
    // Other errors
    setError(error.message || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
  }
};
```

## 📊 Analytics & Monitoring

### 📈 Performance Monitoring
```jsx
// Performance measurement
const measurePageLoad = () => {
  if ('performance' in window) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  }
};

// Component render tracking
const useRenderTracker = (componentName) => {
  useEffect(() => {
    console.log(`${componentName} rendered`);
  });
};
```

## 🤝 การพัฒนาและการบริจาค

### 📋 Development Guidelines
- ใช้ ESLint สำหรับ code quality
- Comment ด้วยภาษาไทยเพื่อความเข้าใจ
- ใช้ TypeScript สำหรับ type safety (ในอนาคต)
- ทำ responsive design ใน mobile-first approach
- ใช้ semantic HTML และ accessibility best practices

### 🔄 Git Workflow
```bash
# สร้าง feature branch
git checkout -b feature/new-component

# ทำการพัฒนา...

# Commit changes
git add .
git commit -m "feat: add new component with tests"

# Push และสร้าง PR
git push origin feature/new-component
```

## 📞 การติดต่อและการสนับสนุน

- **Repository**: [GitHub Repository](https://github.com/your-repo)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Project Wiki](https://github.com/your-repo/wiki)

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](../LICENSE) file

---

## 🎯 สรุป

Frontend Application นี้เป็น Modern React App ที่มี UX/UI ที่ดีเยิ่ยม พร้อมด้วยฟีเจอร์ครบครันสำหรับระบบกระดานสนทนา รองรับการใช้งานในทุกอุปกรณ์และมีประสิทธิภาพสูง

**สร้างด้วย ❤️ และ ⚛️ React โดยทีมพัฒนา Web Board Database**
