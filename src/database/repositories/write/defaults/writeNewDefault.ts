import { getDatabase } from "../../../dbConnections.js";
import { OwnerType } from "../../../models/read/owners/ownerType.js";
import { WriteNewDefaultParameters } from "../../../models/write/defaults/writeNewDefault.js";

export const writeNewDefaultSettings = async (queryParams: WriteNewDefaultParameters): Promise<boolean> => {
  const db = await getDatabase();
  if (db == null) {
    throw new TypeError("DB Instance is null");
  }

  const placeholders = columns.map(() => "?").join(", "); // Creates "?, ?, ?, ..." 
  const query = `
    INSERT INTO animaltrakker_default_settings_table (${columns.join(", ")})
    VALUES (${placeholders})
  `;

  return new Promise((resolve, reject) => {
    db.all(query, _getValues(queryParams), (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const _getValues = (queryParams: WriteNewDefaultParameters): string[] => {

  var ownerContactId: string = "0";
  var ownerCompanyId: string = "0";

  if (queryParams.contactType === OwnerType.CONTACT) {
    ownerContactId = queryParams.ownerId;
  } else if (queryParams.contactType === OwnerType.COMPANY) {
    ownerCompanyId = queryParams.ownerId;
  } else {
    throw new TypeError(`Invalid contactType of writeDefaultParameters: ${queryParams.contactType}`)
  }

  const values = [
    queryParams.default_settings_name,
    ownerContactId,
    ownerCompanyId,
    queryParams.owner_id_premiseid,
    queryParams.breeder_id_contactid,
    queryParams.breeder_id_companyid,
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
    queryParams.id_speciesid,
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
    queryParams.evaluation_update_alert,
    queryParams.death_reason_id_contactid,
    queryParams.death_reason_id_companyid,
    queryParams.id_deathreasonid,
    queryParams.transfer_reason_id_contactid,
    queryParams.transfer_reason_id_companyid,
    queryParams.id_transferreasonid,
    queryParams.created,
    queryParams.modified
  ].map(value => String(value)); // Convert each value to a string

  return values;
};


// columns for creating a new Default Settings
const columns = [
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
  "id_speciesid",
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
  "evaluation_update_alert", 
  "death_reason_id_contactid",
  "death_reason_id_companyid", 
  "id_deathreasonid", 
  "transfer_reason_id_contactid",
  "transfer_reason_id_companyid", 
  "id_transferreasonid", 
  "created", 
  "modified",
];

