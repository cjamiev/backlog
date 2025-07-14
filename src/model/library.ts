export enum GENDER_TYPE {
  male,
  female,
  other
}

export interface Name {
  value: string;
  gender: GENDER_TYPE;
  origin: string;
}

export const DefaultName: Name = {
  value: '',
  gender: GENDER_TYPE.male,
  origin: ''
};

export enum WORD_TYPE {
  noun,
  adjective,
  verb
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
  type: WORD_TYPE.noun,
  tags: ''
};

export enum WORD_PART_TYPE {
  suffix,
  prefix,
  vowel,
  consonant,
}

export interface WordPart {
  value: string;
  definition: string;
  type: WORD_PART_TYPE;
}

export const DefaultWordPart: WordPart = {
  value: '',
  definition: '',
  type: WORD_PART_TYPE.prefix,
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

export enum FAVORITE_TYPE {
  art,
  music,
  game,
  programming,
  entertainment,
  other
}

export interface Favorite {
  name: string;
  link: string;
  type: FAVORITE_TYPE;
  tags: string;
  notes: string;
}

export const DefaultFavorite: Favorite = {
  name: '',
  link: '',
  type: FAVORITE_TYPE.other,
  tags: '',
  notes: ''
}

export interface Project {
  id: string;
  name: string;
  details: string;
  rank: number;
}

export const DefaultProject: Project = {
  id: '',
  name: '',
  details: '',
  rank: 1
}

export interface Countdown {
  id: string;
  name: string;
  date: string;
}

export const DefaultCountdown: Countdown = {
  id: '',
  name: '',
  date: ''
}

export interface Password {
  name: string;
  username: string;
  password: string;
  updatedDate: string;
  link: string;
}

export const DefaultPassword: Password = {
  name: '',
  username: '',
  password: '',
  updatedDate: '',
  link: '',
}