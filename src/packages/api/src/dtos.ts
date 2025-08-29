
export type AnimalIdentification = {
    id: string;
    flockPrefix: string;
    name: string;
    birthDate: Date | null;
    registrationNumber: string;
}

export type AnimalSearchRequest = {
    name?: string | null;
    status?: string | null;
    registrationNumber?: string | null;

    birthStartDate?: string | null;   // Start date for birth range
    birthEndDate?: string | null;     // End date for birth range
    deathStartDate?: string | null;   // Start date for death range
    deathEndDate?: string | null;     // End date for death range

    federalTag?: string | null;
    farmTag?: string | null;

    isAlreadyPrinted?: boolean | null;
}

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

export type BirthType = {
    id: string;
    name: string;
    abbreviation: string;
    display_order: number;
}

export type Breed = {
    id: string;
    name: string;
    display_order: number;
    species_id: string | null;
}

export type BreedRequest = {
    species_id: string | null;
}

export type Color = {
    id: string;
    name: string;
    display_order: number;
}

export type Company = {
    id: string;
    name: string;
    registry_id?: string;
}

export type Contact = {
    id: string;
    firstName: string;
    lastName: string;
}

export type Country = {
    id: string;
    name: string;
    abbreviation: string;
    display_order: number;
}

export type County = {
    id: string;
    name: string;
    state_id: string;
}

export type DeathReason = {
    id: string;
    name: string;
    display_order: number;
}

export type DefaultSettingsResults = {
    id: string;
    name: string;
    owner_id: string;
    owner_type: OwnerType;
    owner_id_premiseid: string;
    breederType: OwnerType;
    breederId: string;
    breeder_id_premiseid: string;
    transferReasonContactType: OwnerType;
    transferReasonContactId: string;
    vet_id_contactid: string;
    vet_id_premiseid: string;
    lab_id_companyid: string;
    lab_id_premiseid: string;
    id_registry_id_companyid: string;
    registry_id_premiseid: string;
    id_stateid: string;
    id_countyid: string;
    id_flockprefixid: string;
    id_speciesid: string;
    id_breedid: string;
    id_sexid: string;
    id_idtypeid_primary: string;
    id_idtypeid_secondary: string;
    id_idtypeid_tertiary: string;
    id_eid_tag_male_color_female_color_same: number;
    eid_tag_color_male: string;
    eid_tag_color_female: string;
    eid_tag_location: string;
    id_farm_tag_male_color_female_color_same: number;
    farm_tag_based_on_eid_tag: string;
    farm_tag_number_digits_from_eid: string;
    farm_tag_color_male: string;
    farm_tag_color_female: string;
    farm_tag_location: string;
    id_fed_tag_male_color_female_color_same: number;
    fed_tag_color_male: string;
    fed_tag_color_female: string;
    fed_tag_location: string;
    id_nues_tag_male_color_female_color_same: number;
    nues_tag_color_male: string;
    nues_tag_color_female: string;
    nues_tag_location: string;
    id_trich_tag_male_color_female_color_same: number;
    trich_tag_color_male: string;
    trich_tag_color_female: string;
    trich_tag_location: string;
    trich_tag_auto_increment: string;
    trich_tag_next_tag_number: string;
    id_bangs_tag_male_color_female_color_same: number;
    bangs_tag_color_male: string;
    bangs_tag_color_female: string;
    bangs_tag_location: string;
    id_sale_order_tag_male_color_female_color_same: number;
    sale_order_tag_color_male: string;
    sale_order_tag_color_female: string;
    sale_order_tag_location: string;
    use_paint_marks: string;
    paint_mark_color: string;
    paint_mark_location: string;
    tattoo_color: string;
    tattoo_location: string;
    freeze_brand_location: string;
    id_idremovereasonid: string;
    id_tissuesampletypeid: string;
    id_tissuetestid: string;
    id_tissuesamplecontainertypeid: string;
    birth_type: string;
    rear_type: string;
    minimum_birth_weight: number;
    maximum_birth_weight: number;
    birth_weight_id_unitsid: string;
    weight_id_unitsid: string;
    sale_price_id_unitsid: string;
    evaluation_update_alert: string;
    deathReasonOwnerType: OwnerType;
    deathReasonContactId: string;
    id_deathreasonid: string;
    id_transferreasonid: string;
}

export enum OwnerType {
    CONTACT = "contact",
    COMPANY = "company",
}

interface OwnerBase {
    premise: Premise;
    scrapieId: ScrapieFlockInfo | null;
    phoneNumber: string;
    flockId: string;
}

export interface OwnerContact extends OwnerBase {
    type: OwnerType.CONTACT;
    contact: Contact;
}

export interface OwnerCompany extends OwnerBase {
    type: OwnerType.COMPANY;
    company: Company;
}

export type Owner = OwnerContact | OwnerCompany;

export type FlockPrefix = {
    id: string;
    name: string;
    owner_id: string;
    owner_type: OwnerType
    registry_company_id: string | null;
}

export type Premise = {
    id: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
    state: State;
}

export type State = {
    id: string;
    name: string;
    abbreviation: string;
    display_order: number;
    country_id: string;
}

