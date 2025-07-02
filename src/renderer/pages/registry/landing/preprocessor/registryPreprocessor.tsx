import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditableTable } from '../../../../components/editableTable/editableTable';
import { RegistryFieldDef, RegistryRow } from '../../../../types/registry/registryProcess';
import { BirthParseRow } from '../../../../../registry/processing/births/parser/util/birthParseRow';
import Swal from 'sweetalert2';
import { RegistryProcessRequest, RegistryProcessType } from '../../../../../registry/processing/core/types';

export const PreprocessorPage: React.FC = () => {
  const { processType } = useParams(); // e.g., 'births', 'deaths;, or any other registry processes
  const navigate = useNavigate();

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
          { key: 'isStillborn', label: 'Stillborn?', editable: true },
          { key: 'prefix', label: 'Flock Prefix', editable: true },
          { key: 'animalName', label: 'Animal Name', editable: true },
          { key: 'birthdate', label: 'Birth Date', editable: true },
          { key: 'sex', label: 'Sex', editable: false },
          { key: 'breederName', label: 'Breeder Name', editable: true },
          { key: 'conceptionType', label: 'Conception Type', editable: true },
          { key: 'coatColor', label: 'Coat Color', editable: true },
          { key: 'farmColor', label: 'Farm Tag Color', editable: true },
          { key: 'farmLoc', label: 'Farm Tag Location', editable: true },
          { key: 'farmNum', label: 'Farm Tag Number', editable: true },
          { key: 'farmType', label: 'Farm Tag Type', editable: true },
          { key: 'fedColor', label: 'Federal Tag Color', editable: true },
          { key: 'fedLoc', label: 'Federal Tag Location', editable: true },
          { key: 'fedNum', label: 'Federal Tag Number', editable: true },
          { key: 'fedType', label: 'Federal Tag Type', editable: true },
          { key: 'weight', label: 'Weight', editable: true },
          { key: 'weightUnits', label: 'Weight Units', editable: true },
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

    const pt : RegistryProcessType = processType as RegistryProcessType;

    const args : RegistryProcessRequest = {
      processType: pt,
      rows: rows,
    }

    const result = await await window.electronAPI.registryProcess(args);

    if (!result.success) {
      Swal.fire({
        title: "Unable to Process",
        text: "The file passes validation, but failed upon attempting to write to the database",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      navigate('/registry');
      Swal.fire({
        title: "Success",
        text: `CSV processed successfully.\n${result.insertedRowCount} rows inserted.`,
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
