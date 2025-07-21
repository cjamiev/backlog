import React, { useEffect, useState } from 'react';
import { loadReadme, updateRecordsByType } from '../../api/library-service';
import Banner from '../atoms/Banner';
import Footer from '../atoms/Footer';
import { getIsDemoMode } from '../../utils/config';


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
      {!getIsDemoMode() ? <div>
        <div className="readme-edit">
          {isEditing ? (
            <>
              <textarea
                className="readme-edit"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                rows={4}
              />
            </>
          ) : (
            <>
              <div className="readme-view">
                {readme.split('\n').map(sentence => <div key={sentence}>{sentence}</div>)}
              </div>
            </>
          )}
        </div>
        <Footer>
          {isEditing ? <div>
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="negative-btn" onClick={handleCancel}>Cancel</button>
          </div>
            :
            <button className="primary-btn" onClick={handleEdit}>Edit</button>
          }
        </Footer>
      </div> : <div className="home-content">
        <div className="home-tag-line">
          Every now and then I hear a song or see a trailer and think I want to listen to that or see it at some point.  Unfortunately sometimes I forget.
        </div>
        <div>
          This app was made to help me keep track of those items as well as birthdays, project ideas and so on in a way that's quick to store and easy to find.
        </div>
        <div className="home-notes">
          This demo version uses local storage to simulate CRUD operations.  It also contains mocked examples.
        </div>
      </div>}
    </div>
  );
};

export default HomePage; 