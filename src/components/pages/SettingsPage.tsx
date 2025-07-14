import React, { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import { clearStorage } from '../../utils/storage';
import Banner from '../atoms/Banner';
import { backupAllRecords } from '../../api/library-service';

const SettingsPage: React.FC = () => {
  const { isBackendAvailable } = useStorage();
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });
  const handleClearLocalStorage = (key?: string) => {
    clearStorage(key);
    setShowBanner({ show: true, type: 'success', message: `Cleared ${key ? key : 'Local Storage'}` });
    setTimeout(() => setShowBanner({ show: false, type: '', message: '' }), 2500);
  };

  const backupRecords = () => {
    backupAllRecords().then((response) => console.log(response))
  }

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} defaultMessage={showBanner.message} />
      <h1 className="page-title">Settings</h1>
      <div className="page-body-layout">
        <div>
          <h2>Configuration</h2>
          <span>Storage: {isBackendAvailable ? 'Backend' : 'Local Storage'}</span>
        </div>
        <div>
          <h2>Local Storage</h2>
          <button className="add-new-btn" onClick={() => handleClearLocalStorage()}>
            Clear All
          </button>
          <button className="add-new-btn" onClick={() => handleClearLocalStorage('songs')}>
            Clear Songs
          </button>
        </div>
        {isBackendAvailable ? <div>
          <h2>Backend Operations</h2>
          <button className="add-new-btn" onClick={backupRecords}>Backup</button>
        </div> : <div><h2>Backend Disabled</h2></div>}
      </div>
    </div>
  );
};

export default SettingsPage;
