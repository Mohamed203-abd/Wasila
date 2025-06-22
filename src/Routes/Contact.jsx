import Landing from "../Components/Landing";
import "../Styles/Contact.css";

function Contact() {
    return (
        <Landing>
            <div className="contact-container p-relative">
                <h1>تواصل معنا</h1>
                <p>إذا كان لديك أي استفسار أو ملاحظات، لا تتردد في التواصل معنا.</p>
            </div>
        </Landing>
    );
}

export default Contact;
