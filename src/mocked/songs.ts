import { type Song } from '../model/library';

export const fakeSongs: Song[] = [
  {
    id: '1',
    name: 'Bohemian Rhapsody',
    album: 'A Night at the Opera',
    band: 'Queen',
    rank: 1,
    link: 'https://en.wikipedia.org/wiki/Bohemian_Rhapsody',
    tags: 'rock,classic,queen'
  },
  {
    id: '2',
    name: 'Imagine',
    album: 'Imagine',
    band: 'John Lennon',
    rank: 2,
    link: 'https://en.wikipedia.org/wiki/Imagine_(John_Lennon_song)',
    tags: 'pop,classic,john lennon'
  },
  {
    id: '3',
    name: 'Smells Like Teen Spirit',
    album: 'Nevermind',
    band: 'Nirvana',
    rank: 3,
    link: 'https://en.wikipedia.org/wiki/Smells_Like_Teen_Spirit',
    tags: 'grunge,rock',
  },
  {
    id: '4',
    name: 'Billie Jean',
    album: 'Thriller',
    band: 'Michael Jackson',
    rank: 4,
    link: 'https://en.wikipedia.org/wiki/Billie_Jean',
    tags: 'pop,classic',
  },
  {
    id: '5',
    name: 'Hey Jude',
    album: 'Hey Jude',
    band: 'The Beatles',
    rank: 5,
    link: 'https://en.wikipedia.org/wiki/Hey_Jude',
    tags: 'classic,rock',
  },
]; 