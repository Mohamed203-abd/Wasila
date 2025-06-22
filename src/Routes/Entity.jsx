import { useNavigate } from 'react-router-dom';
import Landing from '../Components/Landing';
import EntityGrid from '../Components/EntityGrid';

import sideIn from '../assets/images/inside.png';
import sideOut from '../assets/images/outside.png';

const entityItems = [
    { id: 1, name: "داخلية", image: sideIn, path: '/internal-entities', type: 'internal' },
    { id: 2, name: "خارجية", image: sideOut, path: '/external-entities', type: 'external' },
];

function Entity() {

    const navigate = useNavigate();

    const handleSelect = (item) => {
        navigate(`${item.path}?type=${item.type}`);
    }

    return (
        <Landing>
            <EntityGrid entity={entityItems} onSelect={handleSelect} />
            <button
                className="floating-upload-button c-pointer" 
                onClick={() => navigate('/upload')}> 📤 رفع مستند
            </button>
        </Landing>
    );
}

export default Entity;