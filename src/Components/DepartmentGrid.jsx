import '../Styles/Department.css';
import { useNavigate } from 'react-router-dom';

function DepartmentGrid({ items = [], onSelect }) {
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (item.path) {
            navigate(item.path);
        } else if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <div className="type-content p-relative c-pointer d-grid">
            {items.map((item) => (
                <div key={item.id} className='card d-flex align-center col' 
                onClick={() => handleClick(item)}>
                    <div className="image-wrapper">
                        <img className='img' src={item.image} alt={item.name} />
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

export default DepartmentGrid;
