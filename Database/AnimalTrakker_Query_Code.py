# 	AnimalTrakker System
import sqlite3
# Jose Salvatierra from Teclado puts the queries here as string variable. I'm testing it as an option.

# Query to get animal pedigree
"""
Retrieves detailed pedigree information for a specified animal by its ID.

This query gathers comprehensive data about an animal, including its unique ID, flock prefix, name, 
IDs of its sire (father) and dam (mother), birth date, sex ID, birth type, and its latest registration 
number. It achieves this by joining several tables: the animal table, animal flock prefix table, 
flock prefix table, birth type table, and a subquery on the animal registration table that fetches the 
most recent registration number for each animal.

Parameters:
- animal_id (int): The unique identifier of the animal for which pedigree information is being retrieved.

Returns:
A single record containing:
- Animal ID ('id_animalid')
- Flock Prefix ('flock_prefix')
- Animal Name ('animal_name')
- Sire ID ('sire_id')
- Dam ID ('dam_id')
- Birth Date ('birth_date')
- Sex ID ('id_sexid')
- Birth Type ('birth_type')
- Latest Registration Number ('registration_number')

The result provides essential pedigree details necessary for tracking and managing animal lineage and registration information.
"""
GET_ANIMAL_PEDIGREE = """
	SELECT 
		animal_table.id_animalid,
		flock_prefix_table.flock_prefix,
		animal_table.animal_name,
		animal_table.sire_id,
		animal_table.dam_id,
		animal_table.birth_date,
		animal_table.id_sexid,
		birth_type_table.birth_type,
		animal_registration_table_recent.registration_number
	FROM animal_table
	INNER JOIN animal_flock_prefix_table ON animal_table.id_animalid = animal_flock_prefix_table.id_animalid
	INNER JOIN flock_prefix_table ON animal_flock_prefix_table.id_flockprefixid = flock_prefix_table.id_flockprefixid
	INNER JOIN birth_type_table ON animal_table.id_birthtypeid = birth_type_table.id_birthtypeid
	LEFT JOIN (
		SELECT 
			id_animalid, 
			registration_number,
			MAX(registration_date) AS max_registration_date
		FROM animal_registration_table
		GROUP BY id_animalid
	) AS animal_registration_table_recent ON animal_table.id_animalid = animal_registration_table_recent.id_animalid
	WHERE animal_table.id_animalid = ?
"""

# List of animals without printed pedigree
"""
List of animals without printed pedigree.

This query selects information about animals for which a pedigree certificate has not yet been printed. 
It fetches the registry certificate print ID, animal ID, animal name, printed status (boolean, where 0 
indicates not printed), and the creation and last modification dates of the registry certificate print 
records. The query joins the 'registry_certificate_print_table' with the 'animal_table' based on the 
animal ID to gather detailed information about each animal.

Returns:
    A list of records, each containing:
    - Registry certificate print ID ('id_registrycertificateprintid')
    - Animal ID ('id_animalid')
    - Animal name ('animal_name')
    - Printed status ('printed')
    - Creation date ('created')
    - Last modification date ('modified')
Where:
    The 'printed' status is 0, indicating the pedigree certificate has not been printed yet.
"""
GET_LIST_OF_ANIMALS_WITHOUT_PRINTED_PEDIGREE = """
	SELECT 
		registry_certificate_print_table.id_registrycertificateprintid,
		animal_table.id_animalid,
		animal_table.animal_name,
		registry_certificate_print_table.printed,
		registry_certificate_print_table.created,
		registry_certificate_print_table.modified
	FROM registry_certificate_print_table
	INNER JOIN animal_table ON registry_certificate_print_table.id_animalid = animal_table.id_animalid
	WHERE registry_certificate_print_table.printed = 0
"""

# Update printed status after printing pedigree
"""
Update the printed status and modification time of a registry certificate print record.

This query sets the 'printed' status to 1 (indicating the pedigree certificate has been printed)
and updates the 'modified' timestamp to the current time for a specific animal identified by its 
'animalid'. This operation is intended to be performed once the printing of an animal's pedigree 
certificate is completed, to reflect the new status in the database.

Parameters:
    - animalid (int): The unique identifier of the animal for which the pedigree certificate's
                      printed status is being updated.

Returns:
    None. The query updates the records in-place.
"""
UPDATE_PRINTED_STATUS = """
	UPDATE registry_certificate_print_table
    SET printed = 1, modified = ?
    WHERE id_animalid = ?
"""

# Getting federal id with location and color of the tag: federal_id/location_abbrev/color_abbrev
"""
This SQL query constructs and retrieves the most recent official federal ID for a specified animal. The federal ID is a concatenation of the 
scrapie flock id, the animal's ID number, the tag location abbreviation where tag is located, and the color abbreviation related to the ID, separated by slashes.

Parameters:
- The query requires a placeholder (?) to be replaced with the specific animal ID for which the federal ID is being retrieved.

Criteria for inclusion:
- The animal's ID must match the provided animal ID.
- Only IDs of type 1 or 2 are considered.
- The ID must be marked as "official".
- The ID must be currently active, indicated by a NULL 'date_off' field or an empty string.

Joins:
- The `animal_id_info_table` is joined with `id_location_table` to access the tag location abbreviation and with `id_color_table` to get the tag color abbreviation, assuming the color ID pertains to a male (adjust as necessary for other genders).

Ordering and Limit:
- Results are ordered by the 'date_on' and 'time_on' fields in descending order to prioritize the most recent IDs.
- The query limits the result to the single most recent active and official ID.
"""
GET_FEDERAL_ID = """
	SELECT 
		CASE 
			WHEN animal_id_info_table.id_idtypeid = 1 THEN scrapie_flock_table.scrapie_flockid || '/' 
			ELSE '' 
		END || animal_id_info_table.id_number || '/' || id_location_table.id_location_abbrev || '/' || id_color_table.id_color_abbrev AS federal_id
	FROM 
		animal_id_info_table
	LEFT JOIN 
		scrapie_flock_table ON animal_id_info_table.id_idtypeid = 1 AND animal_id_info_table.id_scrapieflockid = scrapie_flock_table.id_scrapieflockid
	INNER JOIN 
		id_location_table ON animal_id_info_table.id_idlocationid = id_location_table.id_idlocationid
	INNER JOIN 
		id_color_table ON animal_id_info_table.id_male_id_idcolorid = id_color_table.id_idcolorid
	WHERE 
		animal_id_info_table.id_animalid = ? AND 
		(animal_id_info_table.id_idtypeid = 1 OR animal_id_info_table.id_idtypeid = 2) AND 
		animal_id_info_table.official_id = 1 AND 
		(animal_id_info_table.id_date_off IS NULL OR animal_id_info_table.id_date_off = '')
	ORDER BY 
		animal_id_info_table.id_date_on DESC, 
		animal_id_info_table.id_time_on DESC
	LIMIT 1;
"""
 
