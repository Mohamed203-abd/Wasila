// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Landing from "../Components/Landing";
// import "../Styles/Template.css";
// import { apiFetch } from "../api";

// function Template() {
//     const location = useLocation();
//     const {
//         entityType,
//         entityId,
//         departmentId,
//         docType
//     } = location.state || {};

//     const [docs, setDocs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [selectedFile, setSelectedFile] = useState(null);
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         if (!entityType || !entityId || !departmentId || !docType) {
//             setError("البيانات غير مكتملة. تأكد من اختيار جميع الحقول.");
//             setLoading(false);
//             return;
//         }

//         const fetchDocs = async () => {
//             const token = localStorage.getItem("accessToken");
//             if (!token) {
//                 setError("من فضلك سجل الدخول");
//                 setLoading(false);
//                 return;
//             }

//             const typeMap = {
//                 "وارد": "وارد",
//                 "صادر": "صادر"
//             };
//             const apiDocType = typeMap[docType] || docType;

//             const params = new URLSearchParams({
//                 limit: 100,
//                 document_type: apiDocType
//             });

//             if (entityType === "internal") {
//                 params.append("internal_entity", entityId);
//                 params.append("internal_department", departmentId);
//             } else {
//                 params.append("external_entity", entityId);
//                 params.append("external_department", departmentId);
//             }

//             let url = `/documents/?${params.toString()}`;
//             let allResults = [];

//             try {
//                 while (url) {
//                     const data = await apiFetch(url);
//                     allResults = [...allResults, ...data.results];
//                     url = data.next
//                         ? new URL(data.next).pathname + new URL(data.next).search
//                         : null;
//                 }

//                 setDocs(allResults);
//             } catch (err) {
//                 setError(err.message || "حدث خطأ أثناء تحميل المستندات");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDocs();
//     }, [entityType, entityId, departmentId, docType]);

//     return (
//         <Landing showSearch={true}>
//             <div className='container p-relative'>
//                 <div className='projects p-top'>
//                     {loading ? (
//                         <p>جارٍ التحميل...</p>
//                     ) : error ? (
//                         <p className="error-message">{error}</p>
//                     ) : (
//                         <div className='main-table'>
//                             <table className='table txt-c f20'>
//                                 <thead>
//                                     <tr>
//                                         <td>الرقم</td>
//                                         <td>التاريخ</td>
//                                         <td>النوع</td>
//                                         <td>الجهة</td>
//                                         <td>اسم المستند</td>
//                                         <td>الملاحظات</td>
//                                         <td></td>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {docs.map((doc) => (
//                                         <tr key={doc.id}>
//                                             <td>{doc.document_number}</td>
//                                             <td>{new Date(doc.uploaded_at).toLocaleDateString('ar-EG')}</td>
//                                             <td>{doc.document_type}</td>
//                                             <td>{doc.entity_type}</td>
//                                             <td>{doc.title}</td>
//                                             <td>{doc.notes || "—"}</td>
//                                             <td>
//                                                 <button
//                                                     className="label button"
//                                                     onClick={() => {
//                                                         setSelectedFile(doc.file);
//                                                         setShowModal(true);
//                                                     }}
//                                                 >
//                                                     فتح
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//             {showModal && selectedFile && (
//                 <div className="modal-overlay" onClick={() => setShowModal(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <button className="close-button" onClick={() => setShowModal(false)}>×</button>
//                         <iframe
//                             src={selectedFile}
//                             title="Preview Document"
//                             width="100%"
//                             height="600px"
//                             style={{ border: "none" }}
//                         />
//                     </div>
//                 </div>
//             )}
//         </Landing>
//     );
// }

// export default Template;

// Template.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "../Components/Landing";
import "../Styles/Template.css";
import { apiFetch } from "../api";

/*---------------------------------------------
----------------------------------------------*/

// ‑ مسار الخادم فى الإنتاج / التطوير لضمّه قبل أى رابط نسبى
const BASE_MEDIA =
  import.meta.env.PROD
    ? "https://archievesystem-production.up.railway.app"
    : "http://localhost:8000"; // غيّره إذا كان باك‑إندك يعمل على بورت مختلف

// يكمّل الرابط إذا كان نسبيًّا
const makeAbsolute = (url) =>
  url && !url.startsWith("http") ? `${BASE_MEDIA}${url}` : url;

// يتحقّق بسرعة من أن الرابط http/https
const isValidHttpUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/*---------------------------------------------
  المكوّن الرئيسى
----------------------------------------------*/
function Template() {
  const { state } = useLocation();
  const { entityType, entityId, departmentId, docType } = state || {};

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /*-------------------------------------------
      جلب المستندات
  -------------------------------------------*/
  useEffect(() => {
    if (!entityType || !entityId || !departmentId || !docType) {
      setError("البيانات غير مكتملة. تأكد من اختيار جميع الحقول.");
      setLoading(false);
      return;
    }

    const fetchDocs = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("من فضلك سجل الدخول");
        setLoading(false);
        return;
      }

      const apiDocType = docType; // لو احتجت تحويل اكتب خريطة هنا

      const params = new URLSearchParams({
        limit: 100,
        document_type: apiDocType,
      });

      if (entityType === "internal") {
        params.append("internal_entity", entityId);
        params.append("internal_department", departmentId);
      } else {
        params.append("external_entity", entityId);
        params.append("external_department", departmentId);
      }

      let url = `/documents/?${params.toString()}`;
      let allResults = [];

      try {
        while (url) {
          const data = await apiFetch(url);
          allResults = [...allResults, ...data.results];
          url = data.next ? new URL(data.next).pathname + new URL(data.next).search : null;
        }
        setDocs(allResults);
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل المستندات");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [entityType, entityId, departmentId, docType]);

  /*-------------------------------------------
      فتح المستند
  -------------------------------------------*/
  const handleOpen = (fileUrl) => {
    const full = makeAbsolute(fileUrl);
    if (isValidHttpUrl(full)) {
      setSelectedFile(full);
      setShowModal(true);
    } else {
      setError("الرابط غير صالح للعرض");
    }
  };

  /*-------------------------------------------
      JSX
  -------------------------------------------*/
  return (
    <Landing showSearch={true}>
      <div className="container p-relative">
        <div className="projects p-top">
          {loading ? (
            <p>جارٍ التحميل...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="main-table">
              <table className="table txt-c f20">
                <thead>
                  <tr>
                    <td>الرقم</td>
                    <td>التاريخ</td>
                    <td>النوع</td>
                    <td>الجهة</td>
                    <td>اسم المستند</td>
                    <td>الملاحظات</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.document_number}</td>
                      <td>{new Date(doc.uploaded_at).toLocaleDateString("ar-EG")}</td>
                      <td>{doc.document_type}</td>
                      <td>{doc.entity_type}</td>
                      <td>{doc.title}</td>
                      <td>{doc.notes || "—"}</td>
                      <td>
                        <button className="label button" onClick={() => handleOpen(doc.file)}>
                          فتح
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedFile && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowModal(false)}>
              ×
            </button>
            <iframe
              src={selectedFile}
              title="Preview Document"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </Landing>
  );
}

export default Template;

