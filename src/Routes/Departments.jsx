import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Landing from "../Components/Landing";
import DepartmentGrid from "../Components/DepartmentGrid";
import Masks from "../assets/images/Masks.png";
import { apiFetch } from "../api";

function Departments() {
    const { id } = useParams(); // entityId
    const navigate = useNavigate();
    const location = useLocation();

    const { entityType } = location.state || {};

    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const config = useMemo(() => ({
        internal: {
            endpoint: "/internal_departments/",
            queryKey: "internal_entity"
        },
        external: {
            endpoint: "/external_departments/",
            queryKey: "external_entity"
        }
    }), []);

    const current = config[entityType];

    useEffect(() => {
        const fetchAllPages = async () => {
            setLoading(true);
            setError("");
            setDepartments([]);

            if (!current) {
                setError("نوع الجهة غير معروف.");
                setLoading(false);
                return;
            }

            let url = `${current.endpoint}?${new URLSearchParams({
                [current.queryKey]: id,
                limit: 20
            })}`;

            let allResults = [];

            try {
                while (url) {
                    const data = await apiFetch(url);
                    allResults = [...allResults, ...data.results];
                    url = data.next
                        ? new URL(data.next).pathname + new URL(data.next).search
                        : null;
                }

                const formatted = allResults.map((item) => ({
                    id: item.id,
                    name: item.name || "بدون اسم",
                    image: Masks
                }));

                setDepartments(formatted);
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllPages();
    }, [id, current]);

    const handleSelect = (item) => {
        navigate("/management", {
            state: {
                entityType,
                entityId: Number(id),
                departmentId: item.id
            }
        });
    };

    return (
        <Landing>
            {loading ? (
                <p>جارى التحميل…</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <DepartmentGrid items={departments} onSelect={handleSelect} />
            )}
        </Landing>
    );
}

export default Departments;
