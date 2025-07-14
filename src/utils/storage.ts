export const getRecordsFromStorage = (key: string, defaultData: unknown) => {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : defaultData;
}

export const clearStorage = (key?: string) => {
    if (key) {
        localStorage.removeItem(key);
    } else {

        localStorage.clear();
    }
}