
export type UnitRequest = {
  unit_type_id: string | null;
  unit_type_name: string | null;
}

export type Unit = {
  id: string;
  name: string;
  unit_type: number;
  display_order: number;
}
          