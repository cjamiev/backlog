import React, { useState } from 'react';
import Banner from '../atoms/Banner';
import { backupRecordsByType } from '../../api/library-service';
import { backupPasswords } from '../../api/password-service';
import { trackerTypes, gamedevTypes, entertainmentTypes } from '../../constants/records';
import { clearStorage } from '../../utils/storage';
import { getIsDemoMode } from '../../utils/config';
import { DEFAULT_BANNER_PROPS } from '../../constants/props';
import { loadAllMockData, loadMockData } from '../../utils/demoUtils';

const SettingsPage: React.FC = () => {
  const [showBanner, setShowBanner] = useState<{ isVisible: boolean; type: string; message: string }>({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const handleLoadMockData = (key?: string) => {
    if (key) {
      loadMockData(key);
    } else {
      loadAllMockData();
    }
    setShowBanner({ isVisible: true, type: 'success', message: `Loaded ${key ? key : 'Loaded all'}` });
    setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
  };

  const handleClearLocalStorage = (key?: string) => {
    clearStorage(key);
    setShowBanner({ isVisible: true, type: 'success', message: `Cleared ${key ? key : 'Local Storage'}` });
    setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
  };

  const backupRecords = (type: string) => {
    backupRecordsByType(type).then(() => {
      setShowBanner({ isVisible: true, type: 'success', message: `Backed up Data` });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    }).catch(() => {
      setShowBanner({ isVisible: true, type: 'error', message: `Failed to back up Data` });
      setTimeout(() => setShowBanner(DEFAULT_BANNER_PROPS), 2500);
    })
  }

  return (
    <div className="page-wrapper">
      <Banner {...showBanner} />
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
              <p>***You may have to refresh page due to react query caching data***</p>
              <h3>  Clear Data </h3>
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
              <h3>  Load Mock Data </h3>
              <div className='settings-backend-wrapper'>
                <div className='settings-btns-section'>
                  <button className="primary-btn" onClick={() => handleLoadMockData()}>
                    Load all
                  </button>
                </div>
                <div className='settings-btns-section'>
                  {entertainmentTypes.map(type =>
                    <button key={type} className="primary-btn" onClick={() => { handleLoadMockData(type) }}>
                      Load {type}
                    </button>
                  )}
                </div>
                <div className='settings-btns-section'>
                  {trackerTypes.map(type =>
                    <button key={type} className="primary-btn" onClick={() => { handleLoadMockData(type) }}>
                      Load {type}
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
