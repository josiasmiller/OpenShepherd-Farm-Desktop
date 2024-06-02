from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import *
from AnimalTrakker_Shared.Shared_Logging import get_logger

from datetime import datetime

logger = get_logger(__name__)

def fetch_evaluation_history(db_connection):
    """
    Fetches evaluation history data from the database using a secure and efficient connection handling provided by a DatabaseConnection instance.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list of dict: List containing dictionaries of evaluation history, formatted for display. Each dictionary contains the text from the second column of the fetched rows.
    """
    try:
        # Execute the predefined query to fetch evaluation history.
        rows = db_connection.fetchall(GET_ANIMAL_EVALUATION_HISTORY)
        logger.info(f"Evaluation history on database open fetched successfully, retrieved {len(rows)} records.")
        
        # Process the fetched rows into a list of dictionaries for display.
        return [{'text': str(row[1])} for row in rows]
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch evaluation history: {e}")
        return []  # Return an empty list or raise an exception depending on your error handling strategy

def fetch_evaluation_data(db_connection, evaluation_id, evaluation_name):
    """Fetches evaluation data from the database for a given evaluation ID."""
    
    try:
        row = db_connection.fetchone(GET_EVALUATION_TRAITS, (evaluation_name,))
        logger.info(f"Evaluation data {row} for {evaluation_name} with id {evaluation_id} fetched successfully.")
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch evaluation data for {evaluation_name}: {e}")
    
    return row

def fetch_default_settings(db_connection):
    """
    Fetches default settings data from the database using a secure and efficient connection handling provided by a DatabaseConnection instance.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list: List containing names of default settings.
    """
    try:
        # Execute the predefined query to fetch default settings.
        rows = db_connection.fetchall(GET_DEFAULT_SETTINGS_NAMES)
        logger.info(f"Default settings fetched successfully, retrieved {len(rows)} records.")
        
        # Log the raw data fetched from the database
        logger.info(f"Fetched rows: {rows}")
        
        # Process the fetched rows into a list of setting names.
        settings = [str(row[0]) for row in rows]  # Ensure only the setting name is returned
        logger.info(f"Processed settings: {settings}")
        return settings
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch default settings: {e}")
        return []  # Return an empty list or raise an exception depending on your requirements.
    
def fetch_evaluations(db_connection):
    """
    Fetches default evaluations data from the database using a secure and efficient connection handling provided by a DatabaseConnection instance.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list: List containing names of evaluations.
    """
    try:
        # Execute the predefined query to fetch default settings.
        rows = db_connection.fetchall(GET_EVALUATIONS_NAMES)
        logger.info(f"Evaluations fetched successfully, retrieved {len(rows)} records.")
        
        # Log the raw data fetched from the database
        logger.info(f"Fetched rows: {rows}")
        
        # Process the fetched rows into a list of setting names.
        settings = [str(row[0]) for row in rows]  # Ensure only the setting name is returned
        logger.info(f"Processed settings: {settings}")
        return settings
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch Evaluations: {e}")
        return []  # Return an empty list or raise an exception depending on your requirements.
    
def fetch_setting_details(db_connection, setting_name):
    """
    Fetches details for a specific default setting from the database.

    Args:
        setting_name (str): The name of the default setting to fetch details for.

    Returns:
        dict: A dictionary containing the details of the default setting.
    """
    try:
        row = db_connection.fetchone(GET_SETTING_DETAILS, (setting_name,))
        if row:
            columns = [
                "id_animaltrakkerdefaultsettingsid", "default_settings_name", "owner_id_contactid", "owner_id_companyid", 
                "owner_id_premiseid", "breeder_id_contactid", "breeder_id_companyid", "breeder_id_premiseid", 
                "vet_id_contactid", "vet_id_premiseid", "lab_id_companyid", "lab_id_premiseid", 
                "id_registry_id_companyid", "registry_id_premiseid", "id_stateid", "id_countyid", 
                "id_flockprefixid", "id_speciesid", "id_breedid", "id_sexid", "id_idtypeid_primary", 
                "id_idtypeid_secondary", "id_idtypeid_tertiary", "id_eid_tag_male_color_female_color_same", 
                "eid_tag_color_male", "eid_tag_color_female", "eid_tag_location", "id_farm_tag_male_color_female_color_same", 
                "farm_tag_based_on_eid_tag", "farm_tag_number_digits_from_eid", "farm_tag_color_male", 
                "farm_tag_color_female", "farm_tag_location", "id_fed_tag_male_color_female_color_same", 
                "fed_tag_color_male", "fed_tag_color_female", "fed_tag_location", "id_nues_tag_male_color_female_color_same", 
                "nues_tag_color_male", "nues_tag_color_female", "nues_tag_location", "id_trich_tag_male_color_female_color_same", 
                "trich_tag_color_male", "trich_tag_color_female", "trich_tag_location", "trich_tag_auto_increment", 
                "trich_tag_next_tag_number", "id_bangs_tag_male_color_female_color_same", "bangs_tag_color_male", 
                "bangs_tag_color_female", "bangs_tag_location", "id_sale_order_tag_male_color_female_color_same", 
                "sale_order_tag_color_male", "sale_order_tag_color_female", "sale_order_tag_location", "use_paint_marks", 
                "paint_mark_color", "paint_mark_location", "tattoo_color", "tattoo_location", "freeze_brand_location", 
                "id_idremovereasonid", "id_tissuesampletypeid", "id_tissuetestid", "id_tissuesamplecontainertypeid", 
                "birth_type", "rear_type", "minimum_birth_weight", "maximum_birth_weight", "birth_weight_id_unitsid", 
                "weight_id_unitsid", "sale_price_id_unitsid", "evaluation_update_alert", "death_reason_id_contactid", 
                "death_reason_id_companyid", "id_deathreasonid", "transfer_reason_id_contactid", 
                "transfer_reason_id_companyid", "id_transferreasonid", "user_system_serial_number", "created", "modified"
            ]
            logger.info(f"Setting for {setting_name} fetched successfully, retrieved {len(row)} record.")
            return dict(zip(columns, row))
        else:
            return None
    except Exception as e:
        logger.error(f"Failed to fetch default setting details: {e}")
        return None
    
