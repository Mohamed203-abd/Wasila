import { useState } from 'react';
import '../Styles/Filters.css';

function Filters({ onClose, onApply }) {
  const [entityType, setEntityType] = useState('');
  const [fileType, setFileType] = useState('');
  const [closing, setClosing] = useState(false); // للحركة

  const handleApply = () => {
      onApply({ entityType, fileType });
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
  <option value="جهة داخلية">داخلية</option>
  <option value="جهة خارجية">خارجية</option>
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

          <button className="apply-button" onClick={handleApply}>تطبيق</button>
        </div>
      </div>
    </div>
  );
}

export default Filters;