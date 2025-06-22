import { useState, useEffect } from 'react';
import '../Styles/Search.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';

function Search({ data = [], onFilter }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!onFilter) return;
    if (query.trim() === "") {
      onFilter([]);
      return;
    }
    const filtered = data.filter((item) =>
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.document_number?.toLowerCase().includes(query.toLowerCase())
    );
    onFilter(filtered);
  }, [query, data, onFilter]);

  const handleClear = () => {
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
    }
  };

  return (
    <form className="search-form p-relative">
      <div className="search d-flex align-center">
        <span className="search-icon d-flex-c">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          type="text"
          placeholder="بحث"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input p-absolute"
        />
        {query && (
          <button
            type="button"
            className="clear-btn p-absolute c-pointer"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </form>
  );
}

export default Search;
