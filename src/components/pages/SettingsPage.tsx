import React, { useState } from 'react';
import Banner from '../atoms/Banner';
import { backupRecordsByType } from '../../api/library-service';
import { recordTypes } from '../../constants/records';
import { backupPasswords } from '../../api/password-service';

const SettingsPage: React.FC = () => {
  const [showBanner, setShowBanner] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  const backupRecords = (type: string) => {
    backupRecordsByType(type).then(() => {
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
          <div className='settings-backend-op-wrapper'>
            {recordTypes.map(type =>
              <button key={type} className="add-new-btn" onClick={() => { backupRecords(type) }}>
                Backup {type}
              </button>
            )}
            <button key={'passwords'} className="add-new-btn" onClick={() => { backupPasswords() }}>
              Backup Passwords
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
