import api from "./api";

export const pingBackend = async () => {
  try {
    const result = await api.get('/health/ping');

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const backupAllRecords = async () => {
  try {
    const result = await api.get('library/backup');

    if (result) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export const loadRecordsByType = async (type: string, shouldParse: boolean = true) => {
  try {
    const response = await api.get(`/library/specific-type?type=${type}`);

    if (response.data) {
      return shouldParse ? JSON.parse(response.data.records) : response.data.records;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const updateRecordsByType = async (payload: string, type: string) => {
  try {
    const response = await api.put('library/update-records', JSON.stringify({
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