import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import Swal, {SweetAlertOptions} from "sweetalert2";
import {ActionButton, BackButton} from "@components/buttons";
import { AnimalInformationTable } from "@components/tables/animalTable";
import AtrkkrTheme from "src/renderer/theme/AtrkkrTheme";


import {
    Species,
    DIALOG_CANCELLED,
    MISSING_FIELDS,
    PARSE_ERROR,
} from "@app/api";

import { Box, Typography, } from "@mui/material"
import { handleResult, Result } from "@common/core";
import {AnimalDeath, DeathRecord} from "@app/api/src/dtos";
import {DeathError} from "@app/api/src/errorCodes/registryProcessing/deathCodes";


export const DeathPreprocessorPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [currentDeathRecord, setCurrentDeathRecord] = useState<DeathRecord>();

    const [animalIds, setAnimalIds] = useState<string[]>([]);


    const [hasLoadedFile, setHasLoadedFile] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigationState = location.state as { species?: Species };
    const species : Species = navigationState?.species!;

    /**
     * Opens a file dialog and loads the JSON file.
     */
    const selectAndLoadFile = async () => {

        try {
            setLoading(true);

            const parsingResult: Result<DeathRecord, DeathError> = await window.registryAPI.parseDeaths();

            let isSuccess : boolean = false;
            let errType : DeathError = null;
            let deathRecord : DeathRecord = null;

            await handleResult(parsingResult, {
                success: (data: DeathRecord) => {
                    isSuccess = true;
                    deathRecord = data; // this is needed for processing further in this file, otherwise a race condition of sorts crops up
                    setCurrentDeathRecord(data);
                },
                error: (err: DeathError) => {
                    errType = err;
                },
            });

            // handle err cases
            if (!isSuccess) {
                if (errType.type == DIALOG_CANCELLED) { // dont display err on dialog cancel as this is an expected user input
                    return
                }

                // display error to user
                await Swal.fire(
                    getSwalErrParams(errType)
                );
                return
            }

            const deathRows : AnimalDeath[] = deathRecord.deaths;

            let newAnimalIds : string[] = [];

            for (const deathRow of deathRows) {
                let animalId: string = deathRow.animalId;
                newAnimalIds.push(animalId);
            }
            setAnimalIds(newAnimalIds);


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
        if (loading) return;

        const processingResult : Result<number, string> = await window.registryAPI.processDeaths(currentDeathRecord);

        await handleResult(processingResult, {
            success: (data: number) => {
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    confirmButtonText: "OK",
                    width: "40em",
                    text: `${data} Deaths processed successfully`,
                });

                navigate("/"); // nav back to home after processing
            },
            error: (errMsg: string) => {
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
                                    Animal(s)
                                </Typography>
                            </Box>
                            <AnimalInformationTable animalIds={animalIds} />
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
        case err.type === DIALOG_CANCELLED:
            return {
                title: "Cancelled",
                text: "The operation was cancelled by the user.",
                icon: "info",
                confirmButtonText: "OK",
            };

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