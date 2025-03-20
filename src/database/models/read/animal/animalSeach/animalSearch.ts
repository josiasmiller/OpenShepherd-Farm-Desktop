  
  
export type AnimalSearchResults = {
  animal_id?: string | null;
  flock_prefix: string | null,
  name: string;
  birthDate: string | null;
  deathDate: string | null;
}

export type AnimalSearchQueryParameters = {
  name?: string | null;
  status?: string | null;         // Status could be a dropdown field
  registrationType?: string | null;  // Registration Type
  registrationNumber?: string | null;
  birthStartDate?: string | null;   // Start date for birth range
  birthEndDate?: string | null;     // End date for birth range
  deathStartDate?: string | null;   // Start date for death range
  deathEndDate?: string | null;     // End date for death range
}