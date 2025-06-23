import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "../Components/Landing";
import "../Styles/Template.css";
import { apiFetch } from "../api";
import { getFullFileUrl } from '../utils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Template() {
  const location = useLocation();
  const { entityType, entityId, departmentId, docType } = location.state || {};

  const [docs, setDocs] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

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

      const typeMap = {
        "وارد": "وارد",
        "صادر": "صادر",
      };
      const apiDocType = typeMap[docType] || docType;

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
          url = data.next
            ? new URL(data.next).pathname + new URL(data.next).search
            : null;
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

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortByDate = (list) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.uploaded_at);
      const dateB = new Date(b.uploaded_at);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const docsToShow = sortByDate(filteredDocs.length > 0 ? filteredDocs : docs);

  return (
    <Landing showSearch={true} searchData={docs} onFilter={setFilteredDocs}>
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
                    <td>
                      <button
                        onClick={toggleSortOrder}
                        className="sort-btn c-pointer"
                        title={sortOrder === "asc" ? "ترتيب تصاعدي" : "ترتيب تنازلي"}
                      >
                        <FontAwesomeIcon
                          icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
                        />
                      </button>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {docsToShow.length > 0 ? (
                    docsToShow.map((doc) => {
                      const fullFileUrl = getFullFileUrl(doc.file);
                      console.log("🔗 Full file URL:", fullFileUrl);
                      console.log(doc.file);

                      return (
                        <tr key={doc.id}>
                          <td>{doc.document_number}</td>
                          <td>{new Date(doc.uploaded_at).toLocaleDateString("ar-EG")}</td>
                          <td>{doc.document_type}</td>
                          <td>{doc.entity_type}</td>
                          <td>{doc.title}</td>
                          <td>{doc.notes || "—"}</td>
                          <td>
                            <a
                              href={fullFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="label button align-center txt-c"
                            >
                              فتح
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  ) : (                    <tr>
                      <td colSpan="7">لا توجد مستندات مطابقة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Landing>
  );
}

export default Template;