# Getting farm id with location and color of the tag: farm_id/location_abbrev/color_abbrev
"""This SQL query constructs and retrieves the most recent farm identifier (farm_id) for a specified animal. The farm_id is a concatenation of the animal's identification number, the tag location abbreviation where the tag is located, and the color abbreviation of the tag, separated by slashes.

Parameters:
- The query requires a placeholder (?) to be replaced with the specific animal ID for which the farm_id is being retrieved.

Criteria for inclusion:
- The animal's ID must match the provided animal ID.
- The ID must be of type 4, indicating a specific type of identification or registration.
- The ID must be currently active, indicated by a NULL 'id_date_off' field or an empty string.

Joins:
- The `animal_id_info_table` is joined with `id_location_table` to access the tag location abbreviation 
- Additionaly it is joinedand with `id_color_table` to get the tag color abbreviation, with the assumption that the color ID pertains to a male (this may be adjusted as necessary for other genders).

Ordering and Limit:
- Results are ordered by the 'id_date_on' and 'id_time_on' fields in descending order to ensure that the most recent ID is selected.
- The query limits the result to the single most recent record for the specified animal ID.

This query is instrumental in tracking the current registration or tag status of an animal within a farm management system, specifically focusing on the unique identifiers of location and color of the tag.
"""
GET_FARM_ID = """
	SELECT 
		animal_id_info_table.id_number || '/' || id_location_table.id_location_abbrev || '/' || id_color_table.id_color_abbrev AS farm_id
	FROM 
		animal_id_info_table
	INNER JOIN 
		id_location_table ON animal_id_info_table.id_idlocationid = id_location_table.id_idlocationid
	INNER JOIN 
		id_color_table ON animal_id_info_table.id_male_id_idcolorid = id_color_table.id_idcolorid -- Assuming male color ID for simplicity; adjust as needed
	WHERE 
		animal_id_info_table.id_animalid = ? AND 
		animal_id_info_table.id_idtypeid = 4 AND 
		(animal_id_info_table.id_date_off IS NULL OR animal_id_info_table.id_date_off = '')
	ORDER BY 
		animal_id_info_table.id_date_on DESC, 
		animal_id_info_table.id_time_on DESC
	LIMIT 1;
"""

# Getting inbreeding coefficient
GET_INBREEDING_COOFFICIENT = """
	SELECT 
		inbreeding 
	FROM 
		animal_inbreeding_table 
	WHERE 
		id_animalid = ? 
	ORDER BY 
		CASE id_inbreedingcalculationtypeid 
			WHEN 3 THEN 1 
			WHEN 2 THEN 2 
			WHEN 1 THEN 3 
		END, 
		inbreeding_date DESC 
	LIMIT 1;
"""
 
# Getting animal birth weight
GET_ANIMAL_BIRTH_WEIGHT = """
	SELECT birth_weight 
 	FROM animal_table 
  	WHERE id_animalid = ?;
"""

# Getting aniaml 50 dyas weight (multiple queries)
GET_ANIMAL_DETAILS = """
    SELECT 
        birth_weight, 
        dam_id, 
        id_birthtypeid, 
        rear_type,
        birth_date
    FROM 
        animal_table
    WHERE 
        id_animalid = ?;
"""

GET_EVALUATION_DETAILS = """
    SELECT 
        id_animalid,
        age_in_days,
        ABS(age_in_days - 50) AS age_difference,
        trait_name11, trait_score11,
        trait_name12, trait_score12,
        trait_name13, trait_score13,
        trait_name14, trait_score14,
        trait_name15, trait_score15
    FROM 
        animal_evaluation_table
    WHERE 
        id_animalid = ?
        AND trait_name16 IS NOT NULL
        AND age_in_days BETWEEN 40 AND 120
    ORDER BY 
        age_difference,
        age_in_days
    LIMIT 1;
"""

GET_DAM_BIRTH_DATE = """
    SELECT birth_date
    FROM animal_table
    WHERE id_animalid = ?;
"""

# Getting Breeder info
GET_BREEDER_INFO = """
	SELECT 
	id_animalid,
	CASE
		WHEN id_breeder_id_contactid != 0 THEN 'contactid'
		WHEN id_breeder_id_companyid != 0 THEN 'companyid'
		ELSE 'none'
	END AS id_type,
	CASE
		WHEN id_breeder_id_contactid != 0 THEN id_breeder_id_contactid
		ELSE id_breeder_id_companyid
	END AS id_value
	FROM animal_registration_table
	WHERE id_animalid = ?;
	"""

