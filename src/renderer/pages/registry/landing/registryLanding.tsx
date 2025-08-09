import { useNavigate } from "react-router-dom";

import React, { useEffect, useMemo } from "react";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { useState } from "react";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import { handleResult } from "../../../../shared/results/resultTypes";
import { Species } from "../../../../database";
import Swal from "sweetalert2";

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

    if (!selectedSpecies) {
      Swal.fire({
        icon: 'warning',
        title: 'Species Required',
        text: 'Please select a species before continuing.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (isLoading) return;

    navigate('/registry/preprocess/births', { state: { species: selectedSpecies } });
  };

  const handleRegistrations = () => {

    if (!selectedSpecies) {
      Swal.fire({
        icon: 'warning',
        title: 'Species Required',
        text: 'Please select a species before continuing.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (isLoading) return;

    navigate('/registry/preprocess/registrations', { state: { species: selectedSpecies } });
  };

  const handleTransfers = () => {

    if (!selectedSpecies) {
      Swal.fire({
        icon: 'warning',
        title: 'Species Required',
        text: 'Please select a species before continuing.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (isLoading) return;
    navigate('/registry/preprocess/transfers', { state: { species: selectedSpecies } });
  };

  const handleDeaths = () => {

    if (!selectedSpecies) {
      Swal.fire({
        icon: 'warning',
        title: 'Species Required',
        text: 'Please select a species before continuing.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (isLoading) return;
    navigate('/registry/preprocess/deaths', { state: { species: selectedSpecies } });
  };

  const handleSpecies = async (e : React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found : Species | null = species.find((s) => s.id === selectedId) || null;
    if (found != null) {
      setSelectedSpecies(found);
      await window.electronAPI.setStoreSelectedSpecies(found);
    }
  }

  useEffect(() => {
    const loadData = async () => {

      const [
        speciesResult,
        storedSpecies,
      ] = await Promise.all([
        window.electronAPI.getSpecies(),
        window.electronAPI.getStoreSelectedSpecies()
      ]);

      handleResult(speciesResult, {
        success: (data: Species[]) => {
          setSpecies(data);

          if (storedSpecies) {
            setSelectedSpecies(storedSpecies);
          }

        },
        error: (err) => {
          console.error("Failed to fetch species:", err);
        },
      });

      // check if the storedSpecies was found and that it is a valid species in the existing list
      if (storedSpecies != null && species.some((s) => s.id === storedSpecies.id)) {
        setSelectedSpecies(storedSpecies);
      }
    }; // end loadData definition
  
    loadData();
  }, []); 



  return (
    <div>

      <div className="padded-horizontal-lg search-filters">
        <label htmlFor="selectSpecies">Species</label>
        {/* <select id="selectSpecies" value={searchParams.registrationType} onChange={handleChange}> */}
        <select
          id="selectSpecies"
          value={selectedSpecies?.id ?? ''}
          onChange={handleSpecies}
        >
          <option value="">Select Species</option>
          {speciesOptions}
        </select>
      </div>


      <CollapsibleSection
        title="Processors"
        isOpen={showProccesors}
        onToggle={() => setShowProccesors(!showProccesors)}
      >
        <div className="action-buttons registry-section" 
             style={{ display: 'flex', flexWrap: 'wrap', gap: '1em' }}
        >
          <button
            className="forward-button"
            onClick={handleBirthNotifications}
          >
            Process Birth Notifications
          </button>

          <button
            className="forward-button"
            onClick={handleRegistrations}
          >
            Process Registrations
          </button>

          <button
            className="forward-button"
            onClick={handleTransfers}
          >
            Process Tranfers
          </button>

          <button
            className="forward-button"
            onClick={handleDeaths}
          >
            Process Deaths
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
