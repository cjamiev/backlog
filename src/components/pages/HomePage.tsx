import { useState } from "react";
import { useLoadRecordsByType } from "../../api/library-service";
import type { Song } from "../../model/entertainment";

const getCurrentSongData = (song: Song) => {
  if (!song) {
    return { title: '', link: '' };
  }

  const { name, band, link } = song;
  if (link.includes('watch?v=')) {
    return { title: name + ' ' + band, link: link.replace('watch?v=', 'embed/') }
  }
  if (link.includes('youtu.be')) {
    return { title: name + ' ' + band, link: link.replace('youtu.be', 'youtube.com/embed') }
  }

  return { title: song.name + ' ' + song.band, link: song.link }
}

const HomePage: React.FC = () => {
  const { data: songs = [], isLoading: isLoadingSongs } = useLoadRecordsByType<Song>('songs');
  const [currentSongIdx, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');

  const playableSongs = songs.filter(s => !!s.link && !s.tags.includes('segment'))
    .sort((a, b) => (a.band.localeCompare(b.band)));
  const clickableSongs = playableSongs.filter(s =>
    s.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
    s.band.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );
  const { title, link } = getCurrentSongData(playableSongs[currentSongIdx]);

  const onSearchChange = (filter: string) => {
    setSearch(filter);
  };

  const handleSelectSong = (name: string, band: string) => {
    const index = playableSongs.findIndex(s => s.name === name && s.band === band);
    setCurrentPage(index);
  }

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

        {!isLoadingSongs ? (
          <div >
            <div>
              <span className="card-label">Title: </span> {title}
              <span className="card-label"> Link: </span> {link}
            </div>
            <iframe autoFocus width="800" height="600" src={link} title="description">Bring It</iframe>
            <div>
              <input
                className="search-bar"
                type="text"
                placeholder={'Search by Name/Band'}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {clickableSongs.length > 0 ? <div className="home-song-list">
                {clickableSongs.map((s) => {
                  return <button className="home-song-btn" onClick={() => { handleSelectSong(s.name, s.band) }}>{s.name} - {s.band}</button>
                })}
              </div> : <div>No Songs Found</div>}
            </div>
          </div>
        ) : (
          <div className="loading-container">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 