# Get Premise info
"""
This SQL query constructs and retrieves a single, detailed string representation for a contact's premise information. It concatenates the contact's full name, their associated company name (if any), and the full address of the premise they are associated with, including the city, state abbreviation, and postcode. This representation is intended for display purposes.

Parameters:
- The query expects a single placeholder (?) value to be replaced with a specific contact ID for whom the information is being retrieved.

Joins:
- The `contact_premise_table` is joined with `premise_table` to link contacts with their premises.
- The `premise_table` is optionally joined with `state_table` to include the state's abbreviation in the premise's address.
- The `premise_table` is also optionally joined with `company_premise_table` and then `company_table` to include any associated company's name.
- Finally, `contact_table` is joined to get the contact's full name.

Ordering and Limit:
- The results are prioritized by a condition where a premise ID matching the contact ID is considered more relevant (though this condition might be based on a placeholder scenario for demonstration and might need adjustment based on actual use-case requirements).
- The query is limited to the first result based on the ordering criterion, ensuring that only the most relevant or prioritized premise information for the contact is retrieved.
"""
GET_CONTACT_PREMISE_INFO = """
	SELECT 
		CASE 
			WHEN TRIM(COALESCE(company_premise_table.end_premise_use, '')) IN ('', 'none') THEN 'active'
			ELSE TRIM(company_premise_table.end_premise_use)
		END AS end_use,
		premise_table.id_premisejurisdictionid AS jurisdiction,
		CASE 
			WHEN premise_table.id_premisetypeid = 1 THEN 'Physical'
			WHEN premise_table.id_premisetypeid = 2 THEN 'Mail'
			WHEN premise_table.id_premisetypeid = 3 THEN 'Both'
			ELSE 'Unknown'
		END AS address_type,
		contact_table.contact_first_name || ' ' || contact_table.contact_last_name || ', ' || 
		COALESCE(company_table.company || ', ', '') || 
		premise_table.premise_address1 || ', ' || COALESCE(premise_table.premise_address2, '') || 
		', ' || premise_table.premise_city || ', ' || state_table.state_abbrev || ', ' || premise_table.premise_postcode ||
		CASE 
			WHEN premise_table.premise_id_countryid > 1 THEN ', ' || country_table.country_name
			ELSE ''
		END AS full_address
	FROM contact_premise_table
	JOIN premise_table ON contact_premise_table.id_premiseid = premise_table.id_premiseid
	LEFT JOIN state_table ON premise_table.premise_id_stateid = state_table.id_stateid
	LEFT JOIN country_table ON premise_table.premise_id_countryid = country_table.id_countryid
	LEFT JOIN company_premise_table ON premise_table.id_premiseid = company_premise_table.id_premiseid
	LEFT JOIN company_table ON company_premise_table.id_companyid = company_table.id_companyid
	JOIN contact_table ON contact_premise_table.id_contactid = contact_table.id_contactid
	WHERE contact_premise_table.id_contactid = ?;
"""
GET_CONTACT_PHONE ="""
	WITH RankedPhones AS (
	SELECT
		id_contactid,
		contact_phone,
		id_phonetypeid,
		ROW_NUMBER() OVER (PARTITION BY id_contactid ORDER BY id_phonetypeid ASC) AS rn
	FROM
		contact_phone_table
	)
	SELECT
	id_contactid,
	contact_phone
	FROM
	RankedPhones
	WHERE
	rn = 1
	AND id_contactid = :in_contactid;
"""

GET_CONTACT_FLOCK_ID ='''
	SELECT membership_number
	FROM owner_registration_table
	WHERE id_contactid = ?
'''

GET_CONTACT_SCRAPIE_ID = '''
	SELECT scrapie_flockid
	FROM scrapie_flock_table
	WHERE owner_id_contactid = ?
	ORDER BY 
		start_scrapie_flock_use DESC, 
		scrapie_flock_display_order
	LIMIT 1
'''

GET_COMPANY_PHONE ="""
	WITH RankedPhones AS (
	SELECT
		id_companyid,
		company_phone,
		id_phonetypeid,
		ROW_NUMBER() OVER (PARTITION BY id_companyid ORDER BY id_phonetypeid ASC) AS rn
	FROM
		company_phone_table
	)
	SELECT
	id_companyid,
	company_phone
	FROM
	RankedPhones
	WHERE
	rn = 1
	AND id_companyid = :in_companyid;
"""

# Get Company Premise Info
"""
This SQL query constructs and retrieves a single, detailed string representation for a company's associated premise. It concatenates the company name with the premise's address, which includes the primary address line, optionally the secondary address line if it exists and is meaningful, the city, the state abbreviation, and the postcode. This string is intended for display purposes, providing a complete and readable address format.

Parameters:
- The query requires a placeholder (?) value to be replaced with a specific company ID for which the premise information is being retrieved.

Joins:
- The `company_premise_table` is joined with `premise_table` to link companies with their associated premises.
- The `premise_table` is optionally joined with `state_table` to include the state abbreviation in the premise's address.
- The `company_table` is joined to include the company name in the address concatenation.

Purpose:
- The aim of this query is to provide a comprehensive address string for a company's premise, including all pertinent details. The inclusion of a secondary address line when available ensures the address is as complete and useful as possible.

Usage Scenario:
- This query is particularly useful in systems where displaying a full, accurate address to the user is necessary, such as in administrative dashboards, company directories, or location management systems.
"""
GET_COMPANY_PREMISE_INFO = """
SELECT 
    COALESCE(company_premise_table.end_premise_use, 'active') AS end_use,
    premise_table.id_premisejurisdictionid AS jurisdiction,
    CASE 
        WHEN premise_table.id_premisetypeid = 1 THEN 'Physical'
        WHEN premise_table.id_premisetypeid = 2 THEN 'Mail'
        WHEN premise_table.id_premisetypeid = 3 THEN 'Both'
        ELSE 'Unknown'
    END AS address_type,
    company_table.company || ', ' || 
    (premise_table.premise_address1 || ', ' || COALESCE(premise_table.premise_address2, '') || 
    ', ' || premise_table.premise_city || ', ' || state_table.state_abbrev || ', ' || premise_table.premise_postcode ||
    CASE 
        WHEN premise_table.premise_id_countryid > 1 THEN ', ' || country_table.country_name
        ELSE ''
    END) AS full_address
FROM company_premise_table
JOIN premise_table ON company_premise_table.id_premiseid = premise_table.id_premiseid
LEFT JOIN state_table ON premise_table.premise_id_stateid = state_table.id_stateid
LEFT JOIN country_table ON premise_table.premise_id_countryid = country_table.id_countryid
JOIN company_table ON company_premise_table.id_companyid = company_table.id_companyid
WHERE company_premise_table.id_companyid = ?;
"""

