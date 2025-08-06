export type TransferParseResponse = {
  animals: AnimalRow[];                  // from first section of transfers CSV
  seller: SellerInfo;                    // second section of transfers CSV
  buyer: ExistingMemberBuyer | NewBuyer; // third section (mutually exclusive)
};

export type AnimalRow = {
  animalId: string;
  registrationNumber: string;
  prefix: string;
  name: string;
  birthDate: string;
  birthType: string;
  sex: string;
  coatColor: string;
};

export type SellerInfo = {
  contactId: string;
  companyId: string;
  premiseId: string;
  soldAt: string;
  movedAt: string;
};

export type ExistingMemberBuyer = {
  membershipNumber: string;
  contactId: string;
  companyId: string;
  premiseId: string;
  firstName: string;
  lastName: string;
  region: string;
};

export type NewBuyer = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  stateKey: string;
  state: string;
  postCode: string;
  federalScrapieId: string;
  federalPremiseId: string;
  statePremiseId: string;
  longitude?: string;
  latitude?: string;
  primaryPhone?: string;
  mobilePhone?: string;
  email?: string;
  website?: string;
};
