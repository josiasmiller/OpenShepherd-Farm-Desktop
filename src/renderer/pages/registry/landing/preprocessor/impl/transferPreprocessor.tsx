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
  const [owners, setOwners] = useState<OwnerInformationTableProps["owners"]>([]);
  const [hasLoadedFile, setHasLoadedFile] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Opens a file dialog and loads the JSON file.
   */
  const selectAndLoadFile = async () => {
    try {
      setLoading(true);

      const parseResult: ParseResult<TransferParseResponse> = await window.registryAPI.parseTransfers();

      //if (parseResult.errorCode !== undefined) {
      // if (false) { 
      //   await Swal.fire({
      //     icon: "error",
      //     title: "Error Parsing File",
      //     text: "An error occurred while reading the CSV file.",
      //   });
      //   return;
      // }

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

      // Use for...of since animals is an array
      for (const animalRow of animals) {
        let animalId: string = animalRow.animalId;
        newAnimalIds.push(animalId);
      }

      setAnimalIds(newAnimalIds);

      // --- Buyer Information ---

      // for now, assume all buyers are existing members
      const existingMem: ExistingMemberBuyer = buyer as ExistingMemberBuyer;

      const ownerList: OwnerInformationTableProps["owners"] = [];

      // Add contact owner if contactId exists
      if (existingMem.contactId) {
        ownerList.push({
          ownerId: existingMem.contactId,
          ownerType: OwnerType.CONTACT,
        });
      }

      // Add company owner if companyId exists
      if (existingMem.companyId) {
        ownerList.push({
          ownerId: existingMem.companyId,
          ownerType: OwnerType.COMPANY,
        });
      }

      setOwners(ownerList);


      // --- Seller Information ---
      newTables.push({
        title: "Seller Information",
        editable: false,
        columns: Object.keys(seller || {}).map((k) => ({
          key: k,
          label: k,
          editable: false,
        })),
        rows: [seller],
      });

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
            <OwnerInformationTable owners={owners} />
          </div>

          {/* --- Other Info Tables (Buyer/Seller/Dates) --- */}
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
