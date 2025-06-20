import '../Styles/Header.css';
import '../Styles/Framework.css';
import grade from '../assets/images/grade logo.png';
import dam from '../assets/images/dam logo.png';


function Header() {
    return (
            <header className="header p-relative">
                <div className="container flex-between">
                    <img src={dam} alt="University Logo" className="university-logo c-pointer" />
                    <h1 className="title txt-c f32 c-main">الارشيف الالكتروني</h1>
                    <img src={grade} alt="Logo" className="logo c-pointer" />
                </div>
            </header>
    )
}

export default Header;