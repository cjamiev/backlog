const HomePage: React.FC = () => {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Home</h1>
      <div className="home-content">
        <div className="home-tag-line">
          Every now and then I hear a song or see a trailer and think I want to listen to that or see it at some point.  Unfortunately sometimes I forget.
        </div>
        <div>
          This app was made to help me keep track of those items as well as birthdays, project ideas and so on in a way that's quick to store and easy to find.
        </div>
        <div className="home-notes">
          This demo version uses local storage to simulate CRUD operations.  It also contains mocked examples.
        </div>
      </div>
    </div>
  );
};

export default HomePage; 