def fetch_evaluation_details(db_connection, evaluation_name):
    """
    Fetches details for a specific evaluation from the database.

    Args:
        evaluation_name (str): The name of the evaluation to fetch details for.

    Returns:
        dict: A dictionary containing the details of the evaluation.
    """
    try:
        row = db_connection.fetchone(GET_EVALUATION_DETAILS, (evaluation_name,))
        if row:
            columns = [
                "id_savedevaluationstableid", "evaluation_name", "saved_evaluation_id_contactid", "saved_evaluation_id_companyid", 
                "trait_name01", "trait_name02", "trait_name03", "trait_name04", "trait_name05", "trait_name06", 
                "trait_name07", "trait_name08", "trait_name09", "trait_name10", "trait_name11", "trait_name12", 
                "trait_name13", "trait_name14", "trait_name15", "trait_units11", "trait_units12", "trait_units13", 
                "trait_units14", "trait_units15", "trait_name16", "trait_name17", "trait_name18", "trait_name19", 
                "trait_name20", "created", "modified"
            ]
            logger.info(f"Evaluation for {evaluation_name} fetched successfully, retrieved {len(row)} record.")
            return dict(zip(columns, row))
        else:
            return None
    except Exception as e:
        logger.error(f"Failed to fetch evaluation details: {e}")
        return None


def save_setting_changes(db_connection, updated_details):
    """
    Saves the changes made to the default setting.

    Args:
        updated_details (dict): A dictionary of the updated setting details.
    """
    setting_id = updated_details.pop('id_animaltrakkerdefaultsettingsid')  # Extract the ID for the WHERE clause
    modified = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    updated_details['modified'] = modified
    params = tuple(updated_details.values()) + (setting_id,)
    rows_affected = db_connection.save(UPDATE_SETTING_DETAILS, params)
    if rows_affected:
        logger.info(f"Successfully updated setting with ID {setting_id}")
    else:
        logger.error(f"Failed to update setting with ID {setting_id}")
            
def save_evaluation_changes(db_connection, updated_details):
    """
    Saves the changes made to the evaluation.

    Args:
        updated_details (dict): A dictionary of the updated evaluation details.
    """
    evaluation_id = updated_details.pop('id_savedevaluationstableid')  # Extract the ID for the WHERE clause
    modified = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    updated_details['modified'] = modified
    params = tuple(updated_details.values()) + (evaluation_id,)
    rows_affected = db_connection.save(UPDATE_EVALUATION_DETAILS, params)
    if rows_affected:
        logger.info(f"Successfully updated evaluation with ID {evaluation_id}")
    else:
        logger.error(f"Failed to update evaluation with ID {evaluation_id}")        
    
