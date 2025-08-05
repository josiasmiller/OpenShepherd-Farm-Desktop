import { OwnerType } from "../../../models/read/owners/ownerType";
import { NewDefaultSettingsParameters } from "../../../models/write/defaults/newDefaultSettings";
import { v4 as uuidv4 } from 'uuid';



export const getAnimalDefaultValues = (queryParams: NewDefaultSettingsParameters): any[] => {

  var ownerContactId: string | null = null;
  var ownerCompanyId: string | null = null;

  if (queryParams.contactType === OwnerType.CONTACT) {
    ownerContactId = queryParams.ownerId;
  } else if (queryParams.contactType === OwnerType.COMPANY) {
    ownerCompanyId = queryParams.ownerId;
  } else {
    throw new TypeError(`Invalid contactType of writeDefaultParameters: ${queryParams.contactType}`)
  }

  var breederContactId: string | null = null;
  var breederCompanyId: string | null = null;

  if (queryParams.breederType === OwnerType.CONTACT) {
    breederContactId = queryParams.breederId;
  } else if (queryParams.breederType === OwnerType.COMPANY) {
    breederCompanyId = queryParams.breederId;
  } else {
    throw new TypeError(`Invalid contactType of writeDefaultParameters: ${queryParams.contactType}`)
  }

  const newId = uuidv4();

  const values = [
    newId,
    queryParams.default_settings_name,
    ownerContactId,
    ownerCompanyId,
    queryParams.owner_id_premiseid,
    breederContactId,
    breederCompanyId,
    queryParams.breeder_id_premiseid,
    queryParams.vet_id_contactid,
    queryParams.vet_id_premiseid,
    queryParams.lab_id_companyid,
    queryParams.lab_id_premiseid,
    queryParams.id_registry_id_companyid,
    queryParams.registry_id_premiseid,
    queryParams.id_stateid,
    queryParams.id_countyid,
    queryParams.id_flockprefixid,
    queryParams.id_breedid,
    queryParams.id_sexid,
    queryParams.id_idtypeid_primary,
    queryParams.id_idtypeid_secondary,
    queryParams.id_idtypeid_tertiary,
    queryParams.id_eid_tag_male_color_female_color_same,
    queryParams.eid_tag_color_male,
    queryParams.eid_tag_color_female,
    queryParams.eid_tag_location,
    queryParams.id_farm_tag_male_color_female_color_same,
    queryParams.farm_tag_based_on_eid_tag,
    queryParams.farm_tag_number_digits_from_eid,
    queryParams.farm_tag_color_male,
    queryParams.farm_tag_color_female,
    queryParams.farm_tag_location,
    queryParams.id_fed_tag_male_color_female_color_same,
    queryParams.fed_tag_color_male,
    queryParams.fed_tag_color_female,
    queryParams.fed_tag_location,
    queryParams.id_nues_tag_male_color_female_color_same,
    queryParams.nues_tag_color_male,
    queryParams.nues_tag_color_female,
    queryParams.nues_tag_location,
    queryParams.id_trich_tag_male_color_female_color_same,
    queryParams.trich_tag_color_male,
    queryParams.trich_tag_color_female,
    queryParams.trich_tag_location,
    queryParams.trich_tag_auto_increment,
    queryParams.trich_tag_next_tag_number,
    queryParams.id_bangs_tag_male_color_female_color_same,
    queryParams.bangs_tag_color_male,
    queryParams.bangs_tag_color_female,
    queryParams.bangs_tag_location,
    queryParams.id_sale_order_tag_male_color_female_color_same,
    queryParams.sale_order_tag_color_male,
    queryParams.sale_order_tag_color_female,
    queryParams.sale_order_tag_location,
    queryParams.use_paint_marks,
    queryParams.paint_mark_color,
    queryParams.paint_mark_location,
    queryParams.tattoo_color,
    queryParams.tattoo_location,
    queryParams.freeze_brand_location,
    queryParams.id_idremovereasonid,
    queryParams.id_tissuesampletypeid,
    queryParams.id_tissuetestid,
    queryParams.id_tissuesamplecontainertypeid,
    queryParams.birth_type,
    queryParams.rear_type,
    queryParams.minimum_birth_weight,
    queryParams.maximum_birth_weight,
    queryParams.birth_weight_id_unitsid,
    queryParams.weight_id_unitsid,
    queryParams.sale_price_id_unitsid,
    queryParams.death_reason_id_contactid,
    queryParams.death_reason_id_companyid,
    queryParams.id_deathreasonid,
    queryParams.id_transferreasonid,
    queryParams.created,
    queryParams.modified
  ];

  return values;
};


// columns for creating a new Default Settings
export const animalDefaultColumns = [
  "id_animaltrakkerdefaultsettingsid",
  "default_settings_name",
  "owner_id_contactid",
  "owner_id_companyid", 
  "owner_id_premiseid",
  "breeder_id_contactid", 
  "breeder_id_companyid", 
  "breeder_id_premiseid", 
  "vet_id_contactid",
  "vet_id_premiseid", 
  "lab_id_companyid", 
  "lab_id_premiseid", 
  "id_registry_id_companyid",
  "registry_id_premiseid", 
  "id_stateid", 
  "id_countyid", 
  "id_flockprefixid", 
  "id_breedid", 
  "id_sexid", 
  "id_idtypeid_primary", 
  "id_idtypeid_secondary", 
  "id_idtypeid_tertiary",
  "id_eid_tag_male_color_female_color_same", 
  "eid_tag_color_male", 
  "eid_tag_color_female", 
  "eid_tag_location",
  "id_farm_tag_male_color_female_color_same", 
  "farm_tag_based_on_eid_tag", 
  "farm_tag_number_digits_from_eid",
  "farm_tag_color_male", 
  "farm_tag_color_female", 
  "farm_tag_location", 
  "id_fed_tag_male_color_female_color_same",
  "fed_tag_color_male", 
  "fed_tag_color_female", 
  "fed_tag_location", 
  "id_nues_tag_male_color_female_color_same",
  "nues_tag_color_male", 
  "nues_tag_color_female", 
  "nues_tag_location", 
  "id_trich_tag_male_color_female_color_same",
  "trich_tag_color_male", 
  "trich_tag_color_female", 
  "trich_tag_location", 
  "trich_tag_auto_increment",
  "trich_tag_next_tag_number", 
  "id_bangs_tag_male_color_female_color_same", 
  "bangs_tag_color_male",
  "bangs_tag_color_female", 
  "bangs_tag_location", 
  "id_sale_order_tag_male_color_female_color_same",
  "sale_order_tag_color_male", 
  "sale_order_tag_color_female", 
  "sale_order_tag_location", 
  "use_paint_marks",
  "paint_mark_color", 
  "paint_mark_location", 
  "tattoo_color", 
  "tattoo_location", 
  "freeze_brand_location",
  "id_idremovereasonid", 
  "id_tissuesampletypeid", 
  "id_tissuetestid", 
  "id_tissuesamplecontainertypeid",
  "birth_type", 
  "rear_type", 
  "minimum_birth_weight", 
  "maximum_birth_weight", 
  "birth_weight_id_unitsid",
  "weight_id_unitsid", 
  "sale_price_id_unitsid", 
  "death_reason_id_contactid",
  "death_reason_id_companyid", 
  "id_deathreasonid", 
  "id_transferreasonid", 
  "created", 
  "modified",
];