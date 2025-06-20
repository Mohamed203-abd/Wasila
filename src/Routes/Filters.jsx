import { useState } from 'react';
import '../Styles/Filters.css';

function Filters({ onClose, onApply }) {
  const [entityType, setEntityType] = useState('');
  const [fileType, setFileType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [closing, setClosing] = useState(false); // للحركة

  const handleApply = () => {
      onApply({ entityType, fileType, fromDate, toDate });
  closeWithAnimation();
};

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('filters-overlay')) {
      closeWithAnimation();
    }
  };

  const closeWithAnimation = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // نفس مدة الأنيميشن
  };

  return (
    <div className="filters-overlay" onClick={handleOverlayClick}>
      <div className={`filters-modal ${closing ? 'fade-out' : ''}`}>
        <div className="modal-header">
          <h3>خيارات التصفية</h3>
          <button className="close-button" onClick={closeWithAnimation}>×</button>
        </div>

        <div className="filters-content">
          <div className="filter-group">
            <label>نوع الجهة</label>
            <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
              <option value="">الكل</option>
              <option value="داخلية">داخلية</option>
              <option value="خارجية">خارجية</option>
            </select>
          </div>

          <div className="filter-group">
            <label>نوع الملف</label>
            <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
              <option value="">الكل</option>
              <option value="صادر">صادر</option>
              <option value="وارد">وارد</option>
            </select>
          </div>

          <div className="filter-group">
            <label>من تاريخ</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          <div className="filter-group">
            <label>إلى تاريخ</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          <button className="apply-button" onClick={handleApply}>تطبيق</button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
