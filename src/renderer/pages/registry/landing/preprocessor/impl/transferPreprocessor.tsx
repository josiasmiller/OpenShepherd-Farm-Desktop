import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import { BackButton } from "../../../../../components/backButton/backButton";
import { AnimalInformationTable } from "../../../../../components/tables/animalTable";
import { DateDisplay } from "../../../../../components/informationDisplay/dateDisplay";
import { OwnerInformationTable, OwnerInformationTableProps  } from "../../../../../components/tables/ownerTable";
import {
  TransferParseResponse,
  ParseResult,
  ExistingMemberBuyer,
  OwnerType,
  Species,
  RegistryProcessType,
  RegistryProcessRequest,
  ProcessingResult,
  DIALOG_CANCELLED,
} from "@app/api";

import { Box, Typography, } from "@mui/material"


export const TransferPreprocessorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentParseResult, setCurrentParseResult] = useState<ParseResult<TransferParseResponse>>();

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

      const parseResult: ParseResult<TransferParseResponse> = await window.registryAPI.parseTransfers();

      if (parseResult.errorCode === DIALOG_CANCELLED) {
        return;
      }

      if (!parseResult.data) {
        await Swal.fire({
          icon: "warning",
          title: "No Data",
          text: "No valid transfer data found in the JSON file.",
        });
        return;
      }

      setCurrentParseResult(parseResult);

      const { animals, seller, buyer } = parseResult.data;

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

      // Show warnings (if any)
      if (parseResult.warnings?.length) {
        const html = `
          <ul style="text-align:left;">
            ${parseResult.warnings.map((w) => `<li>${w}</li>`).join("")}
          </ul>
        `;
        await Swal.fire({
          title: "Warnings Detected",
          html,
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
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

    const args: RegistryProcessRequest = {
      processType: 'transfers' as RegistryProcessType,
      species: species,
      sections: {},
      parseResult: currentParseResult,
    };

    const result: ProcessingResult = await window.registryAPI.process(args);

    if (result.success) {
      Swal.fire({
        title: "Success",
        icon: "success",
        confirmButtonText: "OK",
        width: "40em",
        text: "Transfers processed successfully",
      });

      navigate("/"); // nav back to home after processing
    } else {
      Swal.fire({
        title: "Error",
        icon: "error",
        confirmButtonText: "OK",
        width: "40em",
        text: "There was an error processing transfers.",
      });
    }
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
          {loading ? "Loading..." : "Select Transfer JSON"}
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
