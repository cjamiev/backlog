import React from 'react';
import type { ReactNode } from 'react';

interface FooterProps {
  children?: ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return <div className="page-footer">{children}</div>;
};

export default Footer;