GET_COMPANY_FLOCK_ID = '''
	SELECT membership_number
	FROM owner_registration_table
	WHERE id_companyid = ?
'''

GET_COMPANY_SCRAPIE_ID = '''
	SELECT scrapie_flockid
	FROM scrapie_flock_table
	WHERE owner_id_contactid = ?
	ORDER BY 
		start_scrapie_flock_use DESC, 
		scrapie_flock_display_order
	LIMIT 1
'''

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

# Get Codons (multiple queries)
GET_CODONS_VALUE_IDS = """
	SELECT id_geneticcharacteristictableid, id_geneticcharacteristicvalueid
	FROM animal_genetic_characteristic_table
	WHERE id_animalid = ?
	AND id_geneticcharacteristictableid IN (2, 5)
"""

GET_CODON_136 = """
	SELECT codon136_alleles
	FROM genetic_codon136_table
	WHERE id_geneticcodon136id = ?
"""

GET_CODON_171 = """
	SELECT codon171_alleles
	FROM genetic_codon171_table
	WHERE id_geneticcodon171id = ?
"""



GET_ALL_REGISTRIES = """
	SELECT 
		contacts_table.id_contactsid
		, contact_company 
	FROM contacts_table 
	INNER JOIN registry_info_table ON contacts_table.id_contactsid = registry_info_table.id_contactsid
	ORDER by contact_company
	;
	"""

GET_REGISTRY_ID_BY_NAME = """
	SELECT
		contacts_table.id_contactsid
	FROM contacts_table 
	WHERE contact_company = ?
	;
	"""

GET_ALL_MEMBER_STATUS_OPTIONS = """
	SELECT id_registrymembershipstatusid
		, membership_status
	FROM registry_membership_status_table 
	INNER JOIN registry_info_table on 
		registry_membership_status_table.id_contactsid = registry_info_table.id_contactsid
	WHERE registry_membership_status_table.id_contactsid = {}
	ORDER by membership_status_display_order
	;
	"""

GET_ALL_MEMBER_TYPE_OPTIONS = """
	SELECT id_registrymembershiptypeid
		, membership_type
	FROM registry_membership_type_table
	INNER JOIN registry_info_table on 
		registry_membership_type_table.id_contactsid = registry_info_table.id_contactsid
	WHERE registry_membership_type_table.id_contactsid = {}
	ORDER by membership_type_display_order
	;
	"""

GET_ALL_REGISTRY_REGIONS = """
	-- Gets all regions for a specific registry
	-- Requires the registry id number as a parameter
	SELECT id_membershipregionid
		, membership_region
		, membership_region_number
	FROM membership_region_table
	INNER JOIN registry_info_table on
		membership_region_table.registry_id_contactsid = registry_info_table.id_contactsid
	WHERE membership_region_table.registry_id_contactsid = ?
	ORDER by membership_region_display_order
	;   		
	"""

