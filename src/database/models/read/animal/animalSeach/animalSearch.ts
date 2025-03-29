  
  
export type AnimalSearchResult = {
  animal_id: string;
  flock_prefix: string | null,
  name: string;
  birthDate: string | null;
  deathDate: string | null;
}

export type AnimalSearchRequest = {
  name?: string | null;
  status?: string | null;         
  registrationType?: string | null;
  registrationNumber?: string | null;
  birthStartDate?: string | null;   // Start date for birth range
  birthEndDate?: string | null;     // End date for birth range
  deathStartDate?: string | null;   // Start date for death range
  deathEndDate?: string | null;     // End date for death range
}