import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditableTable } from '../../../../components/editableTable/editableTable';
import { RegistryFieldDef, RegistryRow } from '../../../../types/registry/registryProcess';
import { BirthParseRow } from '../../../../../registry/parsers/births/util/birthParseRow';

export const PreprocessorPage: React.FC = () => {
  const { processType } = useParams(); // e.g., 'births'
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
          { key: 'animalName', label: 'Animal Name', editable: true },
          { key: 'birthdate', label: 'Birth Date', editable: true },
          { key: 'isStillborn', label: 'Stillborn?', editable: true },
          { key: 'sex', label: 'Sex', editable: false },
          { key: 'weight', label: 'Weight', editable: true },
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

  const handleSubmit = () => {
    console.log('Edited rows:', rows);
    navigate('/registry');
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
