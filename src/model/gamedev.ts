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

export interface Interval {
  name: string;
  origin: string;
  links: string;
  details: string;
  tags: string;
}

export const DefaultInterval: Interval = {
  name: '',
  origin: '',
  links: '',
  details: '',
  tags: ''
};
