import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from "./api";
import type { Password } from "../model/password";
import { getRecordsFromStorage } from '../utils/storage';
import { getIsDemoMode } from '../utils/config';

export const backupPasswords = async () => {
  try {
    const result = await api.get('/storage/password/backup');

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const loadPasswords = async (): Promise<Password[]> => {
  if (getIsDemoMode()) {
    return getRecordsFromStorage('passwords', []);
  }

  try {
    const response = await api.get(`/storage/password/`);

    if (response.data) {
      return response.data.filter((item: Password) => !item.tags.includes('archived'));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const useLoadPasswords = () => {
  return useQuery<Password[], Error>({
    queryKey: ['load-passwords'],
    queryFn: () => loadPasswords(),
  });
};

export const addNewPassword = async (payload: Password) => {
  if (getIsDemoMode()) {
    const currentPasswords: Password[] = getRecordsFromStorage('passwords', []);
    const updatePasswords = currentPasswords.concat(payload);
    localStorage.setItem('passwords', JSON.stringify(updatePasswords));
    return true;
  }

  try {
    const response = await api.post('/storage/password/', JSON.stringify(payload));

    if (response) {
      return true
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const useAddNewPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload }: { payload: Password; }) => addNewPassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load-passwords'] });
    },
  });
};

export const updatePassword = async (payload: Password) => {
  if (getIsDemoMode()) {
    const currentPasswords: Password[] = getRecordsFromStorage('passwords', []);
    const updatePasswords = currentPasswords.map(item => {
      if (item.id === payload.id) {
        return payload
      } else {
        return item;
      }
    });
    localStorage.setItem('passwords', JSON.stringify(updatePasswords));
    return true;
  }

  try {
    const response = await api.put('/storage/password/update', JSON.stringify(payload));

    if (response) {
      return true
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload }: { payload: Password; }) => updatePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load-passwords'] });
    },
  });
};