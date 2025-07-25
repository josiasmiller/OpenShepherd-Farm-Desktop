import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { EditableTable } from '../../../../components/editableTable/editableTable';
import { RegistryFieldDef, RegistryRow } from '../../../../types/registry/registryProcess';
import { BirthParseRow } from '../../../../../registry/processing/impl/births/parser/util/birthParseRow';
import Swal from 'sweetalert2';
import { ProcessingResult, RegistryProcessRequest, RegistryProcessType } from '../../../../../registry/processing/core/types';
import { Species } from '../../../../../database';


export const PreprocessorPage: React.FC = () => {
  const location = useLocation();
  const { processType } = useParams();
  const navigate = useNavigate();

  const navigationState = location.state as { species?: Species };
  const species : Species = navigationState?.species!;

  const [rows, setRows] = useState<RegistryRow[]>([]);
  const [columns, setColumns] = useState<RegistryFieldDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSelectedFile, setHasSelectedFile] = useState(false);

  const selectAndLoadFile = async () => {
    if (!processType) return;

    try {
      setLoading(true);

      if (processType === 'births') {
        const parsedBirths: BirthParseRow[] = await window.electronAPI.registryParseBirths();

        const birthColumns: RegistryFieldDef[] = [
          // Core birth info
          { key: 'isStillborn', label: 'Stillborn?', editable: true },
          { key: 'prefix', label: 'Prefix', editable: true },
          { key: 'prefixKey', label: 'Prefix Key', editable: false },
          { key: 'animalName', label: 'Animal Name', editable: true },
          { key: 'birthdate', label: 'Birth Date', editable: true },
          { key: 'sex', label: 'Sex', editable: false },
          { key: 'sexKey', label: 'Sex Key', editable: false },

          // Breeder and parents
          { key: 'breederId', label: 'Breeder ID', editable: true },
          { key: 'breederName', label: 'Breeder Name', editable: true },
          { key: 'damId', label: 'Dam ID', editable: true },
          { key: 'sireId', label: 'Sire ID', editable: true },

          // Conception & birth type
          { key: 'conceptionType', label: 'Conception Type', editable: true },
          { key: 'conceptionTypeKey', label: 'Conception Type Key', editable: true },
          { key: 'birthTypeKey', label: 'Birth Type', editable: true },

          // Appearance
          { key: 'coatColor', label: 'Coat Color', editable: true },
          { key: 'coatColorKey', label: 'Coat Color Key', editable: false },
          { key: 'coatColorTableKey', label: 'Coat Color Table Key', editable: false },

          // Farm tag
          { key: 'farmColor', label: 'Farm Tag Color', editable: true },
          { key: 'farmColorKey', label: 'Farm Color Key', editable: true },
          { key: 'farmLoc', label: 'Farm Tag Location', editable: true },
          { key: 'farmLocKey', label: 'Farm Location Key', editable: true },
          { key: 'farmNum', label: 'Farm Tag Number', editable: true },
          { key: 'farmType', label: 'Farm Tag Type', editable: true },
          { key: 'farmTypeKey', label: 'Farm Type Key', editable: true },

          // Federal tag
          { key: 'fedColor', label: 'Federal Tag Color', editable: true },
          { key: 'fedColorKey', label: 'Federal Color Key', editable: true },
          { key: 'fedLoc', label: 'Federal Tag Location', editable: true },
          { key: 'fedLocKey', label: 'Federal Location Key', editable: true },
          { key: 'fedNum', label: 'Federal Tag Number', editable: true },
          { key: 'fedType', label: 'Federal Tag Type', editable: true },
          { key: 'fedTypeKey', label: 'Federal Type Key', editable: true },

          // Weight
          { key: 'weight', label: 'Weight', editable: true },
          { key: 'weightUnits', label: 'Weight Units', editable: true },
          { key: 'weightUnitsKey', label: 'Weight Units Key', editable: true },

          // Misc
          { key: 'birthNotes', label: 'Notes', editable: true },
        ];

        const rows: RegistryRow[] = parsedBirths.map(b => ({ ...b }));

        setColumns(birthColumns);
        setRows(rows);
        setHasSelectedFile(true);
      }

      else if (processType === 'deaths') {
        alert("Death processing not implemented yet");
      }

    } catch (error) {
      console.error("Error selecting or parsing file:", error);
      alert("Failed to parse file.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowChange = (index: number, updatedRow: RegistryRow) => {
    const newData = [...rows];
    newData[index] = updatedRow;
    setRows(newData);
  };

  const handleSubmit = async () => {
    if (!processType) return;

    const pt: RegistryProcessType = processType as RegistryProcessType;

    const args: RegistryProcessRequest = {
      processType: pt,
      rows: rows,
      species: species,
    };

    const result: ProcessingResult = await window.electronAPI.registryProcess(args);

    if (!result.success) {
      let errorHtml = "<ul><li>Unknown error occurred.</li></ul>";

      if (Array.isArray(result.errors) && result.errors.length > 0) {
        // Format the array of error messages into a bullet list
        errorHtml = `<ul>${result.errors.map((e) => `<li>${e}</li>`).join("")}</ul>`;
      }

      Swal.fire({
        title: "Unable to Process",
        html: errorHtml, // Using html to render HTML content instead of raw text
        icon: "error",
        confirmButtonText: "OK",
        width: "40em", // wider modal for better list display
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

  const capitalizedType = (processType ?? 'Unknown').charAt(0).toUpperCase() + (processType ?? 'Unknown').slice(1);

  return (
    <div>
      <h1 className="app-header">{capitalizedType ? `Preprocess ${capitalizedType}` : 'Preprocess Records'}</h1>

      <div className="padded-horizontal-lg">
        <button className='wide-button' onClick={selectAndLoadFile} disabled={loading}>
          {loading ? 'Loading...' : 'Select CSV File'}
        </button>
      </div>

      {hasSelectedFile && (
        <>
          <EditableTable rows={rows} columns={columns} onChange={handleRowChange} />
          <div className="padded-horizontal-lg">
            <button className='wide-button' onClick={handleSubmit}>Continue</button>
          </div>
        </>
      )}
    </div>
  );
};