export type RemoveReason = {
    id: string;
    name: string;
    display_order: number;
}

export type Sex = {
    id: string;
    name: string;
    display_order: number;
    species_id: string | null;
}

export type Species = {
    id: string;
    common_name: string;
    generic_name: string;
    scientific_name: string;
}

export type TagLocation = {
    id: string;
    name: string;
    abbreviation: string;
    display_order: number;
}

export type TagType = {
    id: string;
    name: string;
    display_order: number;
}

export type TissueSampleContainerType = {
    id: string;
    name: string;
    display_order: number;
}

export type TissueSampleType = {
    id: string;
    name: string;
    display_order: number;
}

export type TissueTest = {
    id: string;
    name: string;
    display_order: number;
}

export type UnitRequest = {
    unit_type_id: string | null;
    unit_type_name: string | null;
}

export type Unit = {
    id: string;
    name: string;
    unit_type: string;
    display_order: number;
}

export type UnitType = {
    id: string;
    name: string;
    display_order: number;
}

export type NewDefaultSettingsParameters = {
    id: string;
    default_settings_name: string;

    contactType: OwnerType;
    ownerId: string;
    owner_id_premiseid: string;

    breederType: OwnerType;
    breederId: string;
    breeder_id_premiseid: string;

    transferReasonContactType: OwnerType;
    transferReasonContactId: string;

    vet_id_contactid: string;
    vet_id_premiseid: string;
    lab_id_companyid: string;
    lab_id_premiseid: string;
    id_registry_id_companyid: string;
    registry_id_premiseid: string;
    id_stateid: string;
    id_countyid: string;
    id_flockprefixid: string;
    id_speciesid: string;
    id_breedid: string;
    id_sexid: string;
    id_idtypeid_primary: string;
    id_idtypeid_secondary: string;
    id_idtypeid_tertiary: string;
    id_eid_tag_male_color_female_color_same: number;
    eid_tag_color_male: string;
    eid_tag_color_female: string;
    eid_tag_location: string;
    id_farm_tag_male_color_female_color_same: number;
    farm_tag_based_on_eid_tag: string;
    farm_tag_number_digits_from_eid: string;
    farm_tag_color_male: string;
    farm_tag_color_female: string;
    farm_tag_location: string;
    id_fed_tag_male_color_female_color_same: number;
    fed_tag_color_male: string;
    fed_tag_color_female: string;
    fed_tag_location: string;
    id_nues_tag_male_color_female_color_same: number;
    nues_tag_color_male: string;
    nues_tag_color_female: string;
    nues_tag_location: string;
    id_trich_tag_male_color_female_color_same: number;
    trich_tag_color_male: string;
    trich_tag_color_female: string;
    trich_tag_location: string;
    trich_tag_auto_increment: string;
    trich_tag_next_tag_number: string;
    id_bangs_tag_male_color_female_color_same: number;
    bangs_tag_color_male: string;
    bangs_tag_color_female: string;
    bangs_tag_location: string;
    id_sale_order_tag_male_color_female_color_same: number;
    sale_order_tag_color_male: string;
    sale_order_tag_color_female: string;
    sale_order_tag_location: string;
    use_paint_marks: string;
    paint_mark_color: string;
    paint_mark_location: string;
    tattoo_color: string;
    tattoo_location: string;
    freeze_brand_location: string;
    id_idremovereasonid: string;
    id_tissuesampletypeid: string;
    id_tissuetestid: string;
    id_tissuesamplecontainertypeid: string;
    birth_type: string;
    rear_type: string;
    minimum_birth_weight: number;
    maximum_birth_weight: number;
    birth_weight_id_unitsid: string;
    weight_id_unitsid: string;
    sale_price_id_unitsid: string;
    evaluation_update_alert: string;
    death_reason_id_contactid: string;
    death_reason_id_companyid: string;
    id_deathreasonid: string;
    id_transferreasonid: string;
    created: string;
    modified: string;
}

export type PedigreeNode = {
    animalId: string;
    sirePedigree: PedigreeNode | null;
    damPedigree: PedigreeNode | null;
    flockPrefix: string | null;
    animalName: string;
    registrationNumber: string | null;
    sexName: string | null;
    birthDate: Date | null;
    birthType: string | null;
    birthTypeAbbreviation: string | null;
}

export type ScrapieFlockInfo = {
    flockNumberId: string;
    scrapieName: string;
};

export type DatabaseStateCheckResponse = {
    blackVerified     : boolean,
    chocolateVerified : boolean,
    whiteVerified     : boolean,
}

export type ParseResult<T> = {
    data: T;
    warnings: string[];
};

export interface ProcessingResult {
    success: boolean;
    errors?: string[];
    insertedRowCount?: number;
}

export interface RegistryProcessRequest {
    processType: RegistryProcessType;
    species: Species;
    sections: Record<string, RegistryRow[]>;
}

export type RegistryProcessType = 'births' | 'registrations' | 'deaths' | 'transfers';

export interface RegistryRow {
    [key: string]: any;
}

export type BirthParseResponse = {
    rows : BirthParseRow[];
}