GET_ALL_MEMBERS = """
	-- Gets all members with all data except member notes using the proper JOIN clauses
	-- Requires the registry id number as a parameter
	SELECT
		contacts_table.id_contactsid
		, contacts_table.contact_first_name
		, contacts_table.contact_middle_name
		, contacts_table.contact_last_name
		, contacts_table.contact_company
		, owner_registration_table.membership_number
		, registry_membership_type_table.membership_type
		, registry_membership_status_table.membership_status
		, flock_prefix_table.flock_name
		, owner_registration_table.date_joined
		, owner_registration_table.dues_paid_until
		, owner_registration_table.date_resigned
		, owner_registration_table.last_census
		, owner_registration_table.board_member
		, owner_registration_table.online_password
		, contacts_table.contact_email
		, contacts_table.contact_main_phone
		, contacts_table.contact_cell_phone
		, contacts_table.contact_fax
		, contacts_table.contact_website
		, membership_region_table.membership_region
		, scrapie_flock_table.scrapie_flockid
		, contacts_premise_table.premise_number
		, contacts_premise_table.premise_latitude
		, contacts_premise_table.premise_longitude
		, contacts_premise_table.premise_altitude
		, units_table.units_name
		, contacts_table.contact_physical_address1
		, contacts_table.contact_physical_address2
		, contacts_table.contact_physical_city
		, contacts_state_table.state_abbrev
		, contacts_table.contact_physical_postcode
		, contacts_country_table.country_name
		, contacts_table.contact_mailing_address1
		, contacts_table.contact_mailing_address2
		, contacts_table.contact_mailing_city
		, mailing_state_table.state_abbrev as mailing_state
		, contacts_table.contact_mailing_postcode
		, mailing_country_table.country_name
	FROM contacts_table
		INNER JOIN owner_registration_table
			ON contacts_table.id_contactsid = owner_registration_table.owner_contactid
		LEFT JOIN registry_membership_status_table
			ON registry_membership_status_table.id_membershipstatusid = owner_registration_table.membership_status
		LEFT JOIN registry_membership_type_table
			ON registry_membership_type_table.id_registrymembershiptypeid = owner_registration_table.membership_type
		LEFT JOIN flock_prefix_table 
			ON flock_prefix_table.flock_prefixid = owner_registration_table.flock_prefixid
		LEFT JOIN membership_region_table
			ON membership_region_table.id_membershipregionid = owner_registration_table.region
		LEFT JOIN scrapie_flock_table
			ON scrapie_flock_table.id_contactsid = contacts_table.id_contactsid	
		LEFT JOIN contacts_premise_table 
			ON contacts_premise_table.id_premiseid  = contacts_table.id_premiseid
		LEFT JOIN units_table
			ON units_table.id_unitsid = contacts_premise_table.altitude_units
		LEFT JOIN contacts_state_table
			ON contacts_state_table.id_contacts_stateid = contacts_table.contact_physical_state
		LEFT JOIN contacts_country_table 
			ON contacts_country_table.id_contacts_countryid = contacts_table.id_contacts_physical_countryid
		LEFT JOIN contacts_state_table 
			AS mailing_state_table 
			ON contacts_table.contact_mailing_state = mailing_state_table.id_contacts_stateid
		LEFT JOIN contacts_country_table 
			AS mailing_country_table
			ON contacts_table.id_contacts_mailing_countryid = mailing_country_table.id_contacts_countryid
	WHERE 
		owner_registration_table.registry_contactid = ?
	ORDER BY
		contacts_table.contact_last_name
		, contacts_table.contact_first_name
	; 
	"""

GET_SINGLE_MEMBER_NOTES = """
	-- Gets whole list of notes for a specific member related to a specific registry
	SELECT
		owner_note_table.owner_note_date
		, owner_note_table.owner_note_text
	FROM owner_note_table
	WHERE
		owner_note_table.id_contactsid = ?
		AND owner_note_table.id_registry_id_contactsid = ?
	ORDER BY
		owner_note_table.owner_note_date ASC
	;
	"""

GET_ALL_REGISTRATION_TYPE_OPTIONS = """
	SELECT
		id_registrationtypeid
		, registration_type
		, registration_type_abbrev
	FROM registration_type_table
	WHERE
		id_contactsid = ?
	ORDER BY
		registration_type_display_order
	;
	"""
GET_ALL_GENERAL_DEFAULTS = """
	SELECT * FROM animaltrakker_default_settings_table
"""

GET_ALL_GENERAL_DEFAULTS_old = """
	SELECT
		"id_animaltrakkerdefaultsettingsid"
		, "owner_id_contactsid"
		, "vet_id_contactsid"
		, "lab_id_contactsid"
		, "id_registry_id_contactsid"
		, "id_contactsstateid"
		, "id_flockprefixid"
		, "id_speciesid"
		, "id_breedid"
		, "id_sexid"
		, "early_gestation_length"
		, "late_gestation_length"
		, "id_idtypeid"
		, "id_eid_tag_male_color_female_color_same"
		, "eid_tag_color_male"
		, "eid_tag_color_female"
		, "eid_tag_location"
		, "id_farm_tag_male_color_female_color_same"
		, "farm_tag_based_on_eid_tag"
		, "farm_tag_number_digits_from_eid"
		, "farm_tag_color_male"
		, "farm_tag_color_female"
		, "farm_tag_location"
		, "id_fed_tag_male_color_female_color_same"
		, "fed_tag_color_male"
		, "fed_tag_color_female"
		, "fed_tag_location"
		, "id_nues_tag_male_color_female_color_same"
		, "nues_tag_color_male"
		, "nues_tag_color_female"
		, "nues_tag_location"
		, "id_trich_tag_male_color_female_color_same"
		, "trich_tag_color_male"
		, "trich_tag_color_female"
		, "trich_tag_location"
		, "trich_tag_auto_increment"
		, "trich_tag_next_tag_number"
		, "use_paint_marks"
		, "paint_tag_color"
		, "paint_tag_location"
		, "id_idremovereasonid"
		, "tattoo_color"
		, "tattoo_location"
		, "freeze_brand_location"
		, "id_tissuesampletypeid"
		, "id_tissuetestid"
		, "id_tissuesamplecontainertypeid"
		, "evaluation_update_alert"
		, "weight_id_unitsid"
		, "birth_type"
		, "birth_weight_id_unitsid"
		, "rear_type"
		, "sale_price_id_unitsid"
	FROM animaltrakker_default_settings_table
	;
"""
GET_ALL_CONTACT_NAMES ="""
	SELECT 
		id_contactsid
		, contact_first_name
	--	, contact_middle_name commented out to try to fix null issue in code
		, contact_last_name
		, contact_company
	FROM contacts_table
	ORDER BY contact_last_name
	;
	"""
GET_ALL_OWNERS = """
	SELECT
		id_contactsid
		, contact_first_name
	--	, contact_middle_name commented out to try to fix null issue in code
		, contact_last_name
		, contact_company
	FROM contacts_table
	ORDER BY contact_last_name
	
	"""
GET_ALL_LABORATORIES ="""
	SELECT 
		contacts_table.id_contactsid
		, contact_first_name
		, contact_last_name
		, contact_company 
		FROM contacts_table 
		INNER JOIN contacts_laboratory_table ON contacts_table.id_contactsid = contacts_laboratory_table.id_contactsid
		ORDER by laboratory_display_order
	"""
