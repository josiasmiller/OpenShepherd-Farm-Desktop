import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { EditableTable } from '../../../../components/editableTable/editableTable';

import { RegistryFieldDef, RegistryRow } from '../../../../types/registry/registryProcess';

import { BirthParseResponse, BirthParseRow } from '../../../../../registry/processing/impl/births/parser/util/birthParseRow';
import { DeathParseResponse, DeathParseRow } from '../../../../../registry/processing/impl/deaths/parser/util/deathParseRow';
import { RegistrationParseResponse, RegistrationParseRow } from '../../../../../registry/processing/impl/registrations/parser/util/registrationParseRow';

import { ParseResult, ProcessingResult, RegistryProcessRequest, RegistryProcessType } from '../../../../../registry/processing/core/types';
import { Species } from '../../../../../database';
import { DatabaseStateCheckResponse } from '../../../../../registry/processing/ipc/handleDatabaseStateCheck';
import { handleResult, Result } from '../../../../../shared/results/resultTypes';

type EditableTableData = {
  title: string;
  columns: RegistryFieldDef[];
  rows: RegistryRow[];
  editable: boolean;
};

type TableSection = {
  title: string;
  rows: any[]; // or a better shared base type if you have one
};

type SectionsMap = Record<string, any[]>;

export const PreprocessorPage: React.FC = () => {
  const location = useLocation();
  const { processType } = useParams();
  const navigate = useNavigate();

  const navigationState = location.state as { species?: Species };
  const species : Species = navigationState?.species!;

  const [tables, setTables] = useState<EditableTableData[]>([]);

  // const [rows, setRows] = useState<RegistryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSelectedFile, setHasSelectedFile] = useState(false);

  const selectAndLoadFile = async () => {
    if (!processType) return;

    try {
      setLoading(true);

      if (processType === 'births') {
        await handleBirths();
        
      } else if (processType === 'registrations') {
        await handleRegistrations();

      } else if (processType === 'transfers') {
        await handleTransfers();

      } else if (processType == 'deaths') {
        await handleDeaths();
      }

    } catch (error) {
      console.error("Error selecting or parsing file:", error);
      alert("Failed to parse file.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * parses births and then populates the table with the parsed data
   */
  const handleBirths = async () => {
    const parseResult: ParseResult<BirthParseResponse> = await window.electronAPI.registryParseBirths();
    const parsedBirths: BirthParseRow[] = parseResult.data.rows;

    handleWarnings(parseResult.warnings);

    const birthColumns: RegistryFieldDef[] = [
      // Core birth info
      { key: 'isStillborn', label: 'Stillborn?', editable: true },
      { key: 'prefixKey', label: 'Prefix Key', editable: false },
      { key: 'prefix', label: 'Prefix', editable: true },
      { key: 'animalName', label: 'Animal Name', editable: true },
      { key: 'birthdate', label: 'Birth Date', editable: true },
      { key: 'sexKey', label: 'Sex Key', editable: true },
      { key: 'sex', label: 'Sex', editable: true },

      // Breeder and parents
      { key: 'breederId', label: 'Breeder ID', editable: true },
      { key: 'breederName', label: 'Breeder Name', editable: true },
      { key: 'sireId', label: 'Sire ID', editable: true },
      { key: 'damId', label: 'Dam ID', editable: true },

      // Conception & birth type
      { key: 'conceptionTypeKey', label: 'Conception Type Key', editable: true },
      { key: 'conceptionType', label: 'Conception Type', editable: true },
      { key: 'birthTypeKey', label: 'Birth Type', editable: true },

      // Appearance
      { key: 'coatColorKey', label: 'Coat Color Key', editable: false },
      { key: 'coatColor', label: 'Coat Color', editable: true },
      { key: 'coatColorTableKey', label: 'Coat Color Table Key', editable: true },

      // Federal tag
      { key: 'fedColorKey', label: 'Federal Color Key', editable: true },
      { key: 'fedColor', label: 'Federal Tag Color', editable: true },
      { key: 'fedLocKey', label: 'Federal Location Key', editable: true },
      { key: 'fedLoc', label: 'Federal Tag Location', editable: true },
      { key: 'fedNum', label: 'Federal Tag Number', editable: true },
      { key: 'fedTypeKey', label: 'Federal Type Key', editable: true },
      { key: 'fedType', label: 'Federal Tag Type', editable: true },

      // Farm tag
      { key: 'farmColorKey', label: 'Farm Color Key', editable: true },
      { key: 'farmColor', label: 'Farm Tag Color', editable: true },
      { key: 'farmLocKey', label: 'Farm Location Key', editable: true },
      { key: 'farmLoc', label: 'Farm Tag Location', editable: true },
      { key: 'farmNum', label: 'Farm Tag Number', editable: true },
      { key: 'farmTypeKey', label: 'Farm Type Key', editable: true },
      { key: 'farmType', label: 'Farm Tag Type', editable: true },

      // Weight
      { key: 'weight', label: 'Weight', editable: true },
      { key: 'weightUnitsKey', label: 'Weight Units Key', editable: true },
      { key: 'weightUnits', label: 'Weight Units', editable: true },

      // Misc
      { key: 'birthNotes', label: 'Notes', editable: true },
    ];

    const rows: RegistryRow[] = parsedBirths.map(b => ({ ...b }));

    setTables([
      {
        title: "Birth Records",
        columns: birthColumns,
        rows,
        editable: true,
      }
    ]);
    setHasSelectedFile(true);
  };

  /**
   * Parses registrations and then populates the table with the parsed data
   */
  const handleRegistrations = async () => {
    const parseResult: ParseResult<RegistrationParseResponse> = await window.electronAPI.registryParseRegistrations();
    const parsedRegistrations: RegistrationParseRow[] = parseResult.data.rows;

    handleWarnings(parseResult.warnings);

    const registrationColumns: RegistryFieldDef[] = [
      // Breeder
      { key: 'breederId', label: 'Breeder ID', editable: true },
      { key: 'breederName', label: 'Breeder Name', editable: true },

      // Animal core
      { key: 'animalId', label: 'Animal ID', editable: false },
      { key: 'registrationNumber', label: 'Registration Number', editable: false },
      { key: 'animalPrefix', label: 'Prefix', editable: true },
      { key: 'animalName', label: 'Animal Name', editable: true },
      { key: 'birthdate', label: 'Birth Date', editable: true },
      { key: 'sex', label: 'Sex', editable: true },
      { key: 'birthType', label: 'Birth Type', editable: true },
      { key: 'isOfficial', label: 'Is Official', editable: true },

      // Federal Tag
      { key: 'fedTypeKey', label: 'Federal Type Key', editable: true },
      { key: 'fedType', label: 'Federal Tag Type', editable: true },
      { key: 'fedColorKey', label: 'Federal Color Key', editable: true },
      { key: 'fedColor', label: 'Federal Tag Color', editable: true },
      { key: 'fedLocKey', label: 'Federal Location Key', editable: true },
      { key: 'fedLoc', label: 'Federal Tag Location', editable: true },
      { key: 'fedNum', label: 'Federal Tag Number', editable: true },

      // Farm Tag
      { key: 'farmTypeKey', label: 'Farm Type Key', editable: true },
      { key: 'farmType', label: 'Farm Tag Type', editable: true },
      { key: 'farmColorKey', label: 'Farm Color Key', editable: true },
      { key: 'farmColor', label: 'Farm Tag Color', editable: true },
      { key: 'farmLocKey', label: 'Farm Location Key', editable: true },
      { key: 'farmLoc', label: 'Farm Tag Location', editable: true },
      { key: 'farmNum', label: 'Farm Tag Number', editable: true },

      // Appearance
      { key: 'coatColorKey', label: 'Coat Color Key', editable: true },
      { key: 'coatColor', label: 'Coat Color', editable: true },
    ];

    const registrationRows: RegistryRow[] = parsedRegistrations.map((r) => ({ ...r }));

    setTables([
      {
        title: "Registration Records",
        columns: registrationColumns,
        rows: registrationRows,
        editable: true,
      },
    ]);
    setHasSelectedFile(true);
  };

  /**
   * parses deaths and then populates the table with the parsed data
   */
  const handleDeaths = async () => {
    const parseResult: ParseResult<DeathParseResponse> = await window.electronAPI.registryParseDeaths();
    const parsedDeaths: DeathParseRow[] = parseResult.data.rows;

    handleWarnings(parseResult.warnings);

    const deathColumns: RegistryFieldDef[] = [
      { key: 'deathDate', label: 'Death Date', editable: true },
      { key: 'animalId', label: 'Animal ID', editable: false },
      { key: 'prefixKey', label: 'Prefix Key', editable: true },
      { key: 'prefix', label: 'Prefix', editable: true },
      { key: 'name', label: 'Animal Name', editable: true },
      { key: 'registrationNumber', label: 'Registration Number', editable: false },
      { key: 'reasonKey', label: 'Reason Key', editable: true },
      { key: 'reason', label: 'Reason', editable: true },
      { key: 'notes', label: 'Notes', editable: true },
    ];

    const rows: RegistryRow[] = parsedDeaths.map(r => ({ ...r }));

    setTables([
      {
        title: "Death Records",
        columns: deathColumns,
        rows: rows,
        editable: true,
      },
    ]);
    setHasSelectedFile(true);
  };



  const handleTransfers = async () => {
    const parseResult = await window.electronAPI.registryParseTransfers();
    const { animals, seller, buyer } = parseResult.data;

    handleWarnings(parseResult.warnings);

    const tables: EditableTableData[] = [];

    const headerMap: Record<string, string> = {
      "Animal ID": "animalId",
      "Registration Number": "registrationNumber",
      "Prefix": "prefix",
      "Name": "name",
      "Birth Date": "birthDate",
      "Birth Type": "birthType",
      "Sex": "sex",
      "Coat Color": "coatColor",
    };

    const normalizedAnimals = animals.map(a => {
      const mapped: any = {};
      for (const [csvKey, ourKey] of Object.entries(headerMap)) {
        mapped[ourKey] = a[csvKey as keyof typeof a] ?? "";
      }
      return mapped;
    });

    // Animals table
    tables.push({
      title: "Transferred Animals",
      editable: true,
      columns: [
        { key: 'animalId', label: 'Animal ID', editable: false },
        { key: 'registrationNumber', label: 'Registration Number', editable: false },
        { key: 'prefix', label: 'Prefix', editable: true },
        { key: 'name', label: 'Name', editable: true },
        { key: 'birthDate', label: 'Birth Date', editable: true },
        { key: 'birthType', label: 'Birth Type', editable: true },
        { key: 'sex', label: 'Sex', editable: true },
        { key: 'coatColor', label: 'Coat Color', editable: true },
      ],
      rows: normalizedAnimals,
    });

    // Seller info
    if (seller) {
      tables.push({
        title: "Seller Info",
        editable: false,
        columns: Object.keys(seller).map(key => ({ key, label: key, editable: false })),
        rows: [seller],
      });
    }

    // Buyer info
    if (buyer) {
      tables.push({
        title: "Buyer Info",
        editable: false,
        columns: Object.keys(buyer).map(key => ({ key, label: key, editable: false })),
        rows: [buyer],
      });
    }

    setTables(tables);
    setHasSelectedFile(true);
  };



  /**
   * handles when a row is updated in any form
   * @param tableIndex which table is being updated
   * @param rowIndex index of the row being changes
   * @param updatedRow RegistryRow being updated
   */
  const handleRowChange = (tableIndex: number, rowIndex: number, updatedRow: RegistryRow) => {
    const newTables = [...tables];
    newTables[tableIndex].rows[rowIndex] = updatedRow;
    setTables(newTables);
  };


  /**
   * creates a sweetalert pop up when any errors occur. This should be used in the handling functions to 
   * indicate that any parsing errors occured. 
   * @param warnings array of any warnings to be displayed to the user
   */
  const handleWarnings = async (warnings : string[]) => {
    if (warnings.length > 0) {
      const htmlContent = `
        <ul style="text-align: left; padding-left: 1.2em;">
          ${warnings.map(warning => `<li>${warning}</li>`).join('')}
        </ul>
      `;

      await Swal.fire({
        title: "Warning(s) Detected",
        html: htmlContent,
        icon: "warning",
        confirmButtonText: "Continue",
        width: 600,
      });
    }
  }

  /**
   * Submits the parsed & altered data to be validated & processed
   */
  const handleSubmit = async () => {
    if (!processType) return;

    const pt: RegistryProcessType = processType as RegistryProcessType;

    const args: RegistryProcessRequest = {
      processType: pt,
      species: species,
      sections: tables.reduce<SectionsMap>((acc: SectionsMap, table: TableSection) => {
        const key = table.title.toLowerCase().replace(/\s+/g, '_'); // take the table title like "Birth Records" and make it `birth_records` (lowercase & replace spaces with underscores)
                                                                    // Note this comes from the `TableSection` data
        acc[key] = table.rows;
        return acc;
      }, {}),
    };

    const result: ProcessingResult = await window.electronAPI.registryProcess(args);

    if (!result.success) {
      let errorHtml = "<ul><li>Unknown error occurred.</li></ul>";

      if (Array.isArray(result.errors) && result.errors.length > 0) {
        errorHtml = `<ul>${result.errors.map((e) => `<li>${e}</li>`).join("")}</ul>`;
      }

      Swal.fire({
        title: "Unable to Process",
        html: errorHtml,
        icon: "error",
        confirmButtonText: "OK",
        width: "40em",
      });
    } else {
      navigate('/registry');
      Swal.fire({
        title: "Success",
        text: `CSV processed successfully.\n${result.insertedRowCount ?? 0} rows processed.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

  /**
   * Submits the parsed & altered data to be validated & processed
   */
  const handlePreCheck = async () => {
    const response: DatabaseStateCheckResponse = await window.electronAPI.databaseStateCheck();

    const failedChecks = [];
    if (!response.blackVerified) failedChecks.push("Black registration numbers");
    if (!response.chocolateVerified) failedChecks.push("Chocolate registration numbers");
    if (!response.whiteVerified) failedChecks.push("White registration numbers");

    if (failedChecks.length === 0) {
      // All good
      Swal.fire({
        title: "Success",
        text: "All database state checks passed. Everything is OK.",
        icon: "success",
        confirmButtonText: "OK",
      });
      return;
    }

    // Some checks failed - build HTML message
    const htmlMessage = `
      <p>The following registration types are <strong>not up to date</strong>:</p>
      <ul style="text-align: left;">
        ${failedChecks.map(item => `<li>${item}</li>`).join("")}
      </ul>
      <p>Would you like to fix these issues now?</p>
    `;

    const result = await Swal.fire({
      title: "Database State Issues Detected",
      icon: "warning",
      html: htmlMessage,
      showCancelButton: true,
      confirmButtonText: "Yes, fix them",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        const resolveResult: Result<boolean, string> = await window.electronAPI.resolveDatabaseIssues(response);

        let wasSuccessful = false;

        await handleResult(resolveResult, {
          success: (data: boolean) => {
            wasSuccessful = data;
          },
          error: (err: string) => {
            console.error("Failed to resolve database state issues: ", err);
            throw new Error(err);
          },
        });

        if (wasSuccessful) {
          await Swal.fire({
            title: "Success",
            text: "Database issues have been fixed successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          await Swal.fire({
            title: "Warning",
            text: "The database issues were detected but could not be fixed automatically. Please check manually.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      } catch (err: any) {
        await Swal.fire({
          title: "Error",
          text: `An error occurred while fixing database issues: ${err.message || err}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };




  const capitalizedType = (processType ?? 'Unknown').charAt(0).toUpperCase() + (processType ?? 'Unknown').slice(1);

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <h1 className="app-header">{capitalizedType ? `Preprocess ${capitalizedType}` : 'Preprocess Records'}</h1>

      <div className="padded-horizontal-lg" style={{ paddingBottom: '4em' }}>
        <div className="padded-horizontal-lg" style={{ paddingBottom: '2em' }}>
          <button className='wide-button' onClick={handlePreCheck}>Pre-check Database</button>
        </div>

        <button className='wide-button' onClick={selectAndLoadFile} disabled={loading}>
          {loading ? 'Loading...' : 'Select CSV File'}
        </button>
      </div>

      {hasSelectedFile && (
        <>
          {tables.map((table: EditableTableData, i: number) => (
            <div key={i} style={{ marginBottom: "2em" }}>

              <div className="padded-horizontal-lg">
                <h2>{table.title}</h2>
              </div>
              
              <EditableTable
                rows={table.rows}
                columns={table.columns}
                editable={table.editable}
                onChange={(rowIndex, updatedRow) => handleRowChange(i, rowIndex, updatedRow)}
              />
            </div>
          ))}

          <div className="padded-horizontal-lg" style={{ paddingBottom: '8em' }}>
            <button className='wide-button' onClick={handleSubmit}>Continue</button>
          </div>
        </>
      )}

    </div>
  );
};
