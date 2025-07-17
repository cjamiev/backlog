import React, { useState } from 'react';
import Banner from '../atoms/Banner';
import { clearStorage } from '../../utils/storage';
import Footer from '../atoms/Footer';

const HomeDemoPage: React.FC = () => {
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

  return (
    <div className="page-wrapper">
      <Banner isVisible={showBanner.show} type={showBanner.type} defaultMessage={showBanner.message} />
      <h1 className="page-title">Home</h1>
      <div className="home-content">
        <div className="home-tag-line">
          Every now and then I hear a song or see a trailer and think I want to listen to that or see it at some point.  Unfortunately sometimes I forget.
        </div>
        <div>
          This app was made to help me keep track of those items as well as birthdays, project ideas and so on in a way that's quick to store and easy to find.
        </div>
        <div className="home-notes">
          This demo version only displays a few examples and uses local storage to simulate CRUD operations.  It also contains a few mocked examples.
        </div>
      </div>
      <Footer>
        <button className="add-new-btn" onClick={() => handleClearLocalStorage()}>
          Clear All
        </button>
        <button className="add-new-btn" onClick={() => handleClearLocalStorage('songs')}>
          Clear  Songs
        </button>        
        <button className="add-new-btn" onClick={() => handleClearLocalStorage('shows')}>
          Clear  Shows
        </button>
        <button className="add-new-btn" onClick={() => handleClearLocalStorage('projects')}>
          Clear  Projects
        </button>
        <button className="add-new-btn" onClick={() => handleClearLocalStorage('countdowns')}>
          Clear  Countdowns
        </button>
        <button className="add-new-btn" onClick={() => handleClearLocalStorage('favorites')}>
          Clear  Favorites
        </button>
      </Footer>
    </div>
  );
};

export default HomeDemoPage; 