GET_ALL_STATES_FOR_A_SPECIFIC_COUNTRY = """
	SELECT * FROM contacts_state_table WHERE id_contactscountryid = ? ORDER BY contacts_state_display_order
	"""
GET_ALL_COUNTIES_FOR_A_SPECIFIC_STATE = """
	SELECT * FROM contacts_county_table WHERE id_contactsstateid = ? ORDER BY contacts_county_display_order
	"""
GET_ALL_STATES = """
	SELECT * FROM contacts_state_table
	"""

GET_ALL_TISSUE_SAMPLE_TYPES = """
	SELECT * FROM tissue_sample_type_table ORDER BY tissue_sample_type_display_order
	"""

GET_ALL_TISSUE_TEST_TYPES = """
	SELECT * FROM tissue_test_table ORDER BY tissue_test_display_order
	"""

GET_ALL_TISSUE_SAMPLE_CONTAINER_TYPES = """
	SELECT * FROM tissue_sample_container_type_table ORDER BY tissue_sample_container_display_order
	"""

GET_ALL_TAG_COLORS = """
	SELECT * FROM tag_color_table ORDER BY tag_color_display_order
	"""

GET_ALL_TAG_TYPES = """
	SELECT * FROM id_type_table ORDER BY id_type_display_order
	"""

GET_ALL_ID_LOCATIONS = """
	SELECT * FROM id_location_table ORDER BY id_location_display_order
	"""
GET_ALL_BREEDS_FOR_A_SPECIFIC_SPECIES = """
	-- This needs a species identifier. It is a foreign key into the species table
	SELECT * FROM breed_table WHERE id_speciesid = ? ORDER BY breed_display_order
	"""
GET_ALL_SPECIES = """
	SELECT * FROM species_table
	"""
GET_ALL_BULL_TEST_STATUS_OPTIONS = """
	--	Set up for the custom Bull Test program where the Bull Breeding Soundness is a custom
	--	evaluation type and happens to be id_evaluationtraitid of 4 in the default base database
	SELECT custom_evaluation_item 
	FROM custom_evaluation_traits_table 
	WHERE id_traitid = 4 
	ORDER BY custom_evaluation_order
	"""

GET_ALL_TRANSFER_REASONS = """
	SELECT * FROM transfer_reason_table ORDER BY transfer_reason_display_order
	"""

GET_ALL_DEATH_REASONS = """
	SELECT * FROM death_reason_table ORDER BY death_reason_display_order
	"""

GET_ALL_SEXES_BY_SPECIES = """
	SELECT 
		sex_table.id_sexid
		, species_table.species_common_name
		, sex_table.sex_name
	FROM species_table
	INNER JOIN sex_table on sex_table.id_speciesid = species_table.id_speciesid
	ORDER BY 
		sex_table.id_speciesid
		, sex_table.sex_display_order
	"""

GET_ALL_SEXES_FOR_A_SPECIFIC_SPECIES = """
	SELECT 
		sex_table.id_sexid
		, sex_table.sex_name
	FROM sex_table
	WHERE id_speciesid = ?
	ORDER BY 
		sex_table.sex_display_order
	"""

GET_ALL_BREEDING_SOUNDNESS_TRAITS = """
	SELECT
		custom_evaluation_traits_table.custom_evaluation_item
	FROM custom_evaluation_traits_table
	INNER JOIN evaluation_trait_table ON 
		custom_evaluation_traits_table. id_traitid = evaluation_trait_table.id_evaluationtraitid
	WHERE 
 		-- id_traitid = 4
 		evaluation_trait_table.trait_name = 'Breeding Soundness Exam'
	ORDER BY custom_evaluation_traits_table.custom_evaluation_order
	"""

# todo fix this to handle the new fields we want
GET_BULL_TEST_RESULTS_FOR_CSV = """
	SELECT 
		(SELECT
			contacts_table.contact_first_name 
			FROM  contacts_table
			WHERE 
				animal_ownership_history_table.to_id_contactsid = contacts_table.id_contactsid) AS owner_first_name
		, (SELECT
			contacts_table.contact_last_name 
			FROM  contacts_table
			WHERE 
				animal_ownership_history_table.to_id_contactsid = contacts_table.id_contactsid) AS owner_last_name
		, (SELECT
			contacts_table.contact_company
			FROM  contacts_table
			WHERE 
				animal_ownership_history_table.to_id_contactsid = contacts_table.id_contactsid) AS Company
		,(SELECT 
			tag_number 
			FROM animal_id_info_table 
			WHERE 
				id_tagtypeid = '2'
				AND animal_id_info_table.id_animalid = animal_table.id_animalid 
				AND (tag_date_off IS NULL OR tag_date_off = '') 
			) AS RFID
		,(SELECT 
				tag_number 
				FROM animal_id_info_table 
				WHERE 
					id_tagtypeid = '4' 
					AND animal_id_info_table.id_animalid = animal_table.id_animalid 
					AND (tag_date_off IS NULL OR tag_date_off = '') 
				) AS Ranch_Tag
		,(SELECT 
				tag_number 
				FROM animal_id_info_table 
				WHERE 
					id_tagtypeid = '10' 
					AND animal_id_info_table.id_animalid = animal_table.id_animalid 
					AND (tag_date_off IS NULL OR tag_date_off = '') 
				) AS Trich_Tag		
		, animal_evaluation_table.trait_score11 as Scrotal_Circ_cm
		, animal_evaluation_table.trait_score12  as Motility_percent
		, animal_evaluation_table.trait_score13  as Morphology_percent
		, (SELECT 
				note_text
				FROM animal_note_table 
				WHERE 
					animal_note_table.id_animalid = animal_table.id_animalid 
					AND note_date >= {}
					AND note_date <= {}
				) 
				AS Comments
		, custom_evaluation_traits_table.custom_evaluation_item as Classification
		, animal_table.birth_date as Birth_Date
		--	figure age here
		 , breed_table.breed_name as Breed
	FROM animal_table
	INNER JOIN animal_breed_table on animal_table.id_animalid = animal_breed_table.id_animalid
	INNER JOIN breed_table on animal_breed_table.id_breedid = breed_table.id_breedid
	INNER JOIN animal_evaluation_table ON animal_evaluation_table.id_animalid = animal_table.id_animalid
	INNER JOIN custom_evaluation_traits_table ON custom_evaluation_traits_table.id_custom_evaluationtraitsid = animal_evaluation_table.trait_score16
	LEFT JOIN animal_ownership_history_table on animal_ownership_history_table.id_animalid = animal_table.id_animalid
	WHERE 
		animal_evaluation_table.eval_date >= {}
		AND animal_evaluation_table.eval_date <= {}
	ORDER BY
		owner_last_name
		, Trich_Tag
	"""
