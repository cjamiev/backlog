export interface Purchase {
  name: string;
  description: string;
  price: string;
  rank: number;
  link: string;
  tags: string;
}

export const DefaultPurchase: Purchase = {
  name: '',
  description: '',
  price: '',
  rank: 1,
  link: '',
  tags: ''
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