import { 
  BirthType,
  Breed,
  BreedRequest,
  Color, 
  Company, 
  County, 
  DeathReason, 
  DefaultSettingsResults, 
  FlockPrefix, 
  Location, 
  Owner, 
  OwnerType,
  Premise, 
  RemoveReason, 
  Sex, 
  Species, 
  State,
  TagType,
  TissueSampleContainerType,
  TissueSampleType,
  TissueTest,
  TransferReason,
  Unit,
  UnitRequest,
  WriteNewDefaultParameters,
} from "../../../../database";

import React, { useEffect, useState } from "react";
import { handleResult } from "../../../../shared/results/resultTypes";

type DropdownTerm = {
  label: string;
  id: string;
  [key: string]: string;
};

const CreateDefaults: React.FC = () => {
  const [ownerContacts, setOwnerContacts] = useState<Owner[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [premises, setPremises] = useState<DropdownTerm[]>([]);

  useEffect(() => {
    const loadData = async () => {
      ///////////////////////////////////////////////////////////////////
      // Get Owners (contacts)
      try {
        const result = await (window as any).electronAPI.getOwnerInfo();
  
        handleResult(result, {
          success: (data : Owner[]) => {
            setOwnerContacts(data);
          },
          error: (err) => {
            console.error("Failed to fetch owners:", err);
          },
        });
      } catch (err) {
        console.error("Unexpected error during getOwners:", err);
      }
  
      ///////////////////////////////////////////////////////////////////
      // Get Companies
      try {
        const result = await (window as any).electronAPI.getCompanyInfo(false); // or true if filtering registry companies
  
        handleResult(result, {
          success: (data: Company[]) => {
            setCompanies(data);
          },
          error: (err) => {
            console.error("Failed to fetch companies:", err);
          },
        });
      } catch (err) {
        console.error("Unexpected error during getCompanies:", err);
      }

    };
  
    loadData();
  }, []);


  return (
    <div className="container">
      {/* Top Section */}
      <div className="create-defaults-top-section">
        <h2>Default Settings</h2>
        <button id="create-default-btn" className="forward-button">
          Create New Default
        </button>
      </div>

      {/* Bottom Section */}
      <div className="create-defaults-bottom-section">
        <form id="defaults-form">

          {/* Existing Setting Selection */}
          <div className="existing-setting-container">
            <label htmlFor="existing-settings">Start from Existing Setting:</label>
            <select id="existing-settings" name="existing-settings">
              <option value="" disabled selected>Select a setting...</option>
              {/* More options will be added dynamically */}
            </select>

            {/* Load Default Button */}
            <button id="load-default-btn" type="button">
              Load Default
            </button>
          </div>

          <label htmlFor="settings_name">Settings Name:</label>
          <input type="text" id="settings_name" name="settings_name" />

          <div className="section-break"></div>
          <h2>Contacts, Companies, & Premises</h2>
          <hr />

          {/* Owner Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input type="radio" id="select_contact" name="owner_selection" defaultChecked />
                Contact
              </label>
              <label>
                <input type="radio" id="select_company" name="owner_selection" />
                Company
              </label>
            </div>

            <label htmlFor="owner_id_contactid">Owner Contact:</label>
            <select id="owner_id_contactid" name="owner_id_contactid">
              <option value="">Select a contact...</option>
              {ownerContacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>

            <label htmlFor="owner_id_companyid">Owner Company:</label>
            <select id="owner_id_companyid" name="owner_id_companyid">
              <option value="">Select a company...</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>

            <label htmlFor="owner_id_premiseid">Owner Premise:</label>
            <select id="owner_id_premiseid" name="owner_id_premiseid" />
          </div>

          {/* Breeder Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input type="radio" id="breeder_select_contact" name="breeder_selection" defaultChecked />
                Contact
              </label>
              <label>
                <input type="radio" id="breeder_select_company" name="breeder_selection" />
                Company
              </label>
            </div>

            <label htmlFor="breeder_id_contactid">Breeder Contact:</label>
            <select id="breeder_id_contactid" name="breeder_id_contactid" disabled />

            <label htmlFor="breeder_id_companyid">Breeder Company:</label>
            <select id="breeder_id_companyid" name="breeder_id_companyid" disabled />

            <label htmlFor="breeder_id_premiseid">Breeder Premise:</label>
            <select id="breeder_id_premiseid" name="breeder_id_premiseid" />
          </div>

          {/* Transfer Reason Selection */}
          <div className="form-group">
            <div className="radio-group">
              <label>
                <input type="radio" id="transfer_reason_select_contact" name="transfer_reason_selection" defaultChecked />
                Contact
              </label>
              <label>
                <input type="radio" id="transfer_reason_select_company" name="transfer_reason_selection" />
                Company
              </label>
            </div>
            <label htmlFor="transfer_reason_id_contactid">Transfer Reason Contact:</label>
            <select id="transfer_reason_id_contactid" name="transfer_reason_id_contactid" disabled />

            <label htmlFor="transfer_reason_id_companyid">Transfer Reason Company:</label>
            <select id="transfer_reason_id_companyid" name="transfer_reason_id_companyid" disabled />
          </div>

          <div className="section-break"></div>
          <div className="form-group">
            <label htmlFor="vet_id_contactid">Vet Contact:</label>
            <select id="vet_id_contactid" name="vet_id_contactid" />

            <label htmlFor="vet_id_premiseid">Vet Premise:</label>
            <select id="vet_id_premiseid" name="vet_id_premiseid" />
          </div>

          {/* More sections follow in similar structure */}
          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="lab_id_companyid">Lab Company:</label>
          <select id="lab_id_companyid" name="lab_id_companyid"></select>

          <label htmlFor="lab_id_premiseid">Lab Premise:</label>
          <select id="lab_id_premiseid" name="lab_id_premiseid"></select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_registry_id_companyid">Registry Company:</label>
          <select id="id_registry_id_companyid" name="id_registry_id_companyid"></select>

          <label htmlFor="registry_id_premiseid">Registry Premise:</label>
          <select id="registry_id_premiseid" name="registry_id_premiseid"></select>
          </div>

          <div className="section-break"></div>
          <h2>Locations</h2>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_stateid">State:</label>
          <select id="id_stateid" name="id_stateid"></select>

          <label htmlFor="id_countyid">County:</label>
          <select id="id_countyid" name="id_countyid"></select>
          </div>

          <div className="section-break"></div>
          <h2>Tag Information</h2>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_idtypeid_primary">Primary ID Type:</label>
          <select id="id_idtypeid_primary" name="id_idtypeid_primary"></select>

          <label htmlFor="id_idtypeid_secondary">Secondary ID Type:</label>
          <select id="id_idtypeid_secondary" name="id_idtypeid_secondary"></select>

          <label htmlFor="id_idtypeid_tertiary">Tertiary ID Type:</label>
          <select id="id_idtypeid_tertiary" name="id_idtypeid_tertiary"></select>
          </div>

          <div className="section-break"></div>
          <h3>EID Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_eid_tag_male_color_female_color_same">EID Tag Male/Female Same Color:</label>
          <select id="id_eid_tag_male_color_female_color_same" name="id_eid_tag_male_color_female_color_same"></select>

          <label htmlFor="eid_tag_color_male">EID Tag Color Male:</label>
          <select id="eid_tag_color_male" name="eid_tag_color_male"></select>

          <label htmlFor="eid_tag_color_female">EID Tag Color Female:</label>
          <select id="eid_tag_color_female" name="eid_tag_color_female"></select>

          <label htmlFor="eid_tag_location">EID Tag Location:</label>
          <select id="eid_tag_location" name="eid_tag_location"></select>
          </div>

          <div className="section-break"></div>
          <h3>Farm Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_farm_tag_male_color_female_color_same">Farm Tag Male/Female Same Color:</label>
          <select id="id_farm_tag_male_color_female_color_same" name="id_farm_tag_male_color_female_color_same"></select>

          <label htmlFor="farm_tag_color_male">Farm Tag Color Male Side:</label>
          <select id="farm_tag_color_male" name="farm_tag_color_male"></select>

          <label htmlFor="farm_tag_color_female">Farm Tag Color Female Side:</label>
          <select id="farm_tag_color_female" name="farm_tag_color_female"></select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="farm_tag_based_on_eid_tag">Farm Tag Based on EID Tag:</label>
          <select id="farm_tag_based_on_eid_tag" name="farm_tag_based_on_eid_tag"></select>

          <label htmlFor="farm_tag_number_digits_from_eid">Farm Tag Number Digits from EID:</label>
          <input type="number" id="farm_tag_number_digits_from_eid" name="farm_tag_number_digits_from_eid" min="0" step="1" />

          <label htmlFor="farm_tag_location">Farm Tag Location:</label>
          <select id="farm_tag_location" name="farm_tag_location"></select>
          </div>

          <div className="section-break"></div>
          <h3>Federal Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_fed_tag_male_color_female_color_same">Federal Tag Male/Female Same Color:</label>
          <select id="id_fed_tag_male_color_female_color_same" name="id_fed_tag_male_color_female_color_same"></select>

          <label htmlFor="fed_tag_color_male">Federal Tag Color Male Side:</label>
          <select id="fed_tag_color_male" name="fed_tag_color_male"></select>

          <label htmlFor="fed_tag_color_female">Federal Tag Color Female Side:</label>
          <select id="fed_tag_color_female" name="fed_tag_color_female"></select>

          <label htmlFor="fed_tag_location">Federal Tag Location:</label>
          <select id="fed_tag_location" name="fed_tag_location"></select>
          </div>

          <div className="section-break"></div>
          <h3>NUES Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_nues_tag_male_color_female_color_same">NUES Tag Male/Female Same Color:</label>
          <select id="id_nues_tag_male_color_female_color_same" name="id_nues_tag_male_color_female_color_same"></select>

          <label htmlFor="nues_tag_color_male">NUES Tag Color Male Side:</label>
          <select id="nues_tag_color_male" name="nues_tag_color_male"></select>

          <label htmlFor="nues_tag_color_female">NUES Tag Color Female Side:</label>
          <select id="nues_tag_color_female" name="nues_tag_color_female"></select>

          <label htmlFor="nues_tag_location">NUES Tag Location:</label>
          <select id="nues_tag_location" name="nues_tag_location"></select>
          </div>

          <div className="section-break"></div>
          <h3>Trich Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_trich_tag_male_color_female_color_same">Trich Tag Male/Female Same Color:</label>
          <select id="id_trich_tag_male_color_female_color_same" name="id_trich_tag_male_color_female_color_same"></select>

          <label htmlFor="trich_tag_color_male">Trich Tag Color Male Side:</label>
          <select id="trich_tag_color_male" name="trich_tag_color_male"></select>

          <label htmlFor="trich_tag_color_female">Trich Tag Color Female Side:</label>
          <select id="trich_tag_color_female" name="trich_tag_color_female"></select>

          <label htmlFor="trich_tag_location">Trich Tag Location:</label>
          <select id="trich_tag_location" name="trich_tag_location"></select>

          <label htmlFor="trich_tag_auto_increment">Trich Tag Auto Increment:</label>
          <select id="trich_tag_auto_increment" name="trich_tag_auto_increment"></select>

          <label htmlFor="trich_tag_starting_value">Trich Tag Auto Increment Starting Value:</label>
          <input type="number" id="trich_tag_starting_value" name="trich_tag_starting_value" min="0" step="1" />
          </div>

          <div className="section-break"></div>
          <h3>Bangs Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_bangs_tag_male_color_female_color_same">Bangs Male and Female Color Same:</label>
          <select id="id_bangs_tag_male_color_female_color_same" name="id_bangs_tag_male_color_female_color_same"></select>

          <label htmlFor="bangs_tag_color_male">Bangs Tag Color Male Side:</label>
          <select id="bangs_tag_color_male" name="bangs_tag_color_male"></select>

          <label htmlFor="bangs_tag_color_female">Bangs Tag Color Female Side:</label>
          <select id="bangs_tag_color_female" name="bangs_tag_color_female"></select>

          <label htmlFor="bangs_tag_location">Bangs Tag Location:</label>
          <select id="bangs_tag_location" name="bangs_tag_location"></select>
          </div>

          <div className="section-break"></div>
          <h3>Sale Order Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_sale_order_tag_male_color_female_color_same">Sale Order Male and Female Color Same:</label>
          <select id="id_sale_order_tag_male_color_female_color_same" name="id_sale_order_tag_male_color_female_color_same"></select>

          <label htmlFor="sale_order_tag_color_male">Sale Order Tag Color Male Side:</label>
          <select id="sale_order_tag_color_male" name="sale_order_tag_color_male"></select>

          <label htmlFor="sale_order_tag_color_female">Sale Order Tag Color Female Side:</label>
          <select id="sale_order_tag_color_female" name="sale_order_tag_color_female"></select>

          <label htmlFor="sale_order_tag_location">Sale Order Tag Location:</label>
          <select id="sale_order_tag_location" name="sale_order_tag_location"></select>
          </div>

          <div className="section-break"></div>
          <h3>Misc Tag Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="use_paint_marks">Use Paint Marks:</label>
          <select id="use_paint_marks" name="use_paint_marks"></select>

          <label htmlFor="paint_mark_color">Paint Mark Color:</label>
          <select id="paint_mark_color" name="paint_mark_color"></select>

          <label htmlFor="paint_mark_location">Paint Mark Location:</label>
          <select id="paint_mark_location" name="paint_mark_location"></select>
          </div>

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="tattoo_color">Tattoo Color:</label>
          <select id="tattoo_color" name="tattoo_color"></select>

          <label htmlFor="tattoo_location">Tattoo Location:</label>
          <select id="tattoo_location" name="tattoo_location"></select>
          </div>

          <label htmlFor="freeze_brand_location">Freeze Brand Location:</label>
          <select id="freeze_brand_location" name="freeze_brand_location"></select>

          <label htmlFor="id_idremovereasonid">ID Remove Reason:</label>
          <select id="id_idremovereasonid" name="id_idremovereasonid"></select>

          <div className="section-break"></div>
          <h3>Tissue Sample Information</h3>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_tissuesampletypeid">Tissue Sample Type:</label>
          <select id="id_tissuesampletypeid" name="id_tissuesampletypeid"></select>

          <label htmlFor="id_tissuetestid">Tissue Test:</label>
          <select id="id_tissuetestid" name="id_tissuetestid"></select>

          <label htmlFor="id_tissuesamplecontainertypeid">Tissue Sample Container Type:</label>
          <select id="id_tissuesamplecontainertypeid" name="id_tissuesamplecontainertypeid"></select>
          </div>

          <div className="section-break"></div>
          <h2>Animal Information</h2>
          <hr />

          <div className="section-break"></div>
          <div className="form-group">
          <label htmlFor="id_speciesid">Species:</label>
          <select id="id_speciesid" name="id_speciesid">
              <option value="" selected disabled>Select a species...</option>
          </select>

          <label htmlFor="id_breedid">Breed:</label>
          <select id="id_breedid" name="id_breedid" disabled>
              <option value="" selected disabled>Select a breed...</option>
          </select>
          </div>

          <label htmlFor="id_flockprefixid">Flock Prefix:</label>
          <select id="id_flockprefixid" name="id_flockprefixid"></select>

          <label htmlFor="id_sexid">Sex:</label>
          <select id="id_sexid" name="id_sexid"></select>

          <label htmlFor="birth_type">Birth Type:</label>
          <select id="birth_type" name="birth_type"></select>

          <label htmlFor="rear_type">Rear Type:</label>
          <select id="rear_type" name="rear_type"></select>

          <label htmlFor="minimum_birth_weight">Minimum Birth Weight:</label>
          <input type="number" id="minimum_birth_weight" name="minimum_birth_weight" min="0" step="0.1" />

          <label htmlFor="maximum_birth_weight">Maximum Birth Weight:</label>
          <input type="number" id="maximum_birth_weight" name="maximum_birth_weight" min="0" step="0.1" />

          <label htmlFor="birth_weight_id_unitsid">Birth Weight Units:</label>
          <select id="birth_weight_id_unitsid" name="birth_weight_id_unitsid"></select>

          <label htmlFor="weight_id_unitsid">Weight Units:</label>
          <select id="weight_id_unitsid" name="weight_id_unitsid"></select>

          <label htmlFor="sale_price_id_unitsid">Sale Price Units:</label>
          <select id="sale_price_id_unitsid" name="sale_price_id_unitsid"></select>

          <label htmlFor="id_deathreasonid">Death Reason:</label>
          <select id="id_deathreasonid" name="id_deathreasonid"></select>

          <label htmlFor="id_transferreasonid">Transfer Reason:</label>
          <select id="id_transferreasonid" name="id_transferreasonid"></select>


          {/* Miscellaneous Section */}
          <div className="section-break"></div>
          <h3>Miscellaneous</h3>
          <hr />

          <label htmlFor="evaluation_update_alert">Evaluation Update Alert:</label>
          <select id="evaluation_update_alert" name="evaluation_update_alert" />
        </form>
      </div>
    </div>
  );
};

export default CreateDefaults;
