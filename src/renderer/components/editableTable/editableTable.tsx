import React from "react";
import { RegistryFieldDef, RegistryRow } from "packages/api";

interface EditableTableProps {
  rows: RegistryRow[];
  columns: RegistryFieldDef[];
  onChange: (index: number, updated: RegistryRow) => void;
}

export const EditableTable: React.FC<EditableTableProps> = ({ rows, columns, onChange }) => {
  return (
    <div className="results-section">
      <table className="results-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.editable ? (() => {
                    const value = row[col.key];

                    if (typeof value === 'boolean') {
                      return (
                        <label style={{ cursor: 'pointer', padding: '0.25rem', display: 'inline-flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            style={{ width: '2em', height: '2em' }}
                            checked={value}
                            onChange={(e) =>
                              onChange(idx, { ...row, [col.key]: e.target.checked })
                            }
                          />
                        </label>
                      );
                    } else if (typeof value === 'number') {
                      return (
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            onChange(idx, { ...row, [col.key]: Number(e.target.value) })
                          }
                        />
                      );
                    } else {
                      return (
                        <input
                          type="text"
                          value={value ?? ''}
                          onChange={(e) =>
                            onChange(idx, { ...row, [col.key]: e.target.value })
                          }
                        />
                      );
                    }
                    })() : (
                      row[col.key]?.toString()
                    )}

                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};
