
export type BreedRequest = {
  species_id: string | null;
}

export type Breed = {
  id: string;
  name: string;
  display_order: number;
  species_id: string | null;
}
          