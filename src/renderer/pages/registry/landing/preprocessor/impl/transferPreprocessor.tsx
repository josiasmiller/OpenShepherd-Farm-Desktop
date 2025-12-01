import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Swal, { SweetAlertOptions } from "sweetalert2";
import { BackButton } from "../../../../../components/backButton/backButton";
import { AnimalInformationTable } from "../../../../../components/tables/animalTable";
import { DateDisplay } from "../../../../../components/informationDisplay/dateDisplay";
import { OwnerInformationTable, OwnerInformationTableProps  } from "../../../../../components/tables/ownerTable";
import {
  TransferRecord,
  TransferError,
  ExistingMemberBuyer,
  OwnerType,
  Species,
  DIALOG_CANCELLED,
  MISSING_FIELDS,
  PARSE_ERROR,
  NEW_BUYER_NOT_SUPPORTED,
} from "@app/api";

import { Box, Typography, } from "@mui/material"
import { handleResult, Result } from "@common/core";


export const TransferPreprocessorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTransferRecord, setCurrentTransferRecord] = useState<TransferRecord>();

  const [animalIds, setAnimalIds] = useState<string[]>([]);
  const [buyers, setBuyers] = useState<OwnerInformationTableProps["owners"]>([]);
  const [sellers, setSellers] = useState<OwnerInformationTableProps["owners"]>([]);
  const [soldAt, setSoldAt] = useState<string>("");
  const [movedAt, setMovedAt] = useState<string>("");

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

      const parsingResult: Result<TransferRecord, TransferError> = await window.registryAPI.parseTransfers();

      let isSuccess : boolean = false;
      let errType : TransferError = null;
      let transferRecord : TransferRecord = null;

      await handleResult(parsingResult, {
        success: (data: TransferRecord) => {
          isSuccess = true;
          transferRecord = data; // this is needed for processing further in this file, otherwise a race condition of sorts crops up
          setCurrentTransferRecord(data);
        },
        error: (err: TransferError) => {
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

      const { animals, seller, buyer } = transferRecord;

      let newAnimalIds : string[] = [];

      for (const animalRow of animals) {
        let animalId: string = animalRow.animalId;
        newAnimalIds.push(animalId);
      }

      setAnimalIds(newAnimalIds);


      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // --- Buyer Information ---
      // For now, assume all buyers are existing members
      const existingMem: ExistingMemberBuyer = buyer as ExistingMemberBuyer;

      const buyerList: OwnerInformationTableProps["owners"] = [];

      const buyerContactId = existingMem.contactId;
      const buyerCompanyId = existingMem.companyId;

      if (buyerContactId) {
        buyerList.push({
          ownerId: buyerContactId,
          ownerType: OwnerType.CONTACT,
        });
      }

      if (buyerCompanyId) {
        buyerList.push({
          ownerId: buyerCompanyId,
          ownerType: OwnerType.COMPANY,
        });
      }

      setBuyers(buyerList);
      // end buyer setup
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // --- Seller Information ---

      const sellerList: OwnerInformationTableProps["owners"] = [];

      const sellerContactId = seller.contactId;
      const sellerCompanyId = seller.companyId;

      if (sellerContactId) {
        sellerList.push({ 
          ownerId: sellerContactId, 
          ownerType: OwnerType.CONTACT
        });
      }

      if (sellerCompanyId) {
        sellerList.push({
          ownerId: sellerCompanyId, 
          ownerType: OwnerType.COMPANY 
        });
      }

      setSellers(sellerList);

      // end seller setup
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      setSoldAt(seller.soldAt);
      setMovedAt(seller.movedAt);

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

    const processingResult : Result<number, string> = await window.registryAPI.processTransfers(currentTransferRecord);

    await handleResult(processingResult, {
      success: (data: number) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          confirmButtonText: "OK",
          width: "40em",
          text: `${data} Transfers processed successfully`,
        });

        navigate("/"); // nav back to home after processing
      },
      error: (_: string) => {
        Swal.fire({
          title: "Error",
          icon: "error",
          confirmButtonText: "OK",
          width: "40em",
          text: "There was an error processing transfers.",
        });
      },
    });

    return;
  };

  return (
    <div style={{ height: "100vh", overflowY: "auto", paddingBottom: "5em" }}>
      <BackButton />
      <h1 className="app-header">Preprocess Transfers</h1>

      <div className="padded-horizontal-lg" style={{ marginBottom: "3em" }}>
        <button
          className="wide-button"
          onClick={selectAndLoadFile}
          disabled={loading}
        >
          {loading ? "Loading..." : "Select Transfer JSON File"}
        </button>
      </div>

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

          {/* --- Buyer Table --- */}
          <Box mb={4}>
            <Box px={4}>
              <Typography variant="h5" gutterBottom>
                Buyer
              </Typography>
            </Box>
            <OwnerInformationTable owners={buyers} />
          </Box>

          {/* --- Seller Table --- */}
          <Box mb={4}>
            <Box px={4}>
              <Typography variant="h5" gutterBottom>
                Seller
              </Typography>
            </Box>
            <OwnerInformationTable owners={sellers} />
          </Box>

          {/* --- Sold / Moved Dates --- */}
          <Box px={4} mb={6}>
            <Box display="flex" gap={4} alignItems="center">
              <DateDisplay title="Sold At" value={soldAt} />
              <DateDisplay title="Moved At" value={movedAt} />
            </Box>
          </Box>

          {/* --- Continue Button --- */}
          <div className="padded-horizontal-lg" style={{ paddingBottom: '8em' }}>
            <button className='wide-button' onClick={handleSubmit}>{loading ? 'Loading...' : 'Continue'}</button>
          </div>
        </>
      )}

    </div>
  );
};

export function getSwalErrParams(err: TransferError): SweetAlertOptions {
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

    case err.type === NEW_BUYER_NOT_SUPPORTED:
      return {
        title: "Unsupported Transfer",
        text: "Transfers involving a new buyer are not supported yet.",
        icon: "error",
        confirmButtonText: "Understood",
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