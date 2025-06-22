import { useState, useEffect } from "react";
import "../Styles/Upload.css";
import uploadImg from "../assets/images/upload-demo.jpg";
import { apiFetch } from "../api";

function ArchiveUpload() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName]   = useState("— لم يتم اختيار ملف —");
    const [title, setTitle] = useState("");
    const [docNumber, setDocNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [docType, setDocType] = useState(""); 
    const [entityType, setEntityType] = useState("");
    const [entityOptions, setEntityOptions] = useState([]);
    const [entityId, setEntityId] = useState("");
    const [deptOptions, setDeptOptions] = useState([]);
    const [deptId, setDeptId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const resetForm = () => {
    setFile(null);
    setFileName("— لم يتم اختيار ملف —");
    setTitle("");
    setDocNumber("");
    setNotes("");
    setDocType("");
    setEntityType("");
    setEntityId("");
    setDeptId("");
    setEntityOptions([]);
    setDeptOptions([]);
};


    useEffect(() => {
        if (!entityType) {
            setEntityOptions([]);
            return;
        }

        const endpoint = entityType === "جهة داخلية"
            ? "/internal_entities/?limit=100"
            : "/external_entities/?limit=100";

        (async () => {
            try {
                const data = await apiFetch(endpoint);
                setEntityOptions(data.results);
            } catch {
                setError("فشل جلب الجهات");
            }
        })();
    }, [entityType]);

    useEffect(() => {
        if (!entityId) {
            setDeptOptions([]);
            return;
        }

        const endpoint = entityType === "جهة داخلية"
            ? `/internal_departments/?internal_entity=${entityId}&limit=100`
            : `/external_departments/?external_entity=${entityId}&limit=100`;

        (async () => {
            try {
                const data = await apiFetch(endpoint);
                setDeptOptions(data.results);
            } catch {
                setError("فشل جلب الأقسام");
            }
        })();
    }, [entityType, entityId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!file || !entityType || !entityId || !deptId || !docType) {
        setError("يجب اختيار ملف وجميع الحقول المطلوبة.");
        return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("document_number", docNumber);
        formData.append("notes", notes);
        formData.append("document_type", docType);
        formData.append("entity_type", entityType);

        if (entityType === "جهة داخلية") {
            formData.append("internal_entity", entityId);
            formData.append("internal_department", deptId);
        } else {
            formData.append("external_entity", entityId);
            formData.append("external_department", deptId);
        }

        try {
            setLoading(true);
            await apiFetch("/documents/", { method: "POST", body: formData });
            setSuccess("تم رفع المستند بنجاح!");
            resetForm();
        } catch (err) {
            setError(err.message || "فشل رفع المستند");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="upload-content p-relative d-flex" onSubmit={handleSubmit}>
            <div className="upload-details-form d-flex col">
                <div className="upload-field">
                    <label className="upload-label">الملف</label>
                    <div className="file-btn-wrapper d-flex align-center p-relative txt-c">
                        <button type="button" className="btn-file c-pointer"
                            onClick={() => document.getElementById("file-input").click()} >
                            اختر ملف
                        </button>
                        <span className="file-name">{fileName}</span>   
                        <input id="file-input" type="file"
                            onChange={(e) => {
                                const f = e.target.files[0] || null;
                                setFile(f);
                                setFileName(f ? f.name : "— لم يتم اختيار ملف —");
                            }} />
                    </div>
                </div>

                <TextInput lbl="اسم الملف" value={title} set={setTitle} />
                <TextInput lbl="رقم الملف" value={docNumber} set={setDocNumber} />
        
                <SelectInput lbl="النوع" value={docType} set={setDocType}
                    options={[
                        { value: "وارد", text: "وارد" },
                        { value: "صادر", text: "صادر" },
                    ]} />

                <SelectInput lbl="نوع الجهة" value={entityType} set={setEntityType}
                    options={[
                        { value: "جهة داخلية", text: "جهة داخلية" },
                        { value: "جهة خارجية", text: "جهة خارجية" },
                    ]} />

                {entityType && (
                    <SelectInput
                        lbl={entityType === "جهة داخلية" ? "الجهة (داخلية)" : "الجهة (خارجية)"}
                        value={entityId} set={setEntityId}
                        options={entityOptions.map((e) => ({
                            value: e.id, text: e.name, }))}
                        disabled={!entityType} />
                )}

                {entityType && entityId && (
                    <SelectInput
                        lbl={entityType === "جهة داخلية" ? "القسم (داخلي)" : "القسم (خارجي)"}
                        value={deptId} set={setDeptId}
                        options={deptOptions.map((d) => ({
                            value: d.id, text: d.name, }))}
                        disabled={!entityId} />
                )}

                <TextInput lbl="ملاحظات" value={notes} set={setNotes} />

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>

            <div className="card d-flex align-center col ">
                <div className="image-wrapper">
                    <img src={uploadImg} alt="Upload preview" className="upload-image c-pointer" />
                </div>

                <div className="text">
                        <button className="links d-flex-c button" disabled={loading}>
                            {loading ? "جارى الرفع..." : "رفع الملف"}
                        </button>
                    </div>
            </div>
        </form>
    );
}

const TextInput = ({ lbl, value, set }) => (
    <div className="upload-field">
        <label className="upload-label">{lbl}</label>
        <input type="text" className="upload-input" value={value}
            onChange={(e) => set(e.target.value)} />
    </div>
);

const SelectInput = ({ lbl, value, set, options = [], disabled }) => (
    <div className="upload-field">
        <label className="upload-label">{lbl}</label>
        <select className="upload-select" value={value}
            onChange={(e) => set(e.target.value)} disabled={disabled} >

            <option value="">— اختر —</option>
            {options.map((opt, i) =>
            typeof opt === "string" ? (
                <option key={i} value={opt}>
                    {opt}
                </option>
                ) : (
                <option key={opt.value} value={opt.value}>
                    {opt.text}
                </option>
                )
            )}
        </select>
    </div>
);

export default ArchiveUpload;