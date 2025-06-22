import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";

import myprofile from "../assets/images/myprofile.png";
import home from "../assets/images/home.png";
import user from "../assets/images/user.png";
import help from "../assets/images/help.png";
import logout from "../assets/images/logout-.png";

import "../Styles/Landing.css";
import "../Styles/Framework.css";
import Search from '../Routes/Search';

function Landing({ children, showSearch = false, searchData = [], onFilter }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const location = useLocation();
    const isResearchPage = location.pathname === "/research";
    const isTemplatePage = location.pathname === "/template";


    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleNavigate = (path) => {
        if (location.pathname !== path) {
            navigate(path);
        }
        setOpen(false);
    };

    const handleLogout = () => {
        if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate("/");
        }
    };

    return (
        <div className="landing p-relative">
            <div className="overlay p-absolute"></div>
            {!isResearchPage && (
                <div className={`head ${showSearch ? "head-search" : ""} p-relative d-flex-c`}>
                    {!isResearchPage && showSearch && <Search data={searchData} onFilter={onFilter} />}
                    <div className="icons d-flex-c c-pointer p-absolute">

                        {!isTemplatePage && (
                            <img
                                src={myprofile}
                                onClick={() => handleNavigate("/profile")}
                                title="الملف الشخصي"
                                className={`face p-relative d-flex-c b-radius ${showSearch ? "img-search" : ""}`}
                            />
                        )}
                        <div className="menu-container" ref={menuRef}>
                            <div className={`menu-trigger ${open ? "open" : "closed"}`} 
                                onClick={() => setOpen(!open)}>
                            <FontAwesomeIcon icon={faBars} className="menu-icon d-flex-c" />
                            </div>
                            <div className={`dropdown-menu p-absolute ${open ? "open" : "closed"}`}>
                                <h3 className="f20">القائمة</h3>
                                <ul>              
                                    <MenuItem onClick={() => handleNavigate("/")}
                                        img={home} text="الرئيسية" />
                                    <MenuItem onClick={() => handleNavigate("/profile")}
                                        img={user} text="الملف الشخصي" />
                                    <MenuItem onClick={() => handleNavigate("/contact")} 
                                        img={help} text="تواصل معنا" />
                                    <li className="divider"><hr /></li>
                                    <MenuItem onClick={handleLogout} 
                                        img={logout} text="تسجيل الخروج" />
                                </ul>
                            </div>
                        </div>
                        {!showSearch && (
                            <button className="search-btn c-pointer b-radius" 
                                onClick={() => navigate('/research')} title="صفحة البحث">
                            <FontAwesomeIcon icon={faSearch} />
                            </button>
                        )}
                    </div> 
                </div>
            )}
            {children}
        </div>
    );
}

function MenuItem({ onClick, img, text }) {
    return (
        <li className="dropdownItem d-flex align-center" onClick={onClick}>
            <img src={img} alt="" />
            <span className="dropLink"> {text} </span>
        </li>
    );
}

export default Landing;