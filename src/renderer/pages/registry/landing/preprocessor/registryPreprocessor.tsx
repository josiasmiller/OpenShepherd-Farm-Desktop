import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { EditableTable } from '../../../../components/editableTable/editableTable';
import { BackButton } from "../../../../components/backButton/backButton";

import { RegistryFieldDef, RegistryRow } from '../../../../types/registry/registryProcess';

import { BirthParseResponse, BirthParseRow } from '../../../../../registry/processing/impl/births/parser/util/birthParseRow';
import { DeathParseResponse, DeathParseRow } from '../../../../../registry/processing/impl/deaths/parser/util/deathParseRow';
import { RegistrationParseResponse, RegistrationParseRow } from '../../../../../registry/processing/impl/registrations/parser/util/registrationParseRow';

import { ParseResult, ProcessingResult, RegistryProcessRequest, RegistryProcessType } from '../../../../../registry/processing/core/types';
import { ScrapieFlockInfo, Species } from '../../../../../database';
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
  rows: any[];
};

type SectionsMap = Record<string, any[]>;

type ActionButton = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const processTypeButtons: Record<string, (ctx: {
  handlePreCheck: () => void;
  selectAndLoadFile: () => void;
  handleFixFederalRegnums: () => void;
  loading: boolean;
}) => ActionButton[]> = {
  births: ({ handlePreCheck, selectAndLoadFile, loading }) => [
    {
      label: "Pre-check Database",
      onClick: handlePreCheck,
      className: "wide-button"
    },
    {
      label: loading ? "Loading..." : "Select Birth Notify CSV",
      onClick: selectAndLoadFile,
      disabled: loading,
      className: "wide-button"
    }
  ],

  registrations: ({ handlePreCheck, handleFixFederalRegnums, selectAndLoadFile, loading }) => [
    {
      label: "Pre-check Database",
      onClick: handlePreCheck,
      className: "wide-button"
    },
    {
      label: "Fix Federal Registration Numbers",
      onClick: handleFixFederalRegnums,
      className: "wide-button"
    },
    {
      label: loading ? "Loading..." : "Select Registrations CSV",
      onClick: selectAndLoadFile,
      disabled: loading,
      className: "wide-button"
    }
  ],

  deaths: ({ handlePreCheck, selectAndLoadFile, loading }) => [
    {
      label: "Pre-check Database",
      onClick: handlePreCheck,
      className: "wide-button"
    },
    {
      label: loading ? "Loading..." : "Select Deaths CSV",
      onClick: selectAndLoadFile,
      disabled: loading,
      className: "wide-button"
    }
  ],

  transfers: ({ handlePreCheck, selectAndLoadFile, loading }) => [
    {
      label: "Pre-check Database",
      onClick: handlePreCheck,
      className: "wide-button"
    },
    {
      label: loading ? "Loading..." : "Select Transfers CSV",
      onClick: selectAndLoadFile,
      disabled: loading,
      className: "wide-button"
    }
  ],

  // Default fallback
  default: ({ selectAndLoadFile, loading }) => [
    {
      label: loading ? "Loading..." : "Select CSV File",
      onClick: selectAndLoadFile,
      disabled: loading,
      className: "wide-button"
    }
  ]
};



