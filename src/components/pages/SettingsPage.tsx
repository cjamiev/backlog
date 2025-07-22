import React, { useState } from 'react';
import Banner from '../atoms/Banner';
import { backupRecordsByType } from '../../api/library-service';
import { backupPasswords } from '../../api/password-service';
import { trackerTypes, gamedevTypes, entertainmentTypes } from '../../constants/records';
import { clearStorage } from '../../utils/storage';
import { getIsDemoMode } from '../../utils/config';

const SettingsPage: React.FC = () => {
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
        <div className='settings-content'>
          {!getIsDemoMode() ? <div>
            <h2>Backend Operations</h2>
            <div className='settings-backend-wrapper'>
              <div className='settings-btns-section'>
                {gamedevTypes.map(type =>
                  <button key={type} className="primary-btn" onClick={() => { backupRecords(type) }}>
                    Backup {type}
                  </button>
                )}
              </div>
              <div className='settings-btns-section'>
                {entertainmentTypes.map(type =>
                  <button key={type} className="primary-btn" onClick={() => { backupRecords(type) }}>
                    Backup {type}
                  </button>
                )}
              </div>
              <div className='settings-btns-section'>
                {trackerTypes.map(type =>
                  <button key={type} className="primary-btn" onClick={() => { backupRecords(type) }}>
                    Backup {type}
                  </button>
                )}
              </div>
              <div className='settings-btns-section'>
                <button key={'passwords'} className="primary-btn" onClick={() => { backupPasswords() }}>
                  Backup Passwords
                </button>
              </div>
            </div>
          </div> :
            <div className='settings-content'>
              <h2>Local Storage Operations</h2>
              <div className='settings-backend-wrapper'>
                <div className='settings-btns-section'>
                  <button className="primary-btn" onClick={() => handleClearLocalStorage()}>
                    Clear all
                  </button>
                </div>
                <div className='settings-btns-section'>
                  {entertainmentTypes.map(type =>
                    <button key={type} className="primary-btn" onClick={() => { handleClearLocalStorage(type) }}>
                      Clear {type}
                    </button>
                  )}
                </div>
                <div className='settings-btns-section'>
                  {trackerTypes.map(type =>
                    <button key={type} className="primary-btn" onClick={() => { handleClearLocalStorage(type) }}>
                      Clear {type}
                    </button>
                  )}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
