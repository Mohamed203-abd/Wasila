import { useNavigate } from 'react-router-dom';
import '../Styles/GridDashboard.css';

function EntityGrid({ entity = [], onSelect }) {
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (onSelect) {
            onSelect(item);
        } else if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <div className="content p-relative c-pointer d-flex-around wrap">
            {entity.map((item) => (
                <div key={item.id} className='card d-flex align-center col' 
                onClick={() => handleClick(item)}>
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

export default EntityGrid;