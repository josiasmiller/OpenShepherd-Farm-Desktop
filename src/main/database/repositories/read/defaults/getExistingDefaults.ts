import {Database} from "sqlite3";
import { OwnerType, DefaultSettingsResults } from '@app/api';
import { Result, Success, Failure } from "@common/core";

/**
 * gets all default settings in the DB
 * @param db The Database to act on
 * @returns A `Result` containing an array of `DefaultSettingsResults` objects on success, 
 *          or a string error message on failure.
 */
export const getExistingDefaults = async (db: Database): Promise<Result<DefaultSettingsResults[], string>> => {

  let defaultsQuery = `
    SELECT 
      *
    FROM animaltrakker_default_settings_table`;

  return new Promise((resolve, reject) => {
    db.all(defaultsQuery, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const results: DefaultSettingsResults[] = rows.map((row: any) => {
          let owner_id: string;
          let owner_type: OwnerType;
        
          if (row.owner_id_contactid != null) {
            owner_id = String(row.owner_id_contactid);
            owner_type = OwnerType.CONTACT;
          } else if (row.owner_id_companyid != null) {
            owner_id = String(row.owner_id_companyid);
            owner_type = OwnerType.COMPANY;
          } else {
            return null; // Return null if no valid owner, this is filtered later
          }

          let deathReasonContactId: string;
          let deathReasonContactType: OwnerType;
        
          if (row.death_reason_id_contactid != null) {
            deathReasonContactId = String(row.death_reason_id_contactid);
            deathReasonContactType = OwnerType.CONTACT;
          } else if (row.death_reason_id_companyid != null) {
            deathReasonContactId = String(row.death_reason_id_companyid);
            deathReasonContactType = OwnerType.COMPANY;
          } else {
            // for now use generic data for the death reason & company
            deathReasonContactId = "700";
            deathReasonContactType = OwnerType.COMPANY;
          }

          let breederId: string;
          let breederType: OwnerType;
        
          if (row.breeder_id_contactid != null) {
            breederId = String(row.breeder_id_contactid);
            breederType = OwnerType.CONTACT;
          } else if (row.breeder_id_companyid != null) {
            breederId = String(row.breeder_id_companyid);
            breederType = OwnerType.COMPANY;
          } else {
            return null; // Return null if no valid owner, this is filtered later
          }

          let transferReasonId: string;
          let transferReasonType: OwnerType;
        
          if (row.transfer_reason_id_contactid != null) {
            transferReasonId = String(row.transfer_reason_id_contactid);
            transferReasonType = OwnerType.CONTACT;
          } else if (row.transfer_reason_id_companyid != null) {
            transferReasonId = String(row.transfer_reason_id_companyid);
            transferReasonType = OwnerType.COMPANY;
          } else {
            transferReasonId = "700";
            transferReasonType = OwnerType.COMPANY;
          }

          return {
            id: row.id_animaltrakkerdefaultsettingsid,
            name: row.default_settings_name,
            owner_id: owner_id,
            owner_type: owner_type,
            owner_id_premiseid: String(row.owner_id_premiseid),
            breederType: breederType,
            breederId: breederId,
            breeder_id_premiseid: String(row.breeder_id_premiseid),
            vet_id_contactid: String(row.vet_id_contactid),
            vet_id_premiseid: String(row.vet_id_premiseid),
            lab_id_companyid: String(row.lab_id_companyid),
            lab_id_premiseid: String(row.lab_id_premiseid),
            id_registry_id_companyid: String(row.id_registry_id_companyid),
            registry_id_premiseid: String(row.registry_id_premiseid),
            id_stateid: String(row.id_stateid),
            id_countyid: String(row.id_countyid),
            id_flockprefixid: String(row.id_flockprefixid),
            id_speciesid: String(row.id_speciesid),
            id_breedid: String(row.id_breedid),
            id_sexid: String(row.id_sexid),
            id_idtypeid_primary: String(row.id_idtypeid_primary),
            id_idtypeid_secondary: String(row.id_idtypeid_secondary),
            id_idtypeid_tertiary: String(row.id_idtypeid_tertiary),
            id_eid_tag_male_color_female_color_same: Number(row.id_eid_tag_male_color_female_color_same),
            eid_tag_color_male: String(row.eid_tag_color_male),
            eid_tag_color_female: String(row.eid_tag_color_female),
            eid_tag_location: String(row.eid_tag_location),
            id_farm_tag_male_color_female_color_same: Number(row.id_farm_tag_male_color_female_color_same),
            farm_tag_based_on_eid_tag: String(row.farm_tag_based_on_eid_tag),
            farm_tag_number_digits_from_eid: String(row.farm_tag_number_digits_from_eid),
            farm_tag_color_male: String(row.farm_tag_color_male),
            farm_tag_color_female: String(row.farm_tag_color_female),
            farm_tag_location: String(row.farm_tag_location),
            id_fed_tag_male_color_female_color_same: Number(row.id_fed_tag_male_color_female_color_same),
            fed_tag_color_male: String(row.fed_tag_color_male),
            fed_tag_color_female: String(row.fed_tag_color_female),
            fed_tag_location: String(row.fed_tag_location),
            id_nues_tag_male_color_female_color_same: Number(row.id_nues_tag_male_color_female_color_same),
            nues_tag_color_male: String(row.nues_tag_color_male),
            nues_tag_color_female: String(row.nues_tag_color_female),
            nues_tag_location: String(row.nues_tag_location),
            id_trich_tag_male_color_female_color_same: Number(row.id_trich_tag_male_color_female_color_same),
            trich_tag_color_male: String(row.trich_tag_color_male),
            trich_tag_color_female: String(row.trich_tag_color_female),
            trich_tag_location: String(row.trich_tag_location),
            trich_tag_auto_increment: String(row.trich_tag_auto_increment),
            trich_tag_next_tag_number: String(row.trich_tag_next_tag_number),
            id_bangs_tag_male_color_female_color_same: Number(row.id_bangs_tag_male_color_female_color_same),
            bangs_tag_color_male: String(row.bangs_tag_color_male),
            bangs_tag_color_female: String(row.bangs_tag_color_female),
            bangs_tag_location: String(row.bangs_tag_location),
            id_sale_order_tag_male_color_female_color_same: Number(row.id_sale_order_tag_male_color_female_color_same),
            sale_order_tag_color_male: String(row.sale_order_tag_color_male),
            sale_order_tag_color_female: String(row.sale_order_tag_color_female),
            sale_order_tag_location: String(row.sale_order_tag_location),
            use_paint_marks: String(row.use_paint_marks),
            paint_mark_color: String(row.paint_mark_color),
            paint_mark_location: String(row.paint_mark_location),
            tattoo_color: String(row.tattoo_color),
            tattoo_location: String(row.tattoo_location),
            freeze_brand_location: String(row.freeze_brand_location),
            id_idremovereasonid: String(row.id_idremovereasonid),
            id_tissuesampletypeid: String(row.id_tissuesampletypeid),
            id_tissuetestid: String(row.id_tissuetestid),
            id_tissuesamplecontainertypeid: String(row.id_tissuesamplecontainertypeid),
            birth_type: String(row.birth_type),
            rear_type: String(row.rear_type),
            minimum_birth_weight: row.minimum_birth_weight,
            maximum_birth_weight: row.maximum_birth_weight,
            birth_weight_id_unitsid: String(row.birth_weight_id_unitsid),
            weight_id_unitsid: String(row.weight_id_unitsid),
            sale_price_id_unitsid: String(row.sale_price_id_unitsid),
            evaluation_update_alert: String(row.evaluation_update_alert),
            deathReasonOwnerType: deathReasonContactType,
            deathReasonContactId: deathReasonContactId,
            id_deathreasonid: String(row.id_deathreasonid),
            transferReasonContactType: transferReasonType,
            transferReasonContactId: transferReasonId,
            id_transferreasonid: String(row.id_transferreasonid),
          };
        })
        .filter((item) => item !== null); // filter out any invalid rows
        
        resolve(new Success(results));
      }
    });
  });
    
};