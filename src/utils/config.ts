export const getIsDemoMode = () => {
  return import.meta.env.VITE_APP_IS_DEMO === 'yes';
}