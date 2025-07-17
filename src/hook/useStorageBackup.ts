import { useState, useEffect } from 'react';
import { loadRecordsByType, updateRecordsByType } from '../api/library-service';
import { getRecordsFromStorage } from '../utils/storage';

function useStorage<T>(type: string, defaultData: T[]) {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [response, setResponse] = useState<{ hasError: boolean, message: string }>({ hasError: false, message: '' });
    const { isBackendAvailable, isLoadingPing } = useStorageContext();

    useEffect(() => {
        if (isBackendAvailable && isLoading) {
            loadRecordsByType(type).then((records: T[]) => {
                setData(records);
                setIsLoading(false);
            });
        }
        if (!isBackendAvailable && !isLoadingPing) {
            const savedFavorites = getRecordsFromStorage(type, [...defaultData]);
            setData(savedFavorites);
            setIsLoading(false);
        }
    }, [isBackendAvailable, isLoadingPing, isLoading, type, defaultData]);

    const handleMutate = async (payload: T[]) => {
        if (!isBackendAvailable && !isLoadingPing) {
            localStorage.setItem(type, JSON.stringify(payload));
        } else {
            updateRecordsByType(JSON.stringify(payload), type)
                .then((isSuccess: boolean) => {
                    if (isSuccess) {
                        setResponse({ hasError: false, message: 'Successfully updated' });
                        setTimeout(() => setResponse({ hasError: false, message: '' }), 2500);
                    } else {
                        setResponse({ hasError: true, message: 'Failed to update' });
                        setTimeout(() => setResponse({ hasError: false, message: '' }), 2500);
                    }
                })
                .catch((error: unknown) => {
                    setResponse({ hasError: true, message: 'Failed to update' });
                    setTimeout(() => setResponse({ hasError: false, message: '' }), 2500);
                    console.error('Error:', error);
                })
        }
        setData(payload);
    };

    return { data, isLoading, handleMutate, response };
};

export default useStorage;