# todo fix this to be the actual query. This is a stub

# todo concerned this is not a safe query see Bobby Tables
UPDATE_GENERAL_DEFAULTS = """
	UPDATE animaltrakker_default_settings_table SET {} = {} WHERE id_animaltrakkerdefaultsettingsid = {}
	"""

# This section is going to be query code segments that will get added to create some of the more complex queries
# SELECT Query segments and JOIN Query segments
# Animal screens will have a different set

# People and Member screens section

display_start_select ="""
	SELECT
	"""
from_contacts_clause ="""
	FROM contacts_table
	"""
from_contacts_movement_clause = """
	FROM 
		(SELECT
 			id_animalid
					   , MAX(movement_date)
			, to_id_contactsid
			, id_animallocationhistoryid
		FROM animal_location_history_table
		GROUP BY
 			id_animalid) 
		AS last_movement_date
"""
display_member_first_name_true_select ="""
	, contacts_table.contact_first_name
"""
display_member_last_name_true_select ="""
	, contacts_table.contact_last_name
"""
display_farm_name_true_select = """
	, contacts_table.contact_company
"""
display_member_number_true_select = """
	, owner_registration_table.membership_number
"""
display_member_type_true_select = """
	, registry_membership_type_table.membership_type
"""
display_member_status_true_select = """
	, registry_membership_status_table.membership_status
"""
display_flock_prefix_true_select = """
	, flock_prefix_table.flock_prefix
	"""
join_flock_prefix_table = """
	LEFT JOIN flock_prefix_table 
		ON flock_prefix_table.id_contactsid = contacts_table.id_contactsid
	"""
display_date_joined_true_select ="""
	, owner_registration_table.date_joined
	"""
display_renewal_date_true_select = """
	, owner_registration_table.dues_paid_until
	"""
display_resigned_date_true_select = """	
	, owner_registration_table.date_resigned
	"""
display_census_date_true_select = """
	, owner_registration_table.last_census
	"""
# This is either a 1 for true member is a member of the Board of Directors for the registry
# and a 0 for false, member is not a member of the Board of Directors for the registry.
# I'm just getting the data, actual display will have to convert to the proper text of either TRUE or FALSE or YES or NO
display_bod_true_select = """
	, owner_registration_table.board_member
	"""
display_password_true_select = """
	, owner_registration_table.online_password
	"""
display_email_true_select = """
	, contacts_table.contact_email1
	, contacts_table.contact_email2
	"""
display_phone_true_select = """
	, contacts_table.contact_main_phone
	"""
display_cell_true_select = """
	, contacts_table.contact_cell_phone
	"""
display_fax_true_select = """
	, contacts_table.contact_fax
	"""
display_website_true_select = """
	, contacts_table.contact_website
	"""
display_region_true_select = """
	, membership_region_table.membership_region
	"""
display_federal_flock_id_true_select = """
	, scrapie_flock_table.scrapie_flockid
	"""
display_state_premise_true_select = """
	, contacts_premise_table.state_premise_id
	"""
display_premise_true_select = """
	, contacts_premise_table.premise_number
	, contacts_premise_table.premise_latitude
	, contacts_premise_table.premise_longitude
	, contacts_premise_table.premise_altitude
	"""
join_premise_table = """
	LEFT JOIN contacts_premise_table 
		ON contacts_premise_table.id_contactsid  = contacts_table.id_contactsid
	"""
display_farm_name_in_animal_true_select = """
,   (SELECT
		contacts_table.contact_company
	FROM  contacts_table
	WHERE 
		animal_ownership_history_table.to_id_contactsid = contacts_table.id_contactsid) AS farm_name
"""
display_physical1_true_select = """
	, contacts_table.contact_physical_address1
"""
display_physical2_true_select = """
	, contacts_table.contact_physical_address2
"""
display_physical_city_true_select = """
	, contacts_table.contact_physical_city
"""
display_physical_state_true_select = """
	, contacts_state_table.state_abbrev
"""
display_physical_zip_true_select = """
	, contacts_table.contact_physical_postcode
"""
join_state_country_physical_table = """
	LEFT JOIN contacts_state_table
		ON contacts_state_table.id_contactsstateid = contacts_table.contact_physical_state
	LEFT JOIN contacts_country_table 
		ON contacts_country_table.id_contactscountryid = contacts_table.id_contacts_physical_id_countryid
	"""
