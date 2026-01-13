import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import Swal, {SweetAlertOptions} from "sweetalert2";
import {ActionButton, BackButton} from "@components/buttons";
import {BirthsTable} from "./birthTable"

import {
  BirthRecord,
  BirthError,
  Species,
  MISSING_FIELDS,
  PARSE_ERROR,
  ProcessSuccess,
  ProcessFailure,
} from "@app/api";

import { Box, Typography, } from "@mui/material"
import {Fulfillment, handleResult, Result} from "@common/core";
import AtrkkrTheme from "src/renderer/theme/AtrkkrTheme";
import {AnimalInformationTable} from "@components/tables/animalTable";


export const BirthPreprocessorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentBirthRecord, setCurrentBirthRecord] = useState<BirthRecord>();

  const [hasLoadedFile, setHasLoadedFile] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigationState = location.state as { species?: Species };
  const species : Species = navigationState?.species!;

  const parentIds = React.useMemo(() => {
    if (!currentBirthRecord?.rows) return [];

    const ids = new Set<string>();

    currentBirthRecord.rows.forEach(row => {
      if (row.sireId) ids.add(row.sireId);
      if (row.damId) ids.add(row.damId);
    });

    return Array.from(ids);
  }, [currentBirthRecord]);


  /**
   * Opens a file dialog and loads the JSON file.
   */
  const selectAndLoadFile = async () => {

    try {
      setLoading(true);

      const parsingResult: Fulfillment<BirthRecord, BirthError> = await window.registryAPI.parseBirths();

      if (parsingResult.tag === 'cancel') {
        return;
      }

      if (parsingResult.tag === "error") {
        // display error to user
        await Swal.fire(
          getSwalErrParams(parsingResult.error)
        );
        return;
      }

      let birthRecord : BirthRecord = parsingResult.data;

      setCurrentBirthRecord(birthRecord);
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
    if (loading || !currentBirthRecord) return;

    const processingResult : Result<ProcessSuccess, ProcessFailure> = await window.registryAPI.processBirths(currentBirthRecord, species);

    await handleResult(processingResult, {
      success: (data: ProcessSuccess) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "OK",
          width: "40em",
          text: `${data.numberProcessed} Birth Notifications processed successfully`,
        });

        navigate("/"); // nav back to home after processing
      },
      error: (processFailure: ProcessFailure) => {
        const errorItems = processFailure.errors
          .map(err => `<div class="swal-error-item">${err}</div>`)
          .join("");

        Swal.fire({
          title: "Error",
          icon: "error",
          width: "40em",
          html: `
            <p>There was an error processing births:</p>
            <div class="swal-error-list">
              ${errorItems}
            </div>
          `,
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
          Preprocess Births
        </Typography>

        {/* --- Select File Button --- */}
        <Box px={4} mb={3}>
          <ActionButton
            label={loading ? "Loading..." : "Select Births JSON File"}
            onClick={selectAndLoadFile}
            disabled={loading}
            fullWidth
          />
        </Box>

        {hasLoadedFile && (
          <>
            <Box px={4} mb={3}>
              <ActionButton
                label={loading ? "Loading..." : "Process Births"}
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
              />
            </Box>

            {/* --- Animal Information Table --- */}
            <Box mb={4}>
              <Box px={4}>
                <Typography variant="h5" gutterBottom>
                  Parents
                </Typography>
              </Box>
              <Box px={2}>
                <AnimalInformationTable animalIds={parentIds} />
              </Box>
            </Box>


            <Box px={4}>
              <BirthsTable rows={currentBirthRecord?.rows ?? []} />
            </Box>
          </>
        )}

      </Box>
    </AtrkkrTheme>
  );
};


export function getSwalErrParams(err: BirthError): SweetAlertOptions {
  switch (err.type) {
    case MISSING_FIELDS: {
      const errText = (err.missing ?? []).join("\n");
      return {
        title: "Missing Required Fields",
        text: errText,
        icon: "warning",
        confirmButtonText: "Review",
      };
    }
    case PARSE_ERROR:
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
