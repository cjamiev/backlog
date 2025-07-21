import type { Password, PasswordHistory } from "../model/password";

export const getCSV = (records: object[]) => {
  if (records.length === 0) return '';
  const header = Object.keys(records[0]);
  const rows = records.map(rec => Object.values(rec).join(","));
  return [header.join(','), ...rows].join('\n');
};

export const getJSON = (records: object[]) => {
  if (records.length === 0) return '';
  return JSON.stringify(records, null, 2);
};

export const getPasswordHistory = (selectedPassword: Password, isClone?: boolean): string => {
  if (isClone) {
    return '[]';
  }
  const currentPasswordHistory: PasswordHistory[] = JSON.parse(selectedPassword.history);
  const updatePasswordHistory: PasswordHistory[] = currentPasswordHistory.concat({ password: selectedPassword.password, createdDate: selectedPassword.createdDate });

  return JSON.stringify(updatePasswordHistory);
}