import { trackerTypes, entertainmentTypes } from '../constants/records';
import { mockedData } from '../mocked';

export const loadMockData = (type: string) => {
  const payload = mockedData.find(i => i.type === type)?.data;
  localStorage.setItem(type, JSON.stringify(payload));
}

export const loadAllMockData = () => {
  trackerTypes.forEach(type => {
    loadMockData(type);
  });
  entertainmentTypes.forEach(type => {
    loadMockData(type);
  });
}

export const initializeApp = () => {
  const isInitialized = localStorage.getItem('app-initialized');

  if (isInitialized != 'y') {
    loadAllMockData();
    localStorage.setItem('app-initialized', 'y');
  }
}
