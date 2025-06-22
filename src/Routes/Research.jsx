import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass, faSliders,
  faFilePdf,  faFileImage,  faFileWord,  faFileExcel,  faFileAlt,
  faExternalLinkAlt, faArrowUp, faArrowDown, faTimes,
} from '@fortawesome/free-solid-svg-icons';


import '../Styles/Research.css';
import Filters      from '../Components/Filters';
import { getFullFileUrl } from '../utils';
import Landing      from '../Components/Landing';
import AISearch     from '../Components/AISearch';
import CustomSearch from '../Components/CustomSearch';

/* ---------- helpers ---------- */
const highlightText = (text, key) =>
  !key ? text :
  text.split(new RegExp(`(${key})`, 'gi'))
      .map((p,i)=>p.toLowerCase()===key.toLowerCase()
        ? <mark key={i} className="highlight">{p}</mark>
        : <span key={i}>{p}</span>);

const formatDate = (d)=> d ? new Date(d).toLocaleDateString('ar-EG') : '—';

const getFileIconAndColor = (filename)=>{
  if(!filename) return {icon:faFileAlt,color:'#6c757d'};
  const ext = filename.split('.').pop().toLowerCase();
  switch(ext){
    case 'pdf':  return {icon:faFilePdf ,color:'#b20a00'};
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'bmp': case 'svg':
                return {icon:faFileImage,color:'#0275d8'};
    case 'doc': case 'docx': return {icon:faFileWord ,color:'#2a5699'};
    case 'xls': case 'xlsx': return {icon:faFileExcel,color:'#228b22'};
    default:     return {icon:faFileAlt ,color:'#6c757d'};
  }
};

/* ---------- result card ---------- */
function SearchResultItem({ item, query, searchType }){
  const [showDetails,setShowDetails]=useState(false);

  const fileLink =
    item.direct_media_url || item.file_url || item.file_path ||
    (item.file ? getFullFileUrl(item.file):null);

  const finalFileLink = searchType==='ai' ? fileLink : item.file;

  const entLabel = item.entity_type?.includes('داخلية') ? 'جهة داخلية'
                  : item.entity_type?.includes('خارجية') ? 'جهة خارجية'
                  : item.entity_type || '—';

  const entName  = item.internal_entity?.name  || item.external_entity?.name  || '—';
  const deptName = item.internal_department?.name || item.external_department?.name || '—';

  const {icon,color}=getFileIconAndColor(item.file||item.name);

  return(
    <li className="result-item full-details">
      <div className="main-info flex-between wrap">
        <FontAwesomeIcon icon={icon} className="file-icon large" style={{color}}/>
        <div className="file-name"><strong>اسم الملف:</strong> {item.title||'—'}</div>

        {finalFileLink && (
          <a href={finalFileLink} target="_blank" rel="noopener noreferrer"
            className="open-file-button c-pointer">
            <FontAwesomeIcon icon={faExternalLinkAlt}/> فتح الملف
          </a>
        )}

        <button className="toggle-details-button c-pointer"
                onClick={()=>setShowDetails(p=>!p)}>
          {showDetails?'إخفاء التفاصيل':'عرض التفاصيل'}
        </button>
      </div>

      {showDetails && (
        <div className="details-grid">
          <div><strong>رقم المستند:</strong> {highlightText(item.document_number||'—',query)}</div>
          <div><strong>تاريخ الرفع:</strong> {formatDate(item.uploaded_at)}</div>
          <div><strong>نوع الجهة:</strong> {entLabel}</div>
          <div><strong>اسم الجهة:</strong> {entName}</div>
          <div><strong>القسم/الإدارة:</strong> {deptName}</div>
          <div><strong>نوع المستند:</strong> {item.document_type||'—'}</div>
          <div style={{gridColumn:'1/-1'}}><strong>ملاحظات:</strong> {item.notes||'—'}</div>
        </div>
      )}
    </li>
  );
}

