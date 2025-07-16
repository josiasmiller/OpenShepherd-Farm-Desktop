import { useNavigate } from "react-router-dom";

import React, { useEffect, useMemo } from "react";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { useState } from "react";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import { handleResult } from "../../../../shared/results/resultTypes";
import { Species } from "../../../../database";


const RegistryLanding: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showProccesors, setShowProccesors] = useState(true);

  const [species, setSpecies] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const speciesOptions = useMemo(() => (
    species.map((spec) => (
      <option key={spec.id} value={spec.id}>
        {spec.common_name}
      </option>
    ))
  ), [species]);

  const handleBirthNotifications = () => {
    if (isLoading) return;

    navigate('/registry/preprocess/births');
  };

  useEffect(() => {
    const loadData = async () => {

      const [
        speciesResult,
      ] = await Promise.all([
        window.electronAPI.getSpecies(),
      ]);

      handleResult(speciesResult, {
        success: (data: Species[]) => {
          setSpecies(data);
        },
        error: (err) => {
          console.error("Failed to fetch species:", err);
        },
      });
    }; // end loadData definition
  
    loadData();
  }, []); 

  return (
    <div>

      <div className="padded-horizontal-lg search-filters">
        <label htmlFor="selectSpecies">Species</label>
        {/* <select id="selectSpecies" value={searchParams.registrationType} onChange={handleChange}> */}
        <select id="selectSpecies" value={selectedSpecies?.id} onChange={() => {setSelectedSpecies(selectedSpecies)}}>
          <option value="">Select Species</option>
          {speciesOptions}
        </select>
      </div>


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
