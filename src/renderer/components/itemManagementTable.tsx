import React from "react";
import {EditIcon} from "./icons/EditIcon";
import {DeleteIcon} from "./icons/DeleteIcon";

export type ItemColumnSpec<T> = {
  title: string,
  valueFunc: (item: T) => string
}

export interface ItemManagementTableProps<T> {
  items: T[],
  itemKey: (item: T) => string,
  colSpecs: ItemColumnSpec<T>[],
  editItem: (item: T) => void,
  removeItem: (item: T) => void
}

export const ItemManagementTable = <T,>({ items, itemKey, colSpecs, editItem, removeItem } : ItemManagementTableProps<T>) => {
  return (
    <>
      <div className="item-management-container">
        <table className="item-management-table">
          <thead>
            <tr key="header">
              {colSpecs.map((colSpec) => <th key={colSpec.title}>{colSpec.title}</th>)}
              {(editItem || removeItem) && <th key="actions" />}
            </tr>
          </thead>
          <tbody>
          {items.map((item) => (
            <tr key={itemKey(item)}>
              {colSpecs.map((colSpec) => <td key={colSpec.title}>{colSpec.valueFunc(item)}</td>)}
              {(editItem || removeItem) &&
                <td key="actions">
                  <div className="button-group">
                    { editItem &&
                      <button
                        id="create-default-btn"
                        className="standard-icon-button"
                        onClick={() => editItem(item)}>
                        <EditIcon/>
                      </button>
                    }
                    { removeItem &&
                      <button
                        id="create-default-btn"
                        className="destructive-icon-button"
                        onClick={() => removeItem(item)}>
                        <DeleteIcon/>
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