export type BirthParseRow = {
    breederId: string;
    breederName: string;
    isStillborn: boolean;
    animalName: string;
    sexKey: string;
    sex: string;
    birthdate: string;
    birthTypeKey: string;
    sireId: string;
    damId: string;
    prefixKey: string;
    prefix: string;
    fedTypeKey: string;
    fedType: string;
    fedColorKey: string;
    fedColor: string;
    fedLocKey: string;
    fedLoc: string;
    fedNum: string;
    farmTypeKey: string;
    farmType: string;
    farmColorKey: string;
    farmColor: string;
    farmLocKey: string;
    farmLoc: string;
    farmNum: string;
    weight: number;
    weightUnitsKey: string;
    weightUnits: string;
    coatColorTableKey: string;
    coatColorKey: string;
    coatColor: string;
    conceptionTypeKey: string;
    conceptionType: string;
    birthNotes: string;
};

export type RegistrationWriteResponse = {
    success: boolean;
    resultingDirectory: string;
    errors: string[];
    warnings: string[];
}

export type RegistrationParseResponse = {
    rows: RegistrationParseRow[];
}


export type RegistrationParseRow = {
    breederId: string;
    breederName: string;
    animalId: string;
    registrationNumber: string;
    animalPrefix: string;
    animalName: string;
    birthdate: string;
    sex: string;
    birthType: string;
    isOfficial: boolean;
    fedTypeKey: string;
    fedType: string;
    fedColorKey: string;
    fedColor: string;
    fedLocKey: string;
    fedLoc: string;
    fedNum: string;
    farmTypeKey: string;
    farmType: string;
    farmColorKey: string;
    farmColor: string;
    farmLocKey: string;
    farmLoc: string;
    farmNum: string;
    coatColorKey: string;
    coatColor: string;
};

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

export type DeathParseResponse = {
    rows: DeathParseRow[];
}

export type DeathParseRow = {
    deathDate: string;
    animalId: string;
    prefixKey: string;
    prefix: string;
    name: string;
    registrationNumber: string;
    reasonKey: string;
    reason: string;
    notes: string;
};

export type TransferReason = {
    id: string;
    name: string;
    display_order: number;
}

// Defines a column in the editable table
export interface RegistryFieldDef {
    key: string;           // e.g. 'animalName', 'birthdate'
    label: string;         // e.g. 'Animal Name', 'Birth Date'
    editable: boolean;
}

export interface ValidationResult {
    rowIndex: number;
    isValid: boolean;
    errors: string[];
}

export type ValidationResponse = {
    checkName: string;
    errors: string[];
    warnings?: string[];
    passed?: boolean;
};

export type BirthInfo = {
    birthType: BirthType;
    birthWeight: Number;
}

export type AnimalRegistrationResult = {
    Codon171: CodonResponse | null;
    Codon136: CodonResponse | null;
    animalIdentification: AnimalIdentification | null;
    officialTag: idTag | null;
    unofficialTag: idTag | null;
    sex: Sex | null;
    FMICRON: string | null;
    secondWeight: number | null;
    Inbreeding: string | null;
    pedigree: PedigreeNode | null;
    breeder: Owner | null;
    owner: Owner | null;
    birthInfo: BirthInfo | null;
    ownerCompanies: Company[] | null;
    breederCompanies: Company[] | null;
}

export type CodonResponse = {
    codon: "Codon 171" | "Codon 136";
    alleles: string;
};

export type idTag = {
    id: string;
    isOfficial: boolean;
    animalId: string;
    idNumber: string;
    idType: idType;
    dateOn: Date;
    maleColor: idColor;
    femaleColor: idColor;
    location: idLocation;
};

export type idType = {
    id: string;
    name: string;
    abbrev: string | null;
}

export type idColor = {
    id: string;
    name: string;
    abbrev: string | null;
}

export type idLocation = {
    id: string;
    name: string;
    abbrev: string;
};

export type TissueTestResult = {
    animalId: string;
    tissueSampleDate: string;
    tissueSampleTime: string;
    tissueSampleTypeName: string;
    tissueSampleTestName: string;
    company: string;
    tissueTestResultsDate: string | null;
    tissueTestResultsTime: string | null;
    tissueTestResults: string | null;
}

export type DrugEvent = {
    drugHistoryId: string;
    animalId: string;
    tradeName: string;
    genericDrugName: string;
    drugLot: string;
    dateOn: string;
    timeOn: string;
    dateOff: string | null;
    timeOff: string | null;
    dosage: string;
    locationId: string;
    locationName: string;
}

export type AnimalNote = {
    noteId: string;
    animalId: string;
    noteText: string;
    predefinedNote: string;
    noteDate: string;
    noteTime: string;
}

export type CoatColor = {
    id: string;
    name: string;
    abbrev: string;
    registryCompanyId: string;
}

export type RegistryType = "black" | "badger face" | "chocolate" | "white";

export type AnimalIdInfoInput = {
    animalId: string;
    idType: string;
    idColor: string;
    idLocation: string;
    dateOn: string; // Format: YYYY-MM-DD
    idValue: string;
    idScrapieFlock: string | null;
    isOfficial: boolean;
};
