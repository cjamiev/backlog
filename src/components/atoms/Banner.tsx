import React from 'react';

interface BannerProps {
  isVisible: boolean;
  type: string;
  defaultMessage?: string;
}

const getBannerClassName = (type: string) => {
  if (type === 'success') {
    return { message: 'Saved successfully!', className: 'banner banner-success' };
  } else {
    return { message: 'Error on attempt to save', className: 'banner banner-error' };
  }
};

const Banner: React.FC<BannerProps> = ({ isVisible, type, defaultMessage }) => {
  const { message, className } = getBannerClassName(type);

  if (!isVisible) return null;
  return <div className={className}>{defaultMessage ? defaultMessage : message}</div>;
};

export default Banner;
