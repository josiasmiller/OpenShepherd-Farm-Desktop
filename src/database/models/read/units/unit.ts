
export interface UnitQueryParameters {
  unit_type_id: string | null;
  unit_type_name: string | null;
}

export interface UnitInfo {
  id: string;
  name: string;
  unit_type: number;
  display_order: number;
}
          