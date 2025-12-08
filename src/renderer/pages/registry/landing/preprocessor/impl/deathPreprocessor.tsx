import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Swal, {SweetAlertOptions} from "sweetalert2";
import {ActionButton, BackButton} from "@components/buttons";
import { AnimalInformationTable } from "@components/tables/animalTable";
import AtrkkrTheme from "src/renderer/theme/AtrkkrTheme";


import {
  MISSING_FIELDS,
  PARSE_ERROR,
  ProcessFailure,
  ProcessSuccess,
} from "@app/api";

import { Box, Typography, } from "@mui/material"
import {DialogOutcome, handleResult, Result} from "@common/core";
import {AnimalDeath, DeathRecord} from "@app/api/src/dtos";
import {DeathError} from "@app/api/src/errorCodes/registryProcessing/deathCodes";


export const DeathPreprocessorPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentDeathRecord, setCurrentDeathRecord] = useState<DeathRecord>();

  const [animalIds, setAnimalIds] = useState<string[]>([]);


  const [hasLoadedFile, setHasLoadedFile] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deathDateMap, setDeathDateMap] = useState<Record<string, string>>({});


  /**
   * Opens a file dialog and loads the JSON file.
   */
  const selectAndLoadFile = async () => {

    try {
      setLoading(true);

      const parsingResult: DialogOutcome<DeathRecord, DeathError> = await window.registryAPI.parseDeaths();

      if (parsingResult.tag === 'cancel') {
        setLoading(false);
        return;
      }

      // show error in cases where it occurs
      if (parsingResult.tag === 'error') {
        await Swal.fire(
          getSwalErrParams(parsingResult.error)
        );
        return
      }

      let deathRecord : DeathRecord = parsingResult.data;
      setCurrentDeathRecord(deathRecord);

      const deathRows : AnimalDeath[] = deathRecord.deaths;

      let newAnimalIds : string[] = [];
      let newDeathMap : Record<string, string> = {};

      for (const deathRow of deathRows) {
        let animalId: string = deathRow.animalId;
        newAnimalIds.push(animalId);

        // also populate newDeathMap so information can be displayed on the animalInformationTable
        newDeathMap[animalId] = deathRow.deathDate;
      }
      setAnimalIds(newAnimalIds);
      setDeathDateMap(newDeathMap);


      setHasLoadedFile(true);

    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: err.message ?? "An unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submits the parsed & altered data to be validated & processed
   */
  const handleSubmit = async () => {
    if (loading || !currentDeathRecord) return;

    const processingResult : Result<ProcessSuccess, ProcessFailure> = await window.registryAPI.processDeaths(currentDeathRecord);

    await handleResult(processingResult, {
      success: (data: ProcessSuccess) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "OK",
          width: "40em",
          text: `${data.numberProcessed} Deaths processed successfully`,
        });

        navigate("/"); // nav back to home after processing
      },
      error: (processFailure: ProcessFailure) => {
        const errMsg = processFailure.errors.join("\n");

        Swal.fire({
          title: "Error",
          icon: "error",
          confirmButtonText: "OK",
          width: "40em",
          text: `There was an error processing deaths:\n${errMsg}`,
        });
      },
    });
    return;
  };

  return (
    <AtrkkrTheme>
      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          pb: "5em",
        }}
      >
        <BackButton onClick={() => navigate(-1)} />

        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            px: 4,
            pt: 2,
            pb: 3,
          }}
        >
          Preprocess Deaths
        </Typography>

        {/* --- Select File Button --- */}
        <Box px={4} mb={3}>
          <ActionButton
            label={loading ? "Loading..." : "Select Death JSON File"}
            onClick={selectAndLoadFile}
            disabled={loading}
            fullWidth
          />
        </Box>

        {hasLoadedFile && (
          <>
            {/* --- Animal Information Table --- */}
            <Box mb={4}>
              <Box px={4}>
                <Typography variant="h5" gutterBottom>
                  {animalIds.length === 1 ? "Animal" : "Animals"}
                </Typography>
              </Box>
              <AnimalInformationTable
                animalIds={animalIds}
                extraColumns={[
                  {
                    key: "deathDate",
                    header: "Death Date",
                    getValue: (animalId) => deathDateMap[animalId] ?? "—",
                  },
                ]}
                columnOrder={[
                  "registrationNumber",
                  "flockPrefix",
                  "name",
                  "birthDate",
                  "deathDate",
                  "coatColor",
                ]}
              />
            </Box>

            <Box px={4} mb={3}>
              <ActionButton
                label={loading ? "Loading..." : "Process Deaths"}
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
              />
            </Box>
          </>
        )}
      </Box>
    </AtrkkrTheme>
  );
};


export function getSwalErrParams(err: DeathError): SweetAlertOptions {
  switch (true) {

    case err.type === MISSING_FIELDS:
      return {
        title: "Missing Required Fields",
        text: "Some required fields were not provided.",
        icon: "warning",
        confirmButtonText: "Review",
      };

    case err.type === PARSE_ERROR:
      return {
        title: "Invalid Data",
        text: "The provided data could not be processed.",
        icon: "error",
        confirmButtonText: "Try Again",
      };

    default:
      return {
        title: "Unknown Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      };
  }
}