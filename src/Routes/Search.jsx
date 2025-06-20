import { useState } from 'react';
import '../Styles/Search.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimes, faFile  } from '@fortawesome/free-solid-svg-icons';

const data = [
  { id: 1, title: "مستند أرشيف 1" },
  { id: 2, title: "مذكرة قديمة" },
  { id: 3, title: "خطة كلية الهندسة" },
  { id: 4, title: "أرشيف الأدب العربي" },
];

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
    setResults([]); // فضي النتائج لو الـ input فاضي
    return;
  }

    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]); // امسح النتائج
  };

  return (
    <form>
        <div className="search d-flex align-center">
            <span className="search-icon d-flex-c">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input type="text" placeholder="بحث" value={query} onChange={handleSearch}
            className="search-input p-absolute" />
            {query && (
                <button type="button" className="clear-btn" onClick={handleClear} aria-label="Clear search" >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            )}
            {results.length > 0 && (
                <ul className="results-list">
                    {results.map((item) => (
                        <li key={item.id}>
                          <FontAwesomeIcon icon={faFile} className="file-icon" />{item.title}
                        </li>
                    ))}
                </ul>
            )}      
        </div>
    </form>
    );
}
export default Search