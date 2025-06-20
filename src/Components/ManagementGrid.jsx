import '../Styles/GridDashboard.css';
import { useNavigate } from 'react-router-dom';

function ManagementGrid({ management = [], onSelect }) {
    const navigate = useNavigate();

    const handleNavigate = (item) => {
        if (onSelect) {
            onSelect(item);
        } else if (item.path) {
            navigate(item.path, {
                state: {
                    documentType: item.docType || item.name 
                }
            });
        }
    };

    return (
        <div className="content p-relative c-pointer d-flex-around wrap">
            {management.map((item) => (
                <div key={item.id} className='card d-flex align-center col' 
                onClick={() => handleNavigate(item)}>
                    <div className="image-wrapper">
                        <img src={item.image} alt={item.name || "entity image"} />
                    </div>
                    <div className="text">
                        <button className="links d-flex-c button">
                            {item.name}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ManagementGrid;