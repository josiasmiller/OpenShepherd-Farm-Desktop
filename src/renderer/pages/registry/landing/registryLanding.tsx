import { useNavigate } from "react-router-dom";

import React from "react";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { useState } from "react";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";


const RegistryLanding: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [showProccesors, setShowProccesors] = useState(true);

  const handleBirthNotifications = () => {
    if (isLoading) return;

    navigate('/registry/preprocess/births');
  };

  return (
    <div>
      <CollapsibleSection
        title="Processors"
        isOpen={showProccesors}
        onToggle={() => setShowProccesors(!showProccesors)}
      >
        <div className="action-buttons registry-section">
          <button className="forward-button" onClick={handleBirthNotifications}>
            Handle Birth Notifications
          </button>

        </div>
      </CollapsibleSection>

      <LoadingIndicator
        isLoading={isLoading}
        message="Processing..."
      />
      
    </div>
  );
};

export default RegistryLanding;