/* ---------- main component ---------- */
function Research(){
  const [query,setQuery]           = useState('');
  const [searchField,setSearchField]=useState('title');
  const [showFilters,setShowFilters]=useState(false);
  const [filters,setFilters]       = useState(null);
  const [results,setResults]       = useState([]);
  const [error,setError]           = useState('');
  const [loading,setLoading]       = useState(false);
  const [sortOrder,setSortOrder]   = useState('desc');
  const [activeTab,setActiveTab]   = useState('ai');

  /* --- search trigger shared by button & Enter --- */
  const runSearch = ()=>{
    if(activeTab==='ai'){
      AISearch.run({query,setResults,setLoading,setError});
    }else{
      CustomSearch.run({query,filters,searchField,setResults,setLoading,setError});
    }
  };

  /* --- utilities --- */
  const toggleSortOrder=()=>setSortOrder(o=>o==='asc'?'desc':'asc');

  const sortedResults=[...results].sort((a,b)=>{
    const dA=new Date(a.uploaded_at), dB=new Date(b.uploaded_at);
    return sortOrder==='asc'? dA-dB : dB-dA;
  });

  /* --- render --- */
  return(
    <Landing>
      <div className="search-container p-relative">

        {/* --- tabs --- */}
        <div className="tabs-container d-flex">
          {['ai','custom'].map(t=>(
            <button key={t}
              className={`tab-btn c-pointer ${activeTab===t?'active':''}`}
              style={t==='custom'?{marginLeft:10}:{}}
              onClick={()=>{
                setActiveTab(t);
                if(t!=='custom'){ setShowFilters(false); setFilters(null);}
                setResults([]); setError('');
              }}>
              {t==='ai'?'بحث بالذكاء الاصطناعي':'بحث مخصص'}
            </button>
          ))}
        </div>

        {/* --- search bar --- */}
        <div className="search-bar d-flex align-center wrap">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icon"/>
          <input
            type="text" placeholder="ابحث عن مستند..."
            value={query}
            onChange={e=>{
              const v=e.target.value; setQuery(v);
              if(v.trim()===''){ setResults([]); setError(''); }
            }}
            onKeyDown={e=>{
              if(e.key==='Enter'){ e.preventDefault(); runSearch(); }
            }}
          />
          {/* Clear */}
          {query && (
            <button className="clear-btn c-pointer" title="مسح"
              onClick={()=>{ setQuery(''); setResults([]); setError(''); }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}

          {/* custom-only controls */}
          {activeTab==='custom' && (
            <>
              <select className="field-select c-pointer"
                      value={searchField}
                      onChange={e=>setSearchField(e.target.value)}>
                <option value="title">العنوان</option>
                <option value="document_number">رقم المستند</option>
              </select>
              <button className="settings-button c-pointer" title="خيارات التصفية"
                      onClick={()=>setShowFilters(true)}>
                <FontAwesomeIcon icon={faSliders}/>
              </button>
            </>
          )}

          {/* sort */}
          <button className="sort-btn c-pointer" onClick={toggleSortOrder}
                  title={sortOrder==='asc'?'ترتيب تصاعدي':'ترتيب تنازلي'}
                  style={{marginLeft:10}}>
            <FontAwesomeIcon icon={sortOrder==='asc'?faArrowUp:faArrowDown}/>
          </button>
        </div>

        {/* --- action buttons (لمن يريد الضغط اليدوي) --- */}
        <div className="research-buttons">
          {activeTab==='ai'     && <AISearch.Button onClick={runSearch}/>}
          {activeTab==='custom' && <CustomSearch.Button onClick={runSearch}/>}
        </div>

        {/* --- status --- */}
        {error && <p className="error-message">{error}</p>}
        {loading&&<p style={{textAlign:'center'}}>جاري التحميل...</p>}
        {!loading && results.length>0 && (
          <div className="results-count">عدد النتائج: {results.length}</div>
        )}

        {/* --- results --- */}
        <ul className="results">
          {!loading && query && sortedResults.length
            ? sortedResults.map(r=>(
                <SearchResultItem key={r.id} item={r} query={query} searchType={activeTab}/>
              ))
            : (!loading && query && !error && <li>لا توجد نتائج مطابقة</li>)
          }
        </ul>

        {showFilters && (
          <Filters onClose={()=>setShowFilters(false)}
                  onApply={applied=>{setFilters(applied);setResults([]);setError('');}}/>
        )}
      </div>
    </Landing>
  );
}

export default Research;