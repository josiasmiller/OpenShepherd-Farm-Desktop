import React, { useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {
  Box,
  Stack,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import { AnimalSearchResult } from "@app/api";
import Swal from "sweetalert2";

import CollapsibleSection from "../../../components/collapsible/collapsible";
import { BackButton } from "../../../components/buttons/backButton";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import { isRegistryDesktop } from "@app/buildVariant";
import AtrkkrTheme from "src/renderer/theme/AtrkkrTheme";


const LandingPage: React.FC = () => {
  const [showRegistryFeatures, setShowRegistryFeatures] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStr, setLoadingStr] = useState<string>("");
  const [signaturePath, setSignaturePath] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const chosenAnimals: AnimalSearchResult[] = location.state?.chosenAnimals || [];

  useEffect(() => {
    const loadData = async () => {
      const signatureFp = await window.storeAPI.getSelectedSignatureFilePath();
      if (signatureFp) setSignaturePath(signatureFp);
    };
    loadData();
  }, []);

  const getAnimalIds = (): string[] => chosenAnimals.map((animal) => animal.animal_id);

  const saveEvaluationHistoryCsv = async () => {
    await Swal.fire({
      title: "Not implemented (yet!)",
      text: "We are working on this functionality-- you should be able to use it soon :)",
      icon: "warning",
      confirmButtonText: "OK",
    });
  };

  const saveDrugHistoryCsv = async () => {
    if (isLoading) return;
    setLoadingStr("Saving Drug History...");
    setIsLoading(true);
    const success = await window.exportAPI.drugHistoryCsv(getAnimalIds());

    await Swal.fire({
      title: success ? "Success" : "Error",
      text: success ? "File saved successfully" : "There was an error saving the file",
      icon: success ? "success" : "error",
      confirmButtonText: "OK",
    });

    setIsLoading(false);
  };

  const saveNoteHistoryCsv = async () => {
    if (isLoading) return;
    setLoadingStr("Saving Note History...");
    setIsLoading(true);
    const success = await window.exportAPI.notesCsv(getAnimalIds());

    await Swal.fire({
      title: success ? "Success" : "Error",
      text: success ? "File saved successfully" : "There was an error saving the file",
      icon: success ? "success" : "error",
      confirmButtonText: "OK",
    });

    setIsLoading(false);
  };

  const saveTissueTestResultHistoryCsv = async () => {
    if (isLoading) return;
    setLoadingStr("Saving Tissue Test Results...");
    setIsLoading(true);
    const success = await window.exportAPI.tissueTestResultsCsv(getAnimalIds());

    await Swal.fire({
      title: success ? "Success" : "Error",
      text: success ? "File saved successfully" : "There was an error saving the file",
      icon: success ? "success" : "error",
      confirmButtonText: "OK",
    });

    setIsLoading(false);
  };

  const printRegistryPapers = async (registrationType: "black" | "white" | "chocolate") => {
    if (isLoading) return;
    setLoadingStr("Saving Registry Papers...");
    setIsLoading(true);

    const response = await window.exportAPI.registration(getAnimalIds(), registrationType, signaturePath ?? null);

    if (response.success) {
      const warningHtml = response.warnings.length
          ? `<div style="text-align: left;"><h4>Warnings:</h4><ul>${response.warnings.map((w) => `<li>${w}</li>`).join("")}</ul></div>`
          : "";

      const result = await Swal.fire({
        title: "Success",
        html: `PDF saved successfully.<br/><br/>${warningHtml}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Open Folder",
        cancelButtonText: "OK",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        window.systemAPI.openDirectory(response.resultingDirectory);
      }
    } else {
      const errorListHtml = response.errors.map((e) => `<li>${e}</li>`).join("");
      await Swal.fire({
        title: "Error",
        html: `<p>There was an error saving the file:</p><ul>${errorListHtml}</ul>`,
        icon: "error",
        confirmButtonText: "Continue",
      });
    }

    setIsLoading(false);
  };

  const handleChooseSignature = async () => {
    const fp = await window.systemAPI.selectPngFile();
    if (fp) {
      setSignaturePath(fp);
      await window.storeAPI.setSelectedSignatureFilePath(fp);
    }
  };

  return (
    <AtrkkrTheme>
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <BackButton onClick={() => navigate(-1)} />
        </Box>

        {/* Top Section */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h4">Landing Page</Typography>
          <Typography>You selected {chosenAnimals.length} animals.</Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" onClick={saveEvaluationHistoryCsv}>
              Evaluation History
            </Button>
            <Button variant="contained" onClick={saveDrugHistoryCsv}>
              Drug History
            </Button>
            <Button variant="contained" onClick={saveNoteHistoryCsv}>
              Note History
            </Button>
            <Button variant="contained" onClick={saveTissueTestResultHistoryCsv}>
              Tissue Test Result History
            </Button>
          </Stack>
        </Stack>

        {/* Registry Features */}
        {isRegistryDesktop() && (
            <CollapsibleSection
                title="Registry Features"
                isOpen={showRegistryFeatures}
                onToggle={() => setShowRegistryFeatures(!showRegistryFeatures)}
            >
              <Stack spacing={2} sx={{ mt: 2, pb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="contained" onClick={handleChooseSignature}>
                    Choose Signature Image
                  </Button>
                  {signaturePath && <Typography>Selected: {signaturePath}</Typography>}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button variant="contained" onClick={() => printRegistryPapers("black")}>
                    Print Black Welsh Registration
                  </Button>
                  <Button variant="contained" onClick={() => printRegistryPapers("white")}>
                    Print White Welsh Registration
                  </Button>
                  <Button variant="contained" onClick={() => printRegistryPapers("chocolate")}>
                    Print Chocolate Welsh Registration
                  </Button>
                </Stack>
              </Stack>
            </CollapsibleSection>
        )}

        {/* Chosen Animals Table */}
        {chosenAnimals.length > 0 && (
            <Box sx={{ mt: 4, maxHeight: 400, overflowY: "auto" }}>
              <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Name", "Birth Date", "Death Date", "Sex", "Birth Type", "Sire Name", "Dam Name"].map((header) => (
                          <TableCell key={header} sx={{ fontWeight: "bold", backgroundColor: "primary.main", color: "white" }}>
                            {header}
                          </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chosenAnimals.map((animal) => (
                        <TableRow key={animal.animal_id} hover>
                          <TableCell>{animal.name}</TableCell>
                          <TableCell>{animal.birthDate}</TableCell>
                          <TableCell>{animal.deathDate}</TableCell>
                          <TableCell>{animal.sex}</TableCell>
                          <TableCell>{animal.birthType}</TableCell>
                          <TableCell>{animal.sireName}</TableCell>
                          <TableCell>{animal.damName}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
        )}

        {/* Loading Indicator */}
        <LoadingIndicator isLoading={isLoading} message={loadingStr} />
      </Box>
    </AtrkkrTheme>
  );
};

export default LandingPage;
