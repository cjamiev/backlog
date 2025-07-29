import React from 'react';

interface BannerProps {
  isVisible: boolean;
  type: string;
  message: string;
}

const getBannerClassName = (type: string) => {
  if (type === 'success') {
    return 'banner banner-success';
  } else {
    return 'banner banner-error';
  }
};

const Banner: React.FC<BannerProps> = ({ isVisible, type, message }) => {
  const className = getBannerClassName(type);

  if (!isVisible) return null;
  return <div className={className}>{message}</div>;
};

export default Banner;
