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
  id: string;
  value: string;
  origin: string;
  tags: string;
}

export const DefaultPhrase: Phrase = {
  id: '',
  value: '',
  origin: '',
  tags: ''
};

export interface Reference {
  id: string;
  value: string;
  origin: string;
  definition: string;
  tags: string;
}

export const DefaultReference: Reference = {
  id: '',
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

export interface Book {
  name: string;
  tags: string;
}

export const DefaultBook: Book = {
  name: '',
  tags: '',
}

export interface Film {
  name: string;
  rank: number;
  tags: string;
}

export const DefaultFilm: Film = {
  name: '',
  rank: 1,
  tags: '',
}

export interface Show {
  name: string;
  rank: number;
  tags: string;
}

export const DefaultShow: Show = {
  name: '',
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
  id: string;
  name: string;
  details: string;
  rank: number;
  tags: string;
}

export const DefaultProject: Project = {
  id: '',
  name: '',
  details: '',
  rank: 1,
  tags: ''
}

export interface Countdown {
  id: string;
  name: string;
  date: string;
  tags: string;
}

export const DefaultCountdown: Countdown = {
  id: '',
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