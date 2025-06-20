import LoginForm from "../Components/LoginForm";
import "../Styles/Login.css";  
import '../Styles/Landing.css';
import '../Styles/Framework.css';

function Login({ setIsAuthenticated }) {
    return (
        <div className="login-landing p-relative">
            <div className="overlay p-absolute"></div>
            <LoginForm setIsAuthenticated={setIsAuthenticated} />
        </div>
    );
}

export default Login;