def save_new_setting(db_connection, new_setting_name):
    """
    Saves a new setting by copying details from the 'Standard Setting'.

    Args:
        db_connection: The database connection object.
        new_setting_name (str): The name of the new setting.
    """
    try:
        # Fetch the details of the 'Standard Setting'
        row = db_connection.fetchone(GET_SETTING_DETAILS, ('Standard Settings',))
        if not row:
            logger.error("Standard Setting not found.")
            return

        # Prepare the new setting details
        new_setting_details = list(row)
        new_setting_details[1] = new_setting_name  # Update the setting name

        # Remove the primary key and the original created and modified timestamps
        #new_setting_details = new_setting_details[1:-2]

        # Add 'created' and 'modified' timestamps
        created = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        modified = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        new_setting_details[-2] = created
        new_setting_details[-1] = modified
        
        # Remove the primary key
        new_setting_details = new_setting_details[1:]

        # Convert to tuple for insertion
        params = tuple(new_setting_details)
              
        # Insert the new setting into the database
        db_connection.save(CREATE_NEW_SETTING, params)
        logger.info(f"Successfully created new setting with name {new_setting_name}")
    except Exception as e:
        logger.error(f"Failed to create new setting: {e}")
        
def save_new_evaluation(db_connection, new_evaluation_name):
    """
    Saves a new evaluation by copying details from the 'Standard Evaluation'.

    Args:
        db_connection: The database connection object.
        new_evaluation_name (str): The name of the new evaluation.
    """
    try:
        # Fetch the details of the 'Standard Evaluation'
        row = db_connection.fetchone(GET_EVALUATION_DETAILS, ('Simple Lambing',))
        if not row:
            logger.error("Standard Evaluation not found.")
            return

        # Prepare the new evaluation details
        new_evaluation_details = list(row)
        new_evaluation_details[1] = new_evaluation_name  # Update the evaluation name

        # Remove the primary key and the original created and modified timestamps
        new_evaluation_details[-2] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # created
        new_evaluation_details[-1] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # modified
        
        # Remove the primary key
        new_evaluation_details = new_evaluation_details[1:]

        # Convert to tuple for insertion
        params = tuple(new_evaluation_details)
              
        # Insert the new evaluation into the database
        db_connection.save(CREATE_NEW_EVALUATION, params)
        logger.info(f"Successfully created new evaluation with name {new_evaluation_name}")
    except Exception as e:
        logger.error(f"Failed to create new evaluation: {e}")

            
def fetch_species_names(db_connection):
    """
    Fetches species common names from the species_table.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list of str: List containing species IDs and common names.
    """
    try:
        rows = db_connection.fetchall(GET_SPECIES_NAMES)
        logger.info(f"Species names fetched successfully, retrieved {len(rows)} records.")
        print("Pure data from db:", rows)
        return [(row[0], row[1]) for row in rows]
    except Exception as e:
        logger.error(f"Failed to fetch species names: {e}")
        return []
    
def fetch_breed_names(db_connection):
    """
    Fetches breed names from the breed_table.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list of str: List containing breed IDs andnames.
    """
    try:
        rows = db_connection.fetchall(GET_BREED_NAMES)
        logger.info(f"Breed names fetched successfully, retrieved {len(rows)} records.")
        return [(row[0], row[1]) for row in rows]
    except Exception as e:
        logger.error(f"Failed to fetch breed names: {e}")
        return []

def fetch_state_names(db_connection):
    """
    Fetches state names from the state_table.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list of str: List containing state IDs andnames.
    """
    try:
        rows = db_connection.fetchall(GET_STATE_NAMES)
        logger.info(f"State names fetched successfully, retrieved {len(rows)} records.")
        return [(row[0], row[1]) for row in rows]
    except Exception as e:
        logger.error(f"Failed to fetch state names: {e}")
        return []

def fetch_county_names(db_connection):
    """
    Fetches county names from the county_table.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list of str: List containing county IDs and names.
    """
    try:
        rows = db_connection.fetchall(GET_COUNTY_NAMES)
        logger.info(f"County names fetched successfully, retrieved {len(rows)} records.")
        return [(row[0], row[1]) for row in rows]
    except Exception as e:
        logger.error(f"Failed to fetch county names: {e}")
        return []

def fetch_codon_values(animal_id, db_connection):

    def get_codon_136(db_connection, codon_136_value_id):
        if codon_136_value_id is None:
            return []
        result = db_connection.fetchone(GET_CODON_136, (codon_136_value_id,))
        return result[0] if result else None

    def get_codon_171(db_connection, codon_171_value_id):
        if codon_171_value_id is None:
            return []
        result = db_connection.fetchone(GET_CODON_171, (codon_171_value_id,))
        return result[0] if result else None
    
    def get_coat_color(db_connection, coat_color_value_id):
        if coat_color_value_id is None:
            return []
        result = db_connection.fetchone(GET_COAT_COLOR, (coat_color_value_id,))
        return result[0] if result else None

    results = db_connection.fetchall(GET_CODONS_VALUE_IDS, (animal_id,))
    codon_value_ids = {'codon_136': None, 'codon_171': None, 'coat_color': None}
    for table_id, value_id in results:
        if table_id == 2:
            codon_value_ids['codon_136'] = value_id
        elif table_id == 5:
            codon_value_ids['codon_171'] = value_id
        elif table_id == 7:
            codon_value_ids['coat_color'] = value_id

    codon_136_alleles = get_codon_136(db_connection, codon_value_ids['codon_136'])
    codon_171_alleles = get_codon_171(db_connection, codon_value_ids['codon_171'])
    coat_color = get_coat_color(db_connection, codon_value_ids['coat_color'])
    
    return codon_136_alleles, codon_171_alleles, coat_color

