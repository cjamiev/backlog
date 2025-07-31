export enum GENDER_TYPE {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export interface Name {
  value: string;
  gender: GENDER_TYPE;
  origin: string;
  tags: string;
}

export const DefaultName: Name = {
  value: '',
  gender: GENDER_TYPE.MALE,
  origin: '',
  tags: ''
};

export enum WORD_TYPE {
  NOUN = 'Noun',
  ADJECTIVE = 'Adjective',
  VERB = 'Verb'
}

export interface Word {
  value: string;
  definition: string;
  type: WORD_TYPE;
  tags: string;
}

export const DefaultWord: Word = {
  value: '',
  definition: '',
  type: WORD_TYPE.NOUN,
  tags: ''
};

export enum WORD_PART_TYPE {
  SUFFIX = 'Suffix',
  PREFIX = 'Prefix',
  VOWEL = 'Vowel',
  CONSONANT = 'Consonant',
}

export interface WordPart {
  value: string;
  definition: string;
  type: WORD_PART_TYPE;
}

export const DefaultWordPart: WordPart = {
  value: '',
  definition: '',
  type: WORD_PART_TYPE.PREFIX,
};

export interface Phrase {
  value: string;
  origin: string;
  tags: string;
}

export const DefaultPhrase: Phrase = {
  value: '',
  origin: '',
  tags: ''
};

export interface Reference {
  value: string;
  origin: string;
  definition: string;
  tags: string;
}

export const DefaultReference: Reference = {
  value: '',
  origin: '',
  definition: '',
  tags: ''
};

export interface Song {
  id: string; // name + album
  name: string;
  album: string;
  band: string;
  rank: number;
  link: string;
  tags: string;
}

export const DefaultSong: Song = {
  id: '',
  name: '',
  album: '',
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

export interface Project {
  name: string;
  details: string;
  rank: number;
  tags: string;
}

export const DefaultProject: Project = {
  name: '',
  details: '',
  rank: 1,
  tags: ''
}

export interface Countdown {
  name: string;
  date: string;
  tags: string;
}

export const DefaultCountdown: Countdown = {
  name: '',
  date: '',
  tags: ''
}

export interface Contact {
  name: string;
  phone: string;
  email: string;
  address: string;
  tags: string;
}

export const DefaultContact: Contact = {
  name: '',
  phone: '',
  email: '',
  address: '',
  tags: ''
}


export interface Note {
  name: string;
  details: string;
  createdDate: string;
  updatedDate: string;
  tags: string;
}

export const DefaultNote: Note = {
  name: '',
  details: '',
  createdDate: '',
  updatedDate: '',
  tags: ''
}