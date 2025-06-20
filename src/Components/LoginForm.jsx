import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/LoginForm.css";
import login from "../assets/images/login.png";
import { apiFetch } from '../api';

function LoginForm({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/entity", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password.trim()) {
    setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
    return;
  }

  setLoading(true);

  const data = {
    email: email,
    password: password,
  };

  try {
    const result  = await apiFetch('/auth/jwt/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    localStorage.setItem("accessToken", result.access);
    localStorage.setItem("refreshToken", result.refresh);

    setIsAuthenticated(true);
    setEmail("");
    setPassword("");
    navigate("/entity");
  } catch (error) {
      console.error("Login error:", error);
      let message = error.message;
      if (message.includes("No active account")) {
        message = "الحساب غير موجود أو البيانات غير صحيحة.";
      } else if (message.includes("NetworkError")) {
        message = "فشل الاتصال بالخادم. تأكد من اتصال الإنترنت.";
      } else if (message === "Failed to fetch") {
        message = "تعذر الوصول إلى الخادم. حاول مرة أخرى لاحقًا.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container p-relative flex-between">
      <div className="login-form-wrapper">
        <form onSubmit={handleLogin} className="login-form d-flex col">
          <h3 className="login-title f32">تسجيل الدخول</h3>
          {error && <p className="error-login">{error}</p>}
          <div className="form-group d-flex col">
            <label className="form-label f20">البريد الإلكتروني</label>
            <input type="email" value={email} placeholder="ادخل بريدك الالكتروني"
              className="form-input" onChange={(e) => setEmail(e.target.value)}
              autoComplete="username" disabled={loading}/>
          </div>
          <div className="form-group d-flex col">
            <label className="form-label f20">كلمة المرور</label>
            <input type="password" value={password} placeholder="ادخل كلمة المرور الخاصة بك"
              className="form-input" onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password" disabled={loading}/>
          </div>
          <button type="submit" className="submit-button button" disabled={loading}>
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
      <div className="login-image-wrapper">
        <img src={login} alt="Login" className="login-image" />
      </div>
    </div>
  );
}

export default LoginForm;