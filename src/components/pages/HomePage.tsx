import React, { useEffect, useState } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../../api/library-service';
import { useStorage } from '../../context/StorageContext';
import Banner from '../atoms/Banner';
import { getRecordsFromStorage } from '../../utils/storage';


const HomePage: React.FC = () => {
  const { isBackendAvailable, isLoadingPing } = useStorage();
  const [isLoadingReadme, setIsLoadingReadme] = useState<boolean>(true);
  const [readme, setReadme] = useState<string>("");
  const [editValue, setEditValue] = useState(readme);
  const [isEditing, setIsEditing] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });

  useEffect(() => {
    if (isBackendAvailable && isLoadingReadme) {
      loadRecordsByType('readme', false).then((records: string) => {
        setReadme(records);
        setIsLoadingReadme(false);
      });
    }
    if (!isBackendAvailable && !isLoadingPing) {
      const savedReadmes = getRecordsFromStorage('readme', '');
      setReadme(savedReadmes);
      setIsLoadingReadme(false);
    }
  }, [isBackendAvailable, isLoadingPing, isLoadingReadme]);

  const handleSubmit = async (payload: string) => {
    if (!isBackendAvailable && !isLoadingPing) {
      localStorage.setItem('readme', JSON.stringify(payload));
    } else {
      updateRecordsByType(payload, 'readme')
        .then((isSuccess: boolean) => {
          if (isSuccess) {
            setShowBanner({ show: true, type: 'success' });
            setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          } else {
            setShowBanner({ show: true, type: 'error' });
            setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          }
        })
        .catch((error: unknown) => {
          setShowBanner({ show: true, type: 'error' });
          setTimeout(() => setShowBanner({ show: false, type: '' }), 2500);
          console.error('Error:', error);
        });
    }
  };

  const handleEdit = () => {
    setEditValue(readme);
    setIsEditing(true);
  };

  const handleSave = () => {
    setReadme(editValue);
    setIsEditing(false);
    handleSubmit(editValue)
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(readme);
  };

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} />
      <h1 className="page-title">Home</h1>
      <div className="home-editable-text">
        {isEditing ? (
          <>
            <textarea
              className="readme-edit"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              rows={4}
            />
            <div>
              <button className="primary-btn" onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
              <button className="negative-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <button className="primary-btn" onClick={handleEdit}>Edit</button>
            <div className="readme-view">
              {readme.split('\n').map(sentence => <div key={sentence}>{sentence}</div>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage; 