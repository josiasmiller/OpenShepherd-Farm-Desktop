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
} from "packages/api";


export const TransferPreprocessorPage: React.FC = () => {
  const location = useLocation();
  // const navigate = useNavigate();

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

      if (!parseResult.data) {
        await Swal.fire({
          icon: "warning",
          title: "No Data",
          text: "No valid transfer data found in the CSV file.",
        });
        return;
      }

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

      const buyerContactId = existingMem.contactId ?? existingMem["CONTACT_ID"];
      const buyerCompanyId = existingMem.companyId ?? existingMem["COMPANY_ID"];

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

      const sellerContactId = seller.contactId ?? seller["CONTACT_ID"];
      const sellerCompanyId = seller.companyId ?? seller["COMPANY_ID"];

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

      // end buyer setup
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
      const newSoldAt = seller.soldAt ?? seller["SOLD_AT"]; // BYPRODUCT OF CSV READING
      setSoldAt(newSoldAt);
      const newMovedAt = seller.movedAt ?? seller["MOVED_AT"];
      setMovedAt(newMovedAt);

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

    Swal.fire({
      title: "UNDER CONSTRUCTION",
      icon: "error",
      confirmButtonText: "OK",
      width: "40em",
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
          {loading ? "Loading..." : "Select Transfer CSV"}
        </button>
      </div>

      {hasLoadedFile && (
        <>
          {/* --- Animal Information Table --- */}
          <div style={{ marginBottom: "2em" }}>
            <div className="padded-horizontal-lg">
              <h2>Animal(s)</h2>
            </div>
            <AnimalInformationTable animalIds={animalIds} />
          </div>

          {/* --- Buyer Table --- */}
          <div style={{ marginBottom: "2em" }}>
            <div className="padded-horizontal-lg">
              <h2>Buyer</h2>
            </div>
            <OwnerInformationTable owners={buyers} />
          </div>

          {/* --- Seller Table --- */}
          <div style={{ marginBottom: "2em" }}>
            <div className="padded-horizontal-lg">
              <h2>Seller</h2>
            </div>
            <OwnerInformationTable owners={sellers} />
          </div>

          {/* --- Sold / Moved Dates --- */}
          <div className="padded-horizontal-lg" style={{ marginBottom: "3em" }}>
            <div style={{ display: "flex", gap: "2em", alignItems: "center" }}>
              <DateDisplay title="Sold At" value={soldAt} />
              <DateDisplay title="Moved At" value={movedAt} />
            </div>
          </div>



          <div className="padded-horizontal-lg" style={{ paddingBottom: '8em' }}>
            <button className='wide-button' onClick={handleSubmit}>{loading ? 'Loading...' : 'Continue'}</button>
          </div>
        </>
      )}
    </div>
  );
};
