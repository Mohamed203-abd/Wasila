import { useNavigate, useLocation } from "react-router-dom";
import Landing from '../Components/Landing';
import ManagementGrid from '../Components/ManagementGrid';

import maskIn from '../assets/images/Maskw.png';
import maskOut from '../assets/images/Masks.png';

const managementItems = [
    { id: 1, name: "وارد",  image: maskIn,  path: "/template", docType: "وارد"  },
    { id: 2, name: "صادر",  image: maskOut, path: "/template", docType: "صادر" },
];

function Management() {

    const navigate  = useNavigate();
    const location  = useLocation();

    const handleSelect = (item) => {
        const { path, docType } = item;
        navigate(path, {
            state: {
                ...location.state,
                docType: docType || item.name   
            }
        });
    };
    return (
        <Landing>
            <ManagementGrid management={managementItems} onSelect={handleSelect} />
        </Landing>
    );
}

export default Management;