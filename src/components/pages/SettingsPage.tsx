import React, { useState } from 'react';
import Banner from '../atoms/Banner';
import { backupAllRecords } from '../../api/library-service';

const SettingsPage: React.FC = () => {
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  const backupRecords = () => {
    backupAllRecords().then(() => {
      setShowBanner({ show: true, type: 'success', message: `Backed up Data` });
      setTimeout(() => setShowBanner({ show: false, type: '', message: '' }), 2500);
    }).catch(() => {
      setShowBanner({ show: true, type: 'error', message: `Failed to back up Data` });
      setTimeout(() => setShowBanner({ show: false, type: '', message: '' }), 2500);
    })
  }

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} defaultMessage={showBanner.message} />
      <h1 className="page-title">Settings</h1>
      <div className="page-body-layout">
        <div>
          <h2>Backend Operations</h2>
          <button className="add-new-btn" onClick={backupRecords}>Backup</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
