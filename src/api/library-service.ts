import api from "./api";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const backupRecordsByType = async (type: string) => {
  try {
    const result = await api.get(`/storage/library/backup?type=${type}`);

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const loadReadme = async (): Promise<string> => {
  try {
    const response = await api.get(`/storage/library/specific-type?type=readme`);

    if (response.data) {
      return response.data.records;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return "";
  }
};

export const useLoadReadme = () => {
  return useQuery<string, Error>({
    queryKey: ['readme'],
    queryFn: () => loadReadme(),
    enabled: true,
  });
};

export const loadRecordsByType = async <T = unknown>(type: string, shouldParse: boolean = true): Promise<T[]> => {
  try {
    const response = await api.get(`/storage/library/specific-type?type=${type}`);

    if (response.data) {
      return shouldParse ? JSON.parse(response.data.records) as T[] : response.data.records as T[];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const useLoadRecordsByType = <T = unknown>(type: string, shouldParse: boolean = true) => {
  return useQuery<T[], Error>({
    queryKey: ['load-records-by-type', type],
    queryFn: () => loadRecordsByType<T>(type, shouldParse),
    enabled: !!type,
  });
};

export const updateRecordsByType = async (payload: string, type: string) => {
  try {
    const response = await api.put('/storage/library/update-records', JSON.stringify({
      type: type,
      records: payload
    }));

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

export const useUpdateRecordsByType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, type }: { payload: string; type: string }) => updateRecordsByType(payload, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load-records-by-type'] });
    },
  });
};