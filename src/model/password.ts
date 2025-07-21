export interface PasswordHistory {
  password: string;
  createdDate: string;
}

export interface Password {
  id: string;
  username: string;
  password: string;
  url: string;
  createdDate: string;
  tags: string;
  history: string;
}

export const DefaultPassword: Password = {
  id: '',
  username: '',
  password: '',
  url: '',
  createdDate: '',
  tags: '',
  history: ''
}
