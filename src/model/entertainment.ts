export interface Song {
  id: string; // name + band
  name: string;
  band: string;
  rank: number;
  link: string;
  tags: string;
}

export const DefaultSong: Song = {
  id: '',
  name: '',
  band: '',
  rank: 1,
  link: '',
  tags: '',
}

export const bookTypes = ['SciFi', 'Fantasy', 'Comic', 'Manga'];

export interface Book {
  name: string;
  author: string;
  type: string;
  tags: string;
}

export const DefaultBook: Book = {
  name: '',
  author: '',
  type: 'SciFi',
  tags: '',
}

export const serviceType = [
  'Unknown',
  'Amazon Prime',
  'Apple+',
  'Disney+',
  'Crunchyroll',
  'HBO Max',
  'Hulu',
  'Netflix',
  'Paramount+',
  'Peacock',
  'Pluto TV',
  'Tubi',
];

export interface Film {
  name: string;
  service: string;
  rank: number;
  tags: string;
}

export const DefaultFilm: Film = {
  name: '',
  service: 'Unknown',
  rank: 1,
  tags: '',
}

export interface Show {
  name: string;
  service: string;
  rank: number;
  tags: string;
}

export const DefaultShow: Show = {
  name: '',
  service: 'Unknown',
  rank: 1,
  tags: '',
}

export interface Game {
  name: string;
  rank: number;
  lowestPrice: string;
  tags: string;
}

export const DefaultGame: Game = {
  name: '',
  rank: 1,
  lowestPrice: "",
  tags: ''
}

export interface Favorite {
  name: string;
  link: string;
  type: string;
  tags: string;
  notes: string;
}

export const DefaultFavorite: Favorite = {
  name: '',
  link: '',
  type: '',
  tags: '',
  notes: ''
}