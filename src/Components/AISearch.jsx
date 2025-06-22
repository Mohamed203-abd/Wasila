import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot }          from '@fortawesome/free-solid-svg-icons';
import { apiFetch }         from '../api';

/* ❶ دالة قابلة للاستدعــاء من الخارج */
async function run({ query, setLoading, setError, setResults }) {
  if (!query.trim()) {
    setError('أدخل عبارة للبحث باستخدام الذكاء الاصطناعي');
    setResults([]);
    return;
  }
  try {
    setError(''); setLoading(true); setResults([]);
    const { results=[] } = await apiFetch(
      `/ai/search_with_ai/?query=${encodeURIComponent(query)}`
    );
    setResults(results);
  } catch (err) {
    setError(err.message||'حدث خطأ');
  } finally { setLoading(false); }
}

/* ❷ زرّ مستقل (لمن يفضل الضغط اليدوي) */
export function AISearchButton({ onClick }) {
  return (
    <button id="ai-btn" className="ai-search-button" onClick={onClick}>
      <FontAwesomeIcon icon={faRobot}/> بحث بالذكاء الاصطناعي
    </button>
  );
}

export default { run, Button: AISearchButton };