export const PreprocessorPage: React.FC = () => {
  const location = useLocation();
  const { processType } = useParams();
  const navigate = useNavigate();

  const navigationState = location.state as { species?: Species };
  const species : Species = navigationState?.species!;

  const [tables, setTables] = useState<EditableTableData[]>([]);
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
    if (loading) return;

    try {
      setLoading(true);

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
    } catch (err : any) {
      Swal.fire({
        title: "Error",
        text: `An unexpected error occurred: ${(err as Error).message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
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

  /**
   * looks through the federal registration numbers and makes checks if they are federal scrapie tags or electronic tags.
   * 
   * For federal scrapie tags, the federal registration number is set to be prefixed by the `scrapie_flockid` from the `scrapie_flock_number_table`
   * 
   * For electronic tags, the federal registration number is set to be prefixed by the country code of the given animal (for example, `840_` for american animals)
   */
  const handleFixFederalRegnums = async () => {
    if (!tables.length) return;

    const updatedTables = [...tables];
    const changes: string[] = []; // Track changes for Swal

    const newRows = await Promise.all(
      updatedTables[0].rows.map(async (row, index) => {
        const fedType = (row.fedType || "").toString().toLowerCase();
        let prefix: string | null = null;

        const breederId: string = row.breederId.toString();
        if (!breederId) {
          console.warn("Skipping row without breederId");
          return row;
        }

        const isCompanyResult = await window.electronAPI.isOwnerCompany(breederId);
        let isCompany: boolean = false;

        await handleResult(isCompanyResult, {
          success: (data: boolean) => {
            isCompany = data;
          },
          error: (err: string) => {
            console.error("Failed to get if owner is a company: ", err);
            throw new Error(err);
          },
        });

        if (fedType === "federal scrapie") {
          const scrapieResult = await window.electronAPI.getScrapieFlockInfo(breederId, isCompany);

          await handleResult(scrapieResult, {
            success: (data: ScrapieFlockInfo | null) => {
              if (data != null) {
                prefix = data.scrapieName + "-";
              }
            },
            error: (err: string) => {
              console.error("Failed to get scrapie flock info: ", err);
              throw new Error(err);
            },
          });
        } else if (fedType === "electronic") {
          const countryPrefixResult = await window.electronAPI.getCountryPrefixForOwner(breederId, isCompany);

          await handleResult(countryPrefixResult, {
            success: (data: string) => {
              prefix = data + "_";
            },
            error: (err: string) => {
              console.error("Failed to get country tag code: ", err);
              throw new Error(err);
            },
          });
        }

        if (prefix && !row.fedNum?.toString()?.startsWith(prefix)) {
          const oldFedNum = row.fedNum ?? "";
          const newFedNum = `${prefix}${oldFedNum}`;
          changes.push(`Row ${index + 1}: "${oldFedNum}" → "${newFedNum}"`);

          return {
            ...row,
            fedNum: newFedNum,
          };
        }

        return row;
      })
    );

    updatedTables[0] = {
      ...updatedTables[0],
      rows: newRows,
    };

    setTables(updatedTables);

    // Show Swal summary
    if (changes.length > 0) {
      Swal.fire({
        icon: "success",
        title: "Federal Registration Numbers Updated",
        html: changes.join("<br>"),
        width: "600px",
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "No Updates Needed",
        text: "All federal registration numbers were already correct.",
      });
    }
  };



  const capitalizedType = (processType ?? 'Unknown').charAt(0).toUpperCase() + (processType ?? 'Unknown').slice(1);

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>

      <BackButton />

      <h1 className="app-header">{capitalizedType ? `Preprocess ${capitalizedType}` : 'Preprocess Records'}</h1>

      <div className="padded-horizontal-lg" style={{ paddingBottom: '4em' }}>
        {(
          processTypeButtons[processType ?? ""] ??
          processTypeButtons.default
        )({
          handlePreCheck,
          selectAndLoadFile,
          handleFixFederalRegnums,
          loading,
        }).map((btn, idx) => (
          <div key={idx} className="padded-horizontal-lg" style={{ paddingBottom: '2em' }}>
            <button
              className={btn.className ?? ""}
              onClick={btn.onClick}
              disabled={btn.disabled}
            >
              {btn.label}
            </button>
          </div>
        ))}
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
                onChange={(rowIndex, updatedRow) => handleRowChange(i, rowIndex, updatedRow)}
              />
            </div>
          ))}

          <div className="padded-horizontal-lg" style={{ paddingBottom: '8em' }}>
            <button className='wide-button' onClick={handleSubmit}>{loading ? 'Loading...' : 'Continue'}</button>
          </div>
        </>
      )}

    </div>
  );
};
