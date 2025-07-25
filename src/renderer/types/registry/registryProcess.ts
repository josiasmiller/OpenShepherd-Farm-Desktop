export type RegistryRow = {
  [key: string]: string | number | boolean | null;
};

// Defines a column in the editable table
export interface RegistryFieldDef {
  key: string;           // e.g. 'animalName', 'birthdate'
  label: string;         // e.g. 'Animal Name', 'Birth Date'
  editable: boolean;
}
