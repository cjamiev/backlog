import React, { useEffect, useState } from 'react';
import { loadReadme, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';


const HomePage: React.FC = () => {
  const [isLoadingReadme, setIsLoadingReadme] = useState<boolean>(true);
  const [readme, setReadme] = useState<string>("");
  const [editValue, setEditValue] = useState(readme);
  const [isEditing, setIsEditing] = useState(false);
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string }>({ show: false, type: 'success' });

  useEffect(() => {
    if (isLoadingReadme) {
      loadReadme().then((records: string) => {
        setReadme(records);
        setIsLoadingReadme(false);
      });
    }
  }, [isLoadingReadme]);

  const handleSubmit = async (payload: string) => {
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