import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders, faFile } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import '../Styles/Research.css';
import Filters from '../Routes/Filters';

const dummyResults = [
  { id: 1, title: 'صادر من جهة داخلية', entityType: 'داخلية', fileType: 'صادر', date: '2024-06-01' },
  { id: 2, title: 'وارد من جهة خارجية', entityType: 'خارجية', fileType: 'وارد', date: '2024-06-03' },
  { id: 3, title: 'صادر من جهة خارجية', entityType: 'خارجية', fileType: 'صادر', date: '2024-06-05' },
  { id: 4, title: 'صادر من جهة داخلية', entityType: 'داخلية', fileType: 'صادر', date: '2024-06-01' },
  { id: 5, title: 'وارد من جهة خارجية', entityType: 'خارجية', fileType: 'وارد', date: '2024-06-03' },
  { id: 6, title: 'صادر من جهة خارجية', entityType: 'خارجية', fileType: 'صادر', date: '2024-06-05' },
  { id: 7, title: 'صادر من جهة خارجية', entityType: 'خارجية', fileType: 'صادر', date: '2024-06-05' },
  { id: 8, title: 'صادر من جهة خارجية', entityType: 'خارجية', fileType: 'صادر', date: '2024-06-05' },
  { id: 9, title: 'صادر من جهة خارجية', entityType: 'خارجية', fileType: 'صادر', date: '2024-06-05' },
];

function Research() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(null); // null معناها لسه مفيش فلتر متطبق
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!filters) {
      setResults([]);
      return;
    }

    const filtered = dummyResults.filter((item) => {
      const matchQuery = !query || item.title.includes(query);
      const matchEntity = !filters.entityType || item.entityType === filters.entityType;
      const matchFileType = !filters.fileType || item.fileType === filters.fileType;
      const matchFromDate = !filters.fromDate || new Date(item.date) >= new Date(filters.fromDate);
      const matchToDate = !filters.toDate || new Date(item.date) <= new Date(filters.toDate);

      return matchQuery && matchEntity && matchFileType && matchFromDate && matchToDate;
    });

    setResults(filtered);
    setError('');
  }, [query, filters]);

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    setShowFilters(false);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!filters) {
      setError('يجب اختيار الفلاتر أولاً');
      setResults([]);
    } else {
      setError('');
    }
  };

  return (
    <div className='landing p-relative'>
      <div className='overlay'>
        <div className="search-page-container p-relative">
          <div className="search-bar">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
            <input
              type="text"
              placeholder="ابحث عن مستند..."
              value={query}
              onChange={handleQueryChange}
            />
            <button
              className="settings-button"
              onClick={() => setShowFilters(true)}
            >
              <FontAwesomeIcon icon={faSliders} />
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <ul className="results">
            {results.length > 0 ? (
              results.map((item) => (
                <li key={item.id}>
                  <FontAwesomeIcon icon={faFile} className="file-icon" />
                  {item.title} - {item.date}
                </li>
              ))
            ) : (
              !error && <li>لا توجد نتائج مطابقة</li>
            )}
          </ul>

          {showFilters && (
            <Filters onClose={() => setShowFilters(false)} onApply={handleApplyFilters} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Research;
