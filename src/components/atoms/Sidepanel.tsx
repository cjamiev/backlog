import React, { type ReactNode } from 'react';

interface SidepanelProps {
  isOpen: boolean;
  isWide?: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
}

const Sidepanel: React.FC<SidepanelProps> = ({ isWide, isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={isWide ? "sidebar sidebar-wide" : "sidebar"}>
      <div className="sidebar-header">
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="sidebar-title">{title}</div>
      </div>
      {children}
    </div>
  );
};

export default Sidepanel;
