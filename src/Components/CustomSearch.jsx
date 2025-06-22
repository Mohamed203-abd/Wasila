import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt }       from '@fortawesome/free-solid-svg-icons';
import { apiFetch }        from '../api';

async function run({ query, filters, searchField,
                    setLoading, setError, setResults }) {

  if (!filters) {
    setError('يجب تطبيق الفلاتر أولًا قبل البحث المخصَّص.');
    setResults([]); return;
  }
  if (!query.trim()) {
    setError('يرجى إدخال نص للبحث.');
    setResults([]); return;
  }

  try {
    setError(''); setLoading(true); setResults([]);

    const params = new URLSearchParams({
      limit: 200,
      document_type:  filters.fileType   || '',
      entity_type:    filters.entityType || '',
      title:          searchField==='title'           ? query.trim() : '',
      document_number:searchField==='document_number'? query.trim() : '',
    });

    const { results=[] } = await apiFetch(`/documents/?${params.toString()}`);

    setResults(results);
  } catch (err) {
    setError(err.message||'حدث خطأ أثناء الاتصال بالخادم.');
    setResults([]);
  } finally { setLoading(false); }
}

/* ❷ زرّ يدوي */
export function CustomSearchButton({ onClick }) {
  return (
    <button id="custom-btn" className="custom-search-button c-pointer" onClick={onClick}>
      <FontAwesomeIcon icon={faFileAlt}/> بحث مخصّص
    </button>
  );
}

export default { run, Button: CustomSearchButton };