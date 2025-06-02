import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="collapsible-section">
      <div className="collapsible-header" onClick={onToggle}>
        <h2>{title}</h2>
        <div className="icon-container">{isOpen ? <ChevronUp /> : <ChevronDown />}</div>
      </div>
      <hr />
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