def fetch_owner_info(db_connection, animal_id):
    """
    Fetches owner name based on the animal ID.
    """
    try:
        result = db_connection.fetchone(GET_OWNER_INFO, (animal_id,))
        
        if result:
            to_id_contactid, to_id_companyid, _ = result
            if to_id_contactid and to_id_contactid != 0:
                contact_name = db_connection.fetchone(GET_CONTACT_NAME, (to_id_contactid,))
                return contact_name[0] if contact_name else None
            elif to_id_companyid and to_id_companyid != 0:
                company_name = db_connection.fetchone(GET_COMPANY_NAME, (to_id_companyid,))
                return company_name[0] if company_name else None
        return []
    except Exception as e:
        logger.error(f"An error occurred in 'fetch_owner_info': {e}")
        return []

def fetch_breeder_info(db_connection, animal_id):
    """
    Fetches breeder name based on the animal ID.
    """
    try:
        result = db_connection.fetchone(GET_BREEDER_IDS, (animal_id,))
        
        if result:
            _, company_id, contact_id = result
            if company_id and company_id > 0:
                company_name = db_connection.fetchone(GET_COMPANY_NAME, (company_id,))
                return company_name[0] if company_name else None
            elif contact_id and contact_id > 0:
                contact_name = db_connection.fetchone(GET_CONTACT_NAME, (contact_id,))
                return contact_name[0] if contact_name else None
        return []
    except Exception as e:
        logger.error(f"An error occurred in 'fetch_breeder_info': {e}, {animal_id}")
        return []
    
def fetch_animal_location(db_connection, animal_id):
    """
    Fetches the location history of an animal by animalid and returns the last known location if the animal isn't dead.

    Args:
        db_connection (sqlite3.Connection): The database connection instance.
        animal_id (int): The ID of the animal.

    Returns:
        str: Full address of the last known location or an empty string if the animal is dead.
    """
    try:
        rows = db_connection.fetchall(GET_ANIMAL_LOCATION_HISTORY, (animal_id,))

        if not rows:
            logger.info("No location history found for animal ID %s", animal_id)
            return []

        latest_date = max(row[2] for row in rows)  # movement_date is the third column
        latest_premises = [row for row in rows if row[2] == latest_date]

        if any(row[4] == '' or row[4] == 0 for row in latest_premises):  # to_id_premiseid is the fifth column
            #logger.info("Animal ID %s is dead", animal_id)
            return []

        last_location = latest_premises[0]  # If there are multiple, choose the first one

        return fetch_premise_info(db_connection, last_location[4])  # to_id_premiseid is the fifth column

    except Exception as e:
        logger.error("Failed to fetch location history for animal ID %s: %s", animal_id, e)
        return []

def fetch_premise_info(db_connection, premise_id):
    """
    Fetches the address components of a premise given its ID and concatenates them into a full address.

    Args:
        db_connection (sqlite3.Connection): The database connection instance.
        premise_id (int): The ID of the premise.

    Returns:
        str: Full address of the premise.
    """
    try:
        row = db_connection.fetchone(GET_PREMISE_INFO_FIELDS, (premise_id,))

        if row:
            address_parts = [
                row[0],  # premise_address1
                row[1],  # premise_address2
                row[2],  # premise_city
                row[3],  # state_abbrev
                row[4]   # premise_postcode
            ]
            
            # Check if country needs to be included
            if row[6] > 1:
                address_parts.append(row[5])  # country_name
            
            # Filter out None or empty strings and join with ', '
            full_address = ', '.join(filter(None, address_parts))
            return full_address

        return []

    except Exception as e:
        logger.error("Failed to fetch premise info for premise ID %s: %s", premise_id, e)
        return []

def fetch_example(db_connection):
    # this is just example, copy of fetch_states_names list of states
    try:
        rows = db_connection.fetchall(GET_STATE_NAMES)
        logger.info(f"State names fetched successfully, retrieved {len(rows)} records.")
        return [(row[0], row[1]) for row in rows]
    except Exception as e:
        logger.error(f"Failed to fetch state names: {e}")
        return []