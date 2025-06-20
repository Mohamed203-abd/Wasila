import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Landing      from "../Components/Landing";
import CategoryGrid from "../Components/CategoryGrid";
import Masks        from "../assets/images/Masks.png";
import { apiFetch } from "../api";          

function Categories() {
    const { category } = useParams();           
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();                      
    const entityType = searchParams.get("type");                   

    const [entities, setEntities] = useState([]);
    const [error,    setError   ] = useState("");
    const [loading,  setLoading ] = useState(true);

    const config = useMemo(() => ({
        "internal-entities": {
            endpoint : "/internal_entities/",
            nextPath : (id) => `/departments/${id}`,
        },
        "external-entities": {
            endpoint : "/external_entities/",
            nextPath : (id) => `/departments/${id}`,
        },
    }), []);

    const current = config[category];           

    useEffect(() => {
        (async () => {
        setLoading(true);
        setError("");
        setEntities([]);

        if (!current) {                       
            setError("نوع الجهة غير معروف.");
            setLoading(false);
            return;
        }
        if (!entityType) {                    
            setError("الرجاء اختيار نوع الجهة أولاً.");
            setLoading(false);
            return;
        }

        try {
            let url = `${current.endpoint}?${new URLSearchParams({
            type : entityType,               
            limit: 25,
        })}`;

        const all = [];
        while (url) {
            const data = await apiFetch(url); 
            all.push(...data.results);
            url = data.next
                ? new URL(data.next).pathname + new URL(data.next).search
                : null;
        }

        const mapped = all.map((e) => ({
            id   : e.id,
            name : e.name || "بدون اسم",
            image: Masks,
        }));
        setEntities(mapped);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        })();
    }, [current, entityType]);

    const handleSelect = (item) => {
        navigate(current.nextPath(item.id), {
        state: { entityType, entityId: item.id }, 
        });
    };

    return (
        <Landing>
        {loading ? (
            <p>جارى التحميل…</p>
        ) : error ? (
            <p className="error-message">{error}</p>
        ) : (
            <CategoryGrid items={entities} onSelect={handleSelect} />
        )}
        </Landing>
    );
}

export default Categories;