display_mailing1_true_select = """
	, contacts_table.contact_mailing_address1
"""
display_mailing2_true_select = """
	, contacts_table.contact_mailing_address2
"""
display_mailing_city_true_select = """
	, contacts_table.contact_mailing_city
"""
display_mailing_state_true_select = """
	, mailing_state_table.state_abbrev as mailing_state
"""
display_mailing_zip_true_select = """
	, contacts_table.contact_mailing_postcode
"""
join_state_country_mailing_table = """
	LEFT JOIN contacts_state_table 
		AS mailing_state_table 
		ON contacts_table.contact_mailing_state = mailing_state_table.id_contactsstateid
	LEFT JOIN contacts_country_table 
		AS mailing_country_table
		ON contacts_table.id_contacts_mailing_id_countryid = mailing_country_table.id_contactscountryid
	"""
display_member_notes_true_select = """
	, 
	"""
display_member_last_name_in_animals_bull_test = """
	, (SELECT
		contacts_table.contact_last_name 
		FROM  contacts_table
		WHERE 
			animal_ownership_history_table.to_id_contactsid = contacts_table.id_contactsid) AS owner_last_name
"""
join_ownership_in_animals_bull_test = """
	INNER JOIN animal_ownership_history_table ON animal_table.id_animalid = animal_ownership_history_table.id_animalid
	INNER JOIN animal_table ON animal_table.id_animalid = last_movement_date.id_animalid
"""
display_animal_name_in_animals_bull_test = """
	, animal_table.animal_name
"""
display_eid_tag_true_select = """
	, (SELECT 
		tag_number 
		FROM animal_id_info_table 
		WHERE 
			id_tagtypeid = "2" 
			AND animal_id_info_table.id_animalid = animal_table.id_animalid
			AND (tag_date_off IS NULL OR tag_date_off = '') 
	  ) 
			AS eidtag
"""
display_farm_tag_true_select = """
	, (SELECT 
		tag_number 
		FROM animal_id_info_table 
		WHERE 
			id_tagtypeid = "4" 
			AND animal_id_info_table.id_animalid = animal_table.id_animalid
			AND (tag_date_off IS NULL OR tag_date_off = '') 
	  ) 
			AS farmtag
"""
display_trich_tag_true_select = """
	, (SELECT 
		tag_number 
		FROM animal_id_info_table 
		WHERE 
			id_tagtypeid = "10" 
			AND animal_id_info_table.id_animalid = animal_table.id_animalid
			AND (tag_date_off IS NULL OR tag_date_off = '') 
	  ) 
			AS trichtag
"""
display_animal_birth_date_true_select = """
	, animal_table.birth_date
"""
display_last_test_date_true_select = """
	, animal_evaluation_table.eval_date
"""
display_bse_results_true_select = """
	, custom_evaluation_traits_table.custom_evaluation_item as bse_result
"""
display_scrotal_results_true_select = """
	, animal_evaluation_table.trait_score11 as scrotal_circ
"""
display_motility_true_select = """
	, animal_evaluation_table.trait_score12 as normal_motility
"""
display_morphology_true_select = """
	, animal_evaluation_table.trait_score13 as normal_morphology
"""
join_test_results_bull_test = """
	INNER JOIN custom_evaluation_traits_table 
		ON custom_evaluation_traits_table.id_custom_evaluationtraitsid= animal_evaluation_table.trait_score16
	INNER JOIN animal_evaluation_table 
		ON animal_evaluation_table.id_animalid = animal_table.id_animalid
"""
# Can't have duplicate JOIN clauses
# I tested having a single big JOIN clause with all of the possibilities and it works even if the SELECT leaves out some fields
display_member_join_clause_registry = """
	INNER JOIN owner_registration_table
		ON contacts_table.id_contactsid = owner_registration_table.id_contactsid
	LEFT JOIN registry_membership_status_table
		ON registry_membership_status_table.id_registrymembershipstatusid = owner_registration_table.id_registrymembershipstatusid
	LEFT JOIN registry_membership_type_table
		ON registry_membership_type_table.id_registrymembershiptypeid = owner_registration_table.d_registrymembershipstatusid
	LEFT JOIN registry_membership_region_table
		ON registry_membership_region_table.id_membershipregionid = owner_registration_table.id_membershipregionid
	LEFT JOIN scrapie_flock_table
		ON scrapie_flock_table.id_contactsid = contacts_table.id_contactsid	
	LEFT JOIN contacts_premise_table 
		ON contacts_premise_table.id_contactsid  = contacts_table.id_contactsid
	LEFT JOIN contacts_state_table
		ON contacts_state_table.id_contactsstateid = contacts_table.contact_physical_state
	LEFT JOIN contacts_country_table 
		ON contacts_country_table.id_contactscountryid = contacts_table.id_contacts_physical_id_countryid
	LEFT JOIN contacts_state_table 
		AS mailing_state_table 
		ON contacts_table.contact_mailing_state = mailing_state_table.id_contactsstateid
	LEFT JOIN contacts_country_table 
		AS mailing_country_table
		ON contacts_table.id_contacts_mailing_id_countryid = mailing_country_table.id_contactscountryid
	"""
display_owner_join_clause_bull_test = """
	LEFT JOIN flock_prefix_table 
		ON flock_prefix_table.id_flockprefixid = owner_registration_table.id_flockprefixid 
	LEFT JOIN contacts_premise_table 
		ON contacts_premise_table.id_contactsid  = contacts_table.id_contactsid
	LEFT JOIN contacts_state_table
		ON contacts_state_table.id_contactsstateid = contacts_table.contact_physical_state
	LEFT JOIN contacts_country_table 
		ON contacts_country_table.id_contactscountryid = contacts_table.id_contacts_physical_id_countryid
	LEFT JOIN contacts_state_table 
		AS mailing_state_table 
		ON contacts_table.contact_mailing_state = mailing_state_table.id_contactsstateid
	LEFT JOIN contacts_country_table 
		AS mailing_country_table
		ON contacts_table.id_contacts_mailing_id_countryid = mailing_country_table.id_contactscountryid
	"""
