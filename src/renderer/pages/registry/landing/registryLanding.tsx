import { useNavigate } from "react-router-dom";

import React, { useEffect, useMemo } from "react";
import CollapsibleSection from "../../../components/collapsible/collapsible";
import { BackButton } from "../../../components/buttons/backButton";

import { useState } from "react";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import { handleResult } from '@common/core';
import { Species } from '@app/api';
import Swal from "sweetalert2";

import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import ActionButton from "src/renderer/components/buttons/actionButton";
import AtrkkrTheme from "src/renderer/theme/AtrkkrTheme";


const RegistryLanding: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showProccesors, setShowProccesors] = useState(true);

  const [species, setSpecies] = useState<Species[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const speciesOptions = species.map(s => (
    <MenuItem key={s.id} value={String(s.id)}>
      {s.common_name}
    </MenuItem>
  ));
  

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

  const handleSpecies = async (e: SelectChangeEvent<string>) => {
    const selectedId = e.target.value;
    const found: Species | null = species.find((s) => s.id === selectedId) || null;
  
    if (found != null) {
      setSelectedSpecies(found);
      await window.storeAPI.setSelectedSpecies(found);
    } else {
      setSelectedSpecies(null);
      await window.storeAPI.setSelectedSpecies(null);
    }
  };
  

  useEffect(() => {
    const loadData = async () => {

      const [
        speciesResult,
        storedSpecies,
      ] = await Promise.all([
        window.lookupAPI.getSpecies(),
        window.storeAPI.getSelectedSpecies()
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
    <AtrkkrTheme>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          p: 2,
        }}
      >
        {/* Back Button */}
        <Box mb={2}>
          <BackButton />
        </Box>

        {/* Species Selector */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="species-label">Species</InputLabel>
            <Select
              labelId="species-label"
              id="selectSpecies"
              label="Species"
              value={selectedSpecies?.id ?? ""}
              onChange={handleSpecies}
            >
              <MenuItem value="">
                <em>Select Species</em>
              </MenuItem>
              {speciesOptions}
            </Select>
          </FormControl>
        </Paper>

        {/* Processors Section */}
        <CollapsibleSection
          title="Processors"
          isOpen={showProccesors}
          onToggle={() => setShowProccesors(!showProccesors)}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 1
            }}
          >
            <ActionButton
              label="Process Birth Notifications"
              onClick={handleBirthNotifications}
            />

            <ActionButton
              label="Process Registrations"
              onClick={handleRegistrations}
            />

            <ActionButton
              label="Process Transfers"
              onClick={handleTransfers}
            />

            <ActionButton
              label="Process Deaths"
              onClick={handleDeaths}
            />
          </Box>
        </CollapsibleSection>

        <LoadingIndicator isLoading={isLoading} message="Processing..." />
      </Box>
    </AtrkkrTheme>
  );
};

export default RegistryLanding;
