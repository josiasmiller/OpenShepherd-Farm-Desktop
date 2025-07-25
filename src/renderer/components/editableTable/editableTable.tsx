import React from "react";
import { RegistryFieldDef, RegistryRow } from "../../types/registry/registryProcess.js";

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
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            onChange(idx, { ...row, [col.key]: e.target.checked })
                          }
                        />
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
