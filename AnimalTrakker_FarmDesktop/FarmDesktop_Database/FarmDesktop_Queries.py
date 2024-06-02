# FOR FARM DESKTOP APP. PUT IT IN HERE FOR NOW. WILL BE IN ANOTHER FILE LATER
GET_ANIMAL_EVALUATION_HISTORY = """
	SELECT
		id_savedevaluationstableid,
  		evaluation_name
	FROM
		saved_evaluations_table
"""
# Geting the traits and their units based on each evaluation
GET_EVALUATION_TRAITS = """
	SELECT 
		trait_name01, trait_name02, trait_name03, trait_name04, trait_name05, 
		trait_name06, trait_name07, trait_name08, trait_name09, trait_name10, 
		trait_name11, trait_name12, trait_name13, trait_name14, trait_name15, 
		trait_name16, trait_name17, trait_name18, trait_name19, trait_name20,
		trait_units11, trait_units12, trait_units13, trait_units14, trait_units15
	FROM 
		saved_evaluations_table
	WHERE 
		evaluation_name = ?
"""

# Getting partucular trait based on id_evaluationtraitid
GET_EVALUATION_TRAIT = """
	SELECT 
		trait_name, 
		id_evaluationtraittypeid
	FROM 
		evaluation_trait_table
	WHERE 
		id_evaluationtraitid = ?;
	"""

# Getting list of units for a particular trait
GET_EVALUATION_UNITS = """
	SELECT 
		units_name
	FROM 
		units_table
	WHERE 
		id_unitstypeid = (
			SELECT id_unitstypeid
			FROM units_table
			WHERE id_unitsid = ?
		)
	ORDER BY 
		units_display_order;
"""

# Fetch all default settings names
GET_DEFAULT_SETTINGS_NAMES = """
    SELECT
    	default_settings_name 
     FROM 
     	animaltrakker_default_settings_table
"""

# Fetch all evaluations names
GET_EVALUATIONS_NAMES = """
	SELECT
		evaluation_name 
	 FROM 
	 	saved_evaluations_table
"""

# Fetch details for a specific default setting by name
GET_SETTING_DETAILS = """
    SELECT 
    	* 
    FROM 
    	animaltrakker_default_settings_table 
    WHERE 
    	default_settings_name = ?
"""

# Fetch details for a specific evaluation by name
GET_EVALUATION_DETAILS = """
    SELECT 
    	* 
    FROM 
    	saved_evaluations_table 
    WHERE 
    	evaluation_name = ?
"""

# Update details for a specific default setting
UPDATE_SETTING_DETAILS = """
    UPDATE 
    	animaltrakker_default_settings_table
	SET 
		default_settings_name = ?, owner_id_contactid = ?, owner_id_companyid = ?, owner_id_premiseid = ?, 
		breeder_id_contactid = ?, breeder_id_companyid = ?, breeder_id_premiseid = ?, vet_id_contactid = ?, 
		vet_id_premiseid = ?, lab_id_companyid = ?, lab_id_premiseid = ?, id_registry_id_companyid = ?, 
		registry_id_premiseid = ?, id_stateid = ?, id_countyid = ?, id_flockprefixid = ?, id_speciesid = ?, 
		id_breedid = ?, id_sexid = ?, id_idtypeid_primary = ?, id_idtypeid_secondary = ?, id_idtypeid_tertiary = ?, 
		id_eid_tag_male_color_female_color_same = ?, eid_tag_color_male = ?, eid_tag_color_female = ?, eid_tag_location = ?, 
		id_farm_tag_male_color_female_color_same = ?, farm_tag_based_on_eid_tag = ?, farm_tag_number_digits_from_eid = ?, 
		farm_tag_color_male = ?, farm_tag_color_female = ?, farm_tag_location = ?, id_fed_tag_male_color_female_color_same = ?, 
		fed_tag_color_male = ?, fed_tag_color_female = ?, fed_tag_location = ?, id_nues_tag_male_color_female_color_same = ?, 
		nues_tag_color_male = ?, nues_tag_color_female = ?, nues_tag_location = ?, id_trich_tag_male_color_female_color_same = ?, 
		trich_tag_color_male = ?, trich_tag_color_female = ?, trich_tag_location = ?, trich_tag_auto_increment = ?, 
		trich_tag_next_tag_number = ?, id_bangs_tag_male_color_female_color_same = ?, bangs_tag_color_male = ?, 
		bangs_tag_color_female = ?, bangs_tag_location = ?, id_sale_order_tag_male_color_female_color_same = ?, 
		sale_order_tag_color_male = ?, sale_order_tag_color_female = ?, sale_order_tag_location = ?, use_paint_marks = ?, 
		paint_mark_color = ?, paint_mark_location = ?, tattoo_color = ?, tattoo_location = ?, freeze_brand_location = ?, 
		id_idremovereasonid = ?, id_tissuesampletypeid = ?, id_tissuetestid = ?, id_tissuesamplecontainertypeid = ?, 
		birth_type = ?, rear_type = ?, minimum_birth_weight = ?, maximum_birth_weight = ?, birth_weight_id_unitsid = ?, 
		weight_id_unitsid = ?, sale_price_id_unitsid = ?, evaluation_update_alert = ?, death_reason_id_contactid = ?, 
		death_reason_id_companyid = ?, id_deathreasonid = ?, transfer_reason_id_contactid = ?, 
		transfer_reason_id_companyid = ?, id_transferreasonid = ?, user_system_serial_number = ?, created = ?, modified = ?
	WHERE id_animaltrakkerdefaultsettingsid = ?
"""

