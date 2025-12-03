import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  Box,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Snackbar,
  SelectChangeEvent,
} from "@mui/material";

import { ActionButton, BackButton } from "@components/buttons";
import CollapsibleSection from "@components/collapsible/collapsible";

import LoadingIndicator from "@components/loadingIndicator/loadingIndicator";
import { isRegistryDesktop } from "@app/buildVariant";
import { AnimalSearchRequest, AnimalSearchResult } from "@app/api";
import AtrkkrTheme from "src/renderer/theme/AtrkkrTheme";


const AnimalSearch: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    name: "",
    status: "",
    registrationNumber: "",
    birthStartDate: "",
    birthEndDate: "",
    deathStartDate: "",
    deathEndDate: "",
    federalTag: "",
    farmTag: "",
    isAlreadyPrinted: null,
  });

  const [results, setResults] = useState<AnimalSearchResult[]>([]);
  const [chosenAnimals, setChosenAnimals] = useState<AnimalSearchResult[]>([]);
  const [message, setMessage] = useState("Search for animals to display results.");
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [isSearchingForAnimals, setIsSearchingForAnimals] = useState(false);

  const [showSearch, setShowSearch] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [showChosen, setShowChosen] = useState(true);


  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name as string]: value === "" ? null : value === "true"
    }));
  };

  const fetchAndDisplayAnimals = async () => {
    if (isSearchingForAnimals) return;

    setIsSearchingForAnimals(true);

    try {
      const animalRequest: AnimalSearchRequest = {};
      Object.entries(searchParams).forEach(([key, val]) => {
        if (val !== "" && val !== null) {
          (animalRequest as any)[key] = val;
        }
      });

      const animals: AnimalSearchResult[] = await window.animalAPI.search(animalRequest);

      if (animals.length === 0) {
        setMessage("No animals found.");
        setResults([]);
      } else {
        setMessage("");
        setResults(animals);
      }
    } catch (err) {
      console.error("Animal search failed:", err);
      await Swal.fire("Error", "An error occurred while searching for animals.", "error");
    } finally {
      setIsSearchingForAnimals(false);
    }
  };

  const addToChosenAnimals = (animal: AnimalSearchResult) => {
    if (!chosenAnimals.some((a) => a.animal_id === animal.animal_id)) {
      setChosenAnimals([...chosenAnimals, animal]);
      setSelectionMessage(`${animal.name || "Animal"} selected`);
      setTimeout(() => setSelectionMessage(null), 3000);
    }
  };

  const removeFromChosenAnimals = (animalId: string) => {
    const removedAnimal = chosenAnimals.find((animal) => animal.animal_id === animalId);
    setChosenAnimals(chosenAnimals.filter((animal) => animal.animal_id !== animalId));

    if (removedAnimal) {
      setSelectionMessage(`${removedAnimal.name || "Animal"} removed from selection`);
      setTimeout(() => setSelectionMessage(null), 3000);
    }
  };

  const handleChooseAnimals = async () => {
    if (!chosenAnimals || chosenAnimals.length === 0) {
      await Swal.fire({
        title: "No animals selected",
        text: "You must select at least one animal before proceeding.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Confirm Selection`,
      text: `Would you like to select ${chosenAnimals.length} animal${
        chosenAnimals.length > 1 ? "s" : ""
      }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      navigate("/landing", { state: { chosenAnimals } });
    }
  };

  const uniqueResults: AnimalSearchResult[] = Array.from(
    new Map(results.map((animal) => [animal.animal_id, animal])).values()
  );

  return (
    <AtrkkrTheme>
      <Box sx={{ height: "100vh", overflowY: "auto", p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <BackButton onClick={() => navigate(-1)} />
        </Box>
  
        <Stack spacing={3}> 
          {/* SEARCH SECTION */}
          <CollapsibleSection
            title="Search for Animals"
            isOpen={showSearch}
            onToggle={() => setShowSearch(!showSearch)}
          >
            <Stack spacing={3} sx={{ maxHeight: 400, overflowY: "auto", p: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Animal Name"
                  id="name"
                  value={searchParams.name}
                  onChange={handleTextFieldChange}
                  fullWidth
                />
                <TextField
                  label="Registration Number"
                  id="registrationNumber"
                  value={searchParams.registrationNumber}
                  onChange={handleTextFieldChange}
                  fullWidth
                />
              </Stack>
    
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Birth Date (Start)"
                  type="date"
                  id="birthStartDate"
                  value={searchParams.birthStartDate}
                  onChange={handleTextFieldChange}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                />
                <TextField
                  label="Birth Date (End)"
                  type="date"
                  id="birthEndDate"
                  value={searchParams.birthEndDate}
                  onChange={handleTextFieldChange}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                />
                <TextField
                  label="Death Date (Start)"
                  type="date"
                  id="deathStartDate"
                  value={searchParams.deathStartDate}
                  onChange={handleTextFieldChange}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                />
                <TextField
                  label="Death Date (End)"
                  type="date"
                  id="deathEndDate"
                  value={searchParams.deathEndDate}
                  onChange={handleTextFieldChange}
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                />
              </Stack>
    
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Federal Tag"
                  id="federalTag"
                  value={searchParams.federalTag}
                  onChange={handleTextFieldChange}
                  fullWidth
                />
                <TextField
                  label="Farm Tag"
                  id="farmTag"
                  value={searchParams.farmTag}
                  onChange={handleTextFieldChange}
                  fullWidth
                />
              </Stack>
    
              {isRegistryDesktop() && (
                <FormControl fullWidth>
                  <InputLabel id="printed-select-label">Registrations Printed</InputLabel>
                  <Select
                    labelId="printed-select-label"
                    id="isAlreadyPrinted"
                    name="isAlreadyPrinted"
                    value={searchParams.isAlreadyPrinted ?? ""}
                    onChange={handleSelectChange}
                    label="Registrations Printed"
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="true">Printed</MenuItem>
                    <MenuItem value="false">Not Printed</MenuItem>
                  </Select>
                </FormControl>
              )}
    
              <ActionButton
                label={isSearchingForAnimals ? "Searching..." : "Search"}
                onClick={fetchAndDisplayAnimals}
                disabled={isSearchingForAnimals}
                fullWidth
              />

            </Stack>
          </CollapsibleSection>
    
          {/* RESULTS SECTION */}
          <CollapsibleSection
            title="Results"
            isOpen={showResults}
            onToggle={() => setShowResults(!showResults)}
          >
            <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 2 }}>
              {message && <Box mb={1}>{message}</Box>}
    
              {uniqueResults.length > 0 && (
                <TableContainer
                  component={Paper}
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    maxHeight: 400,
                    overflow: "auto",
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {[
                          "Select",
                          "Flock Prefix",
                          "Name",
                          "Registration Number",
                          "Birth Date",
                          "Death Date",
                          "Sex",
                          "Birth Type",
                          "Official ID",
                          "Farm ID",
                          "Sire Flock Prefix",
                          "Sire Name",
                          "Dam Flock Prefix",
                          "Dam Name",
                        ].map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              backgroundColor: "secondary.main",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.95rem",
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uniqueResults.map((animal) => (
                        <TableRow key={animal.animal_id} hover>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => addToChosenAnimals(animal)}
                            >
                              Select
                            </Button>
                          </TableCell>
                          <TableCell>{animal.flockPrefix}</TableCell>
                          <TableCell>{animal.name}</TableCell>
                          <TableCell>{animal.registration}</TableCell>
                          <TableCell>{animal.birthDate}</TableCell>
                          <TableCell>{animal.deathDate}</TableCell>
                          <TableCell>{animal.sex}</TableCell>
                          <TableCell>{animal.birthType}</TableCell>
                          <TableCell>{animal.latestOfficialID}</TableCell>
                          <TableCell>{animal.latestFarmID}</TableCell>
                          <TableCell>{animal.sireFlockPrefix}</TableCell>
                          <TableCell>{animal.sireName}</TableCell>
                          <TableCell>{animal.damFlockPrefix}</TableCell>
                          <TableCell>{animal.damName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </CollapsibleSection>
    
          {/* CHOSEN SECTION */}
          <CollapsibleSection
            title="Selected Animals"
            isOpen={showChosen}
            onToggle={() => setShowChosen(!showChosen)}
          >
            <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 2, pb: 2 }}>
              <Stack spacing={2}>
                <ActionButton
                  label="Choose Animals"
                  onClick={handleChooseAnimals}
                  fullWidth
                />
        
                  {chosenAnimals.length > 0 && (
                    <TableContainer
                      component={Paper}
                      elevation={3}
                      sx={{
                        borderRadius: 2,
                        maxHeight: 400,
                        overflow: "auto",
                      }}
                    >
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            {[
                              "Remove",
                              "Flock Prefix",
                              "Name",
                              "Registration Number",
                              "Birth Date",
                              "Death Date",
                              "Sex",
                              "Birth Type",
                              "Official ID",
                              "Farm ID",
                              "Sire Flock Prefix",
                              "Sire Name",
                              "Dam Flock Prefix",
                              "Dam Name",
                            ].map((header) => (
                              <TableCell
                                key={header}
                                sx={{
                                  backgroundColor: "secondary.main",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {header}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {chosenAnimals.map((animal) => (
                            <TableRow key={animal.animal_id} hover>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  onClick={() => removeFromChosenAnimals(animal.animal_id)}
                                >
                                  Remove
                                </Button>
                              </TableCell>
                              <TableCell>{animal.flockPrefix}</TableCell>
                              <TableCell>{animal.name}</TableCell>
                              <TableCell>{animal.registration}</TableCell>
                              <TableCell>{animal.birthDate}</TableCell>
                              <TableCell>{animal.deathDate}</TableCell>
                              <TableCell>{animal.sex}</TableCell>
                              <TableCell>{animal.birthType}</TableCell>
                              <TableCell>{animal.latestOfficialID}</TableCell>
                              <TableCell>{animal.latestFarmID}</TableCell>
                              <TableCell>{animal.sireFlockPrefix}</TableCell>
                              <TableCell>{animal.sireName}</TableCell>
                              <TableCell>{animal.damFlockPrefix}</TableCell>
                              <TableCell>{animal.damName}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Stack>
            </Box>
          </CollapsibleSection>
        </Stack>
  
        {/* Loading Indicator */}
        <LoadingIndicator isLoading={isSearchingForAnimals} message="Searching for animals..." />
  
        {/* Selection Snackbar */}
        <Snackbar
          open={!!selectionMessage}
          message={selectionMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
      </Box>
    </AtrkkrTheme>
  );
  
};

export default AnimalSearch;
