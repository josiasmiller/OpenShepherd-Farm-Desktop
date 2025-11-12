import React, { useState } from "react";
import Swal from "sweetalert2";
import { BackButton } from "../../../../../components/backButton/backButton";
import { EditableTable } from "../../../../../components/editableTable/editableTable";
import { AnimalInformationTable } from "../../../../../components/tables/animalTable";
import { OwnerInformationTable, OwnerInformationTableProps  } from "../../../../../components/tables/ownerTable";
import {
  TransferParseResponse,
  ParseResult,
  AnimalRow,
  ExistingMemberBuyer,
  OwnerType,
} from "packages/api";

/**
 * Structure used for generic table rendering (Buyer, Seller, Dates)
 */
type EditableTableData = {
  title: string;
  columns: { key: string; label: string; editable: boolean }[];
  rows: any[];
  editable: boolean;
};

export const TransferPreprocessorPage: React.FC = () => {
  const [tables, setTables] = useState<EditableTableData[]>([]);
  const [animalIds, setAnimalIds] = useState<string[]>([]);
  const [buyers, setBuyers] = useState<OwnerInformationTableProps["owners"]>([]);
  const [sellers, setSellers] = useState<OwnerInformationTableProps["owners"]>([]);
  const [hasLoadedFile, setHasLoadedFile] = useState(false);
  const [loading, setLoading] = useState(false);

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

      const newTables: EditableTableData[] = [];

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


      // --- Sell Date ---
      newTables.push({
        title: "Sell Date",
        editable: false,
        columns: [{ key: "soldAt", label: "Sold At", editable: false }],
        rows: [{ soldAt: seller?.soldAt ?? "" }],
      });

      // --- Movement Date ---
      newTables.push({
        title: "Movement Date",
        editable: false,
        columns: [{ key: "movedAt", label: "Moved At", editable: false }],
        rows: [{ movedAt: seller?.movedAt ?? "" }],
      });

      setTables(newTables);
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
          <div style={{ marginBottom: "3em" }}>
            <div className="padded-horizontal-lg">
              <h2>Animal(s)</h2>
            </div>
            <AnimalInformationTable animalIds={animalIds} />
          </div>

          {/* --- Buyer Table --- */}
          <div style={{ marginBottom: "3em" }}>
            <div className="padded-horizontal-lg">
              <h2>Buyer</h2>
            </div>
            <OwnerInformationTable owners={buyers} />
          </div>

          {/* --- Seller Table --- */}
          <div style={{ marginBottom: "3em" }}>
            <div className="padded-horizontal-lg">
              <h2>Seller</h2>
            </div>
            <OwnerInformationTable owners={sellers} />
          </div>

          {/* --- Other Info Tables (Dates) --- */}
          {tables.map((table, idx) => (
            <div key={idx} style={{ marginBottom: "3em" }}>
              <div className="padded-horizontal-lg">
                <h2>{table.title}</h2>
              </div>
              <EditableTable
                rows={table.rows}
                columns={table.columns}
                onChange={() => {}}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
