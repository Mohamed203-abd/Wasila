import '../Styles/Profile.css';
import myprofile from '../assets/images/myprofile.png';
import { useNavigate } from 'react-router-dom';
import Landing from '../Components/Landing';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("لا يوجد توكن. الرجاء تسجيل الدخول.");
        return;
      }

        try {
        const data  = await apiFetch("auth/users/me/", {
          method: "GET",
        });

        setUser(data);

      } catch (error) {
        console.error("User fetch error:", error);
        let message = error.message;
        if (message.includes("NetworkError") || message === "Failed to fetch") {
          message = "تعذر الوصول إلى الخادم. تحقق من الاتصال.";
        }
        setError(message || "حدث خطأ أثناء تحميل البيانات.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <Landing>
      <div className='container-profile p-relative'>
        <section className="profile">
          <h2 className='profile-title'>الملف الشخصي</h2>

          {error && <p className="error-message">{error}</p>}

          {user ? (
            <div className="profile-card d-flex align-center">
              <img src={myprofile} alt="Face" className="face b-radius c-pointer" />
              <h3>{user.username || user.name || "بدون اسم"}</h3>
              <span>{user.role || "مستخدم"}</span>
            </div>
          ) : (
            !error && <p>جاري تحميل البيانات...</p>
          )}
        </section>

        {user && (
          <section className="info">
            <h2 className='info-title'>المعلومات الشخصية</h2>
            <div className="info-card d-flex wrap">
              <div className='info-item'>
                <label>الاسم</label>
                <p>{user.username || "-"}</p>
              </div>
              <div className='info-item'>
                <label>البريد الإلكتروني</label>
                <p>{user.email || "-"}</p>
              </div>
            </div>
          </section>
        )}
        <div className="profile-logout d-flex-c">
          <button className='links button' onClick={handleLogout}>تسجيل خروج</button>
        </div>
      </div>
    </Landing>
  );
}

export default Profile;