# Update details for a specific evaluation
UPDATE_EVALUATION_DETAILS = """
    UPDATE 
        saved_evaluations_table
    SET 
        evaluation_name = ?, 
        saved_evaluation_id_contactid = ?, 
        saved_evaluation_id_companyid = ?, 
        trait_name01 = ?, 
        trait_name02 = ?, 
        trait_name03 = ?, 
        trait_name04 = ?, 
        trait_name05 = ?, 
        trait_name06 = ?, 
        trait_name07 = ?, 
        trait_name08 = ?, 
        trait_name09 = ?, 
        trait_name10 = ?, 
        trait_name11 = ?, 
        trait_name12 = ?, 
        trait_name13 = ?, 
        trait_name14 = ?, 
        trait_name15 = ?, 
        trait_units11 = ?, 
        trait_units12 = ?, 
        trait_units13 = ?, 
        trait_units14 = ?, 
        trait_units15 = ?, 
        trait_name16 = ?, 
        trait_name17 = ?, 
        trait_name18 = ?, 
        trait_name19 = ?, 
        trait_name20 = ?, 
        created = ?, 
        modified = ?
    WHERE 
        id_savedevaluationstableid = ?
"""

# Create new entry in default settings table with new setting
CREATE_NEW_SETTING = """
    INSERT INTO 
    	animaltrakker_default_settings_table (
			default_settings_name, owner_id_contactid, owner_id_companyid, owner_id_premiseid,
			breeder_id_contactid, breeder_id_companyid, breeder_id_premiseid, vet_id_contactid,
			vet_id_premiseid, lab_id_companyid, lab_id_premiseid, id_registry_id_companyid,
			registry_id_premiseid, id_stateid, id_countyid, id_flockprefixid, id_speciesid,
			id_breedid, id_sexid, id_idtypeid_primary, id_idtypeid_secondary, id_idtypeid_tertiary,
			id_eid_tag_male_color_female_color_same, eid_tag_color_male, eid_tag_color_female, eid_tag_location,
			id_farm_tag_male_color_female_color_same, farm_tag_based_on_eid_tag, farm_tag_number_digits_from_eid,
			farm_tag_color_male, farm_tag_color_female, farm_tag_location, id_fed_tag_male_color_female_color_same,
			fed_tag_color_male, fed_tag_color_female, fed_tag_location, id_nues_tag_male_color_female_color_same,
			nues_tag_color_male, nues_tag_color_female, nues_tag_location, id_trich_tag_male_color_female_color_same,
			trich_tag_color_male, trich_tag_color_female, trich_tag_location, trich_tag_auto_increment,
			trich_tag_next_tag_number, id_bangs_tag_male_color_female_color_same, bangs_tag_color_male,
			bangs_tag_color_female, bangs_tag_location, id_sale_order_tag_male_color_female_color_same,
			sale_order_tag_color_male, sale_order_tag_color_female, sale_order_tag_location, use_paint_marks,
			paint_mark_color, paint_mark_location, tattoo_color, tattoo_location, freeze_brand_location,
			id_idremovereasonid, id_tissuesampletypeid, id_tissuetestid, id_tissuesamplecontainertypeid,
			birth_type, rear_type, minimum_birth_weight, maximum_birth_weight, birth_weight_id_unitsid,
			weight_id_unitsid, sale_price_id_unitsid, evaluation_update_alert, death_reason_id_contactid,
			death_reason_id_companyid, id_deathreasonid, transfer_reason_id_contactid,
			transfer_reason_id_companyid, id_transferreasonid, user_system_serial_number, created, modified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

# Create new entry in evaluation table with new evaluation
CREATE_NEW_EVALUATION = """
    INSERT INTO saved_evaluations_table (
        evaluation_name, 
        saved_evaluation_id_contactid, 
        saved_evaluation_id_companyid, 
        trait_name01, 
        trait_name02, 
        trait_name03, 
        trait_name04, 
        trait_name05, 
        trait_name06, 
        trait_name07, 
        trait_name08, 
        trait_name09, 
        trait_name10, 
        trait_name11, 
        trait_name12, 
        trait_name13, 
        trait_name14, 
        trait_name15, 
        trait_units11, 
        trait_units12, 
        trait_units13, 
        trait_units14, 
        trait_units15, 
        trait_name16, 
        trait_name17, 
        trait_name18, 
        trait_name19, 
        trait_name20, 
        created, 
        modified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

# Fetch species common names for dropdown
GET_SPECIES_NAMES = """
    SELECT 
		id_speciesid,
    	species_common_name 
    FROM 
    	species_table
"""

# Query to fetch breed names
GET_BREED_NAMES = """
    SELECT
		id_breedid,
    	breed_name 
    FROM 
    	breed_table
"""

# Query to fetch state names
GET_STATE_NAMES = """
    SELECT
		id_stateid,
    	state_name 
    FROM 
    	state_table
"""

# Query to fetch county names
GET_COUNTY_NAMES = """
    SELECT
		id_countyid,
    	county_name 
    FROM 
    	county_table
"""
# Query to fetch codon values
GET_CODONS_VALUE_IDS = """
	SELECT id_geneticcharacteristictableid, id_geneticcharacteristicvalueid
	FROM animal_genetic_characteristic_table
	WHERE id_animalid = ?
	AND id_geneticcharacteristictableid IN (2, 5, 7)
"""

# Query to fetch codon 136
GET_CODON_136 = """
	SELECT codon136_alleles
	FROM genetic_codon136_table
	WHERE id_geneticcodon136id = ?
"""

# Query to fetch codon 171
GET_CODON_171 = """
	SELECT codon171_alleles
	FROM genetic_codon171_table
	WHERE id_geneticcodon171id = ?
"""

# Query to fetch coat color
GET_COAT_COLOR = """
	SELECT coat_color
	FROM genetic_coat_color_table
	WHERE id_geneticcoatcolorid = ?
"""
# Get Owner info
GET_OWNER_INFO = """
	SELECT 
		to_id_contactid, 
		to_id_companyid, 
		transfer_date
	FROM 
		animal_ownership_history_table
	WHERE 
		id_animalid = ?  -- replace ? with the specific id_animalid
	ORDER BY 
		transfer_date DESC
	LIMIT 1;
"""

# Instead of performing logic in sqlite, moving it to python
GET_BREEDER_IDS = """
    SELECT 
        id_animalid,
        id_breeder_id_companyid,
        id_breeder_id_contactid
    FROM animal_registration_table
    WHERE id_animalid = ?;
"""

# Get Contact title + Full Name
GET_CONTACT_NAME = """
SELECT 
    COALESCE(contact_title_table.contact_title, '') || ' ' || contact_table.contact_first_name || ' ' || contact_table.contact_middle_name || ' ' || contact_table.contact_last_name AS full_name
FROM 
    contact_table
LEFT JOIN
    contact_title_table ON contact_table.id_contacttitleid = contact_title_table.id_contacttitleid
WHERE 
    contact_table.id_contactid = ?;
"""


# Get Company Name
GET_COMPANY_NAME = """
SELECT 
    company
FROM 
    company_table
WHERE 
    company_table.id_companyid = ?;
"""

# Get Animal Location history by animal id, logic of sorting is in fetch_animal_location function in FarmDesktop_Database_Utilities.py
GET_ANIMAL_LOCATION_HISTORY = """
	SELECT 
		*
	FROM 
		animal_location_history_table
	WHERE 
		id_animalid = ?
	ORDER 
		BY movement_date DESC;
"""

# Get full premise address fields by premise id, the concatenation logic is in fetch_premise_info function in FarmDesktop_Database_Utilities.py
GET_PREMISE_INFO_FIELDS = """
	SELECT 
		premise_address1, 
		premise_address2, 
		premise_city, 
		state_table.state_abbrev, 
		premise_postcode, 
		country_table.country_name,
		premise_table.premise_id_countryid
	FROM premise_table
	JOIN state_table ON premise_table.premise_id_stateid = state_table.id_stateid
	JOIN country_table ON premise_table.premise_id_countryid = country_table.id_countryid
	WHERE premise_table.id_premiseid = ?;
"""