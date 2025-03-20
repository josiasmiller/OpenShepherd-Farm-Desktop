
export type BreedQueryParameters = {
  species_id: string | null;
}

export type BreedInfo = {
  id: string;
  name: string;
  display_order: number;
  species_id: number;
}
          