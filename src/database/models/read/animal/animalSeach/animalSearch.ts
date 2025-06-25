  
  
export type AnimalSearchResult = {
  animal_id: string;
  flockPrefix: string,
  name: string;
  registration: string | null;
  birthDate: string;
  deathDate: string | null;
  sex: string; 
  birthType: string;
  latestOfficialID: string | null;
  latestFarmID: string | null;
  sireFlockPrefix: string | null;
  sireName: string | null;
  damFlockPrefix: string | null;
  damName: string | null;
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

  federalTag?: string | null;
  farmTag?: string | null;

  isAlreadyPrinted?: boolean | null;
}