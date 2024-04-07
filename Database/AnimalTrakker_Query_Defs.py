import sqlite3
from Database.AnimalTrakker_Query_Code import *

from datetime import datetime


# todo the connect def is not ever used maybe eliminate?
#  Was in there to allow for changing from SQLite to another DB in future

#   Using the  with connection construct supposedly does an automatic commit of the query
#   This is the Context Manager approach  timestamp 2:28 in this video
#   https://www.youtube.com/watch?v=hBhAxRwtoJE


# Connecting directly to one db
def db_connect(dbname):
    """
    Creates and returns a database connection to the SQLite database specified by the database path.
    
    Parameters:
    - database_path: The file path to the SQLite database.
    
    Returns:
    A SQLite connection object or None if an error occurs.
    """
    try:
        connection = sqlite3.connect(dbname)
        print("Connected to the database successfully")
        return connection
    except sqlite3.Error as error:
        print("Error while connecting to sqlite", error)
        return None

def execute_query(connection, querycode):
    with connection:
        connection.execute(querycode)

# New code to call query to get animal pedigree data        
def get_animal_pedigree(connection, animal_id):
    with connection:
        return connection.execute(GET_ANIMAL_PEDIGREE, (animal_id,)).fetchone()
    
# Function to get the list of animals with unprinted pedigrees
def get_animals_without_printed_pedigree(connection):
    with connection:
        return connection.execute(GET_LIST_OF_ANIMALS_WITHOUT_PRINTED_PEDIGREE).fetchall()
    
def update_printed_status(currentdatabase, animal_id):
    """
    Update the printed status and modification time for a specific animal's pedigree certificate in the registry_certificate_print_table.
    
    Parameters:
    - currentdatabase: A string representing the path to the database file.
    - animal_id: The unique identifier (int) for the animal whose printed status is being updated.
    
    This function connects to the database, updates the 'printed' column to 1 (indicating the pedigree has been printed),
    and sets the 'modified' column to the current timestamp, for the record matching the provided animal_id.
    
    Returns:
    None
    """
    current_timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    connection = db_connect(currentdatabase)
    with connection:
        connection.execute(UPDATE_PRINTED_STATUS, (current_timestamp, animal_id))
    
# Function to get federal_id/location/color
def get_federal_id(connection, animal_id):
    with connection:
        result = connection.execute(GET_FEDERAL_ID, (animal_id,)).fetchone()
        if result:  # Check if the result is not None
            return result[0]  # Return the first element of the tuple
        return None  # Return None if no result
    
# Function to get farm_id/location/color
def get_farm_id(connection, animal_id):
    with connection:
        result = connection.execute(GET_FARM_ID, (animal_id,)).fetchone()
        if result:  # Check if the result is not None
            return result[0]  # Return the first element of the tuple
        return None  # Return None if no result
    
# Get inbreeding coefficient
def get_inbreeding_coefficient(connection, animal_id):
    with connection:
        result = connection.execute(GET_INBREEDING_COOFFICIENT, (animal_id,)).fetchone()
        if result:
            return result[0]
        return None

# Get animal weight
def get_animal_birth_weight(connection, animal_id):
    with connection:
        result = connection.execute(GET_ANIMAL_BIRTH_WEIGHT, (animal_id,)).fetchone()
        if result:
            return result[0]
        return None

# Calculating an animal's weight at 50 days
def get_animal_50days_weight(connection, animal_id):
    """
    Calculates the weight of an animal at 50 days based on various factors including 
    birth weight, age, and details about the dam.

    Parameters:
    - connection: A database connection object.
    - animal_id: The ID of the animal for which the weight is being calculated.

    Returns:
    - The calculated weight at 50 days, rounded to 2 decimal places, or
    - None if the necessary data is not found or calculations cannot be performed.
    """
    
    def find_second_weight(evaluation_details):
        """
        Finds the second weight from evaluation details based on trait names.

        Parameters:
        - evaluation_details: Tuple containing evaluation details from the database.

        Returns:
        - The second weight if found, otherwise None.
        """
        for i in range(11, 16):
            index = 3 + (i - 11) * 2  # Calculating index based on tuple structure
            if evaluation_details[index] == 16:
                return evaluation_details[index + 1]
        return None

    def calculate_dam_age_at_birth(birth_date, dam_birth_date):
        """
        Calculates the age of the dam at the birth of the animal in years.

        Parameters:
        - birth_date: The birth date of the animal.
        - dam_birth_date: The birth date of the dam.

        Returns:
        - The age of the dam at the birth of the animal in years.
        """
        age_difference = datetime.strptime(birth_date, "%Y-%m-%d") - datetime.strptime(dam_birth_date, "%Y-%m-%d")
        return int(round(age_difference.days / 365.25))  # Accounting for leap years

    def determine_columns(dam_age_at_birth_years, birth_type, rear_type):
        """
        Determines the database columns to use based on the age of the dam and birth/rear type of the lamb.

        Parameters:
        - dam_age_at_birth_years: Age of the dam at birth in years.
        - birth_type: Birth type of the lamb.
        - rear_type: Rear type of the lamb.

        Returns:
        - Tuple containing the names of the columns for ewe age and birth/rear type.
        """
        # Mapping age to the corresponding column name
        if dam_age_at_birth_years <= 1:
            ewe_age_column = "ewe_age_1yr"
        elif dam_age_at_birth_years == 2:
            ewe_age_column = "ewe_age_2yr"
        elif 3 <= dam_age_at_birth_years <= 6:
            ewe_age_column = "ewe_age_3_6yr"
        else:
            ewe_age_column = "ewe_age_over_6yr"

        # Constructing the column name for birth_and_rear type
        birth_and_rear_column = f"birth_and_rear_{birth_type}{rear_type}"

        return ewe_age_column, birth_and_rear_column

    def fetch_coefficients(connection, ewe_age_column, birth_and_rear_column):
        """
        Fetches the coefficients for ewe age and lamb birth/rear type from the database.

        Parameters:
        - connection: Database connection object.
        - ewe_age_column: The column name for the ewe's age.
        - birth_and_rear_column: The column name for the lamb's birth and rear type.

        Returns:
        - A tuple containing the coefficients for ewe age and lamb birth/rear type.
        
        Fixes:
        - Implement checking adjustment_name in sheep_weaning_adjustment_table
        - By id_animalid in animal_breed_table finding id_breedid
        - By id_breedid in breed_table find breed_name
        - Comparing breed_name to adjustment_name in sheep_weaning_adjustment_table
        - If breed_name not in the list, we use id_sheepweaningadjustmentid = 1, adjustment_name = Generic
        """
        query = f"""
            SELECT 
                "{ewe_age_column}", 
                "{birth_and_rear_column}"
            FROM 
                sheep_weaning_adjustment_table
            WHERE 
                id_sheepweaningadjustmentid = ? 
        """
        return connection.execute(query, (1,)).fetchone() # this is where adjustment_name (id_sheepweaningadjustmentid) should be send
    
    # Attempt to retrieve the necessary details from the database
    with connection:
        animal_details = connection.execute(GET_ANIMAL_DETAILS, (animal_id,)).fetchone()
        evaluation_details = connection.execute(GET_EVALUATION_DETAILS, (animal_id,)).fetchone()

    # Validate that both required details are present
    if not animal_details or not evaluation_details:
        return None
    
    # Extracting essential details from the query results
    birth_weight, dam_id, birth_type, rear_type, birth_date = animal_details
    dam_birth_date = connection.execute(GET_DAM_BIRTH_DATE, (dam_id,)).fetchone()[0]
    age_in_days = evaluation_details[1]

    # Search for the appropriate second weight measurement
    second_weight = find_second_weight(evaluation_details)

    # Proceed only if second_weight was successfully found
    if second_weight is None:
        print("No matching trait name found for value 16.")
        return None

    # Calculate preliminary weight at 50 days
    preliminary_weight_50days = ((second_weight - birth_weight) / age_in_days) * 50 + birth_weight

    # Calculate the age of the dam at the birth of the animal in years
    dam_age_at_birth_years = calculate_dam_age_at_birth(birth_date, dam_birth_date)

    # Determine the appropriate columns for age and birth/rear type
    ewe_age_column, birth_and_rear_column = determine_columns(dam_age_at_birth_years, birth_type, rear_type)

    # Retrieve coefficients based on ewe age and lamb birth/rear type
    ewe_age_coef, birth_and_rear_coef = fetch_coefficients(connection, ewe_age_column, birth_and_rear_column)

    # Final weight calculation
    weight_50days = preliminary_weight_50days * ewe_age_coef * birth_and_rear_coef

    # Return the final weight rounded to 2 decimal places
    return round(weight_50days, 2)

# Get breeder info
def get_breeder_info(connection, animal_id):
    """
    Fetches breeder information based on the animal ID. It first determines whether the breeder
    is a contact or a company, then fetches detailed information accordingly.

    :param connection: SQLite database connection object.
    :param animal_id: Integer representing the animal ID.
    :return: A dictionary containing the breeder's information, or None if not found.
    """
    try:
        result = connection.execute(GET_BREEDER_INFO, (animal_id,)).fetchone()

        if result:
            id_type, id_value = result[1], result[2]
            if id_type == 'contactid':
                contact_info = connection.execute(GET_CONTACT_PREMISE_INFO, (id_value,)).fetchall()
                contact_phone = connection.execute(GET_CONTACT_PHONE, (id_value,)).fetchone() # returns tuple, [0] - contactid, [1] - contact phone number
                flock_number = connection.execute(GET_CONTACT_FLOCK_ID, (id_value,)).fetchone()
                scrapie_id = connection.execute(GET_CONTACT_SCRAPIE_ID, (id_value,)).fetchone()
                
                # Initialize default values in case any of the fetchone() calls returned None
                contact_info_value = [address[:-1] + (address[-1].replace(', ,', ','),) for address in contact_info] if contact_info else None
                contact_phone_value = contact_phone[1] if contact_phone else None
                flock_number_value = flock_number[0] if flock_number else None
                scrapie_id_value = scrapie_id[0] if scrapie_id else None
    
                return contact_info_value, contact_phone_value, flock_number_value, scrapie_id_value
            elif id_type == 'companyid':
                company_info = connection.execute(GET_COMPANY_PREMISE_INFO, (id_value,)).fetchall()
                company_phone = connection.execute(GET_COMPANY_PHONE, (id_value,)).fetchone() # returns tuple, [0] - companyid, [1] - company phone number
                flock_number = connection.execute(GET_COMPANY_FLOCK_ID, (id_value,)).fetchone()
                scrapie_id = connection.execute(GET_COMPANY_SCRAPIE_ID, (id_value,)).fetchone()
                
                # Initialize default values in case any of the fetchone() calls returned None
                company_info_value = [address[:-1] + (address[-1].replace(', ,', ','),) for address in company_info]if company_info else None
                company_phone_value = company_phone[1] if company_phone else None
                flock_number_value = flock_number[0] if flock_number else None
                scrapie_id_value = scrapie_id[0] if scrapie_id else None
    
                return company_info_value, company_phone_value, flock_number_value, scrapie_id_value
            else:
                # Handle unexpected id_type
                print("Unexpected ID type")
                return None
        return None, None, None, None
    except Exception as e:
        # Logging or handling the exception as needed
        print(f"An error occurred in 'get_breeder_info': {e}")
        return None, None, None, None
    
def get_owner_info(connection, animal_id):
    """
    Fetches breeder information based on the animal ID. It first determines whether the breeder
    is a contact or a company, then fetches detailed information accordingly.

    :param connection: SQLite database connection object.
    :param animal_id: Integer representing the animal ID.
    :return: A dictionary containing the breeder's address, phone number, flock number and scrapie ID, or None if not found.
    """
    try:
        result = connection.execute(GET_OWNER_INFO, (animal_id,)).fetchone()
        
        if result:
            to_id_contactid, to_id_companyid, _ = result
            if to_id_contactid and to_id_contactid != 0:
                contact_info = connection.execute(GET_CONTACT_PREMISE_INFO, (to_id_contactid,)).fetchall()
                contact_phone = connection.execute(GET_CONTACT_PHONE, (to_id_contactid,)).fetchone() # returns tuple, [0] - contactid, [1] - contact phone number
                flock_number = connection.execute(GET_CONTACT_FLOCK_ID, (to_id_contactid,)).fetchone()
                scrapie_id = connection.execute(GET_CONTACT_SCRAPIE_ID, (to_id_contactid,)).fetchone()
                
                # Initialize default values in case any of the fetchone() calls returned None
                contact_info_value = [address[:-1] + (address[-1].replace(', ,', ','),) for address in contact_info] if contact_info else None
                contact_phone_value = contact_phone[1] if contact_phone else None
                flock_number_value = flock_number[0] if flock_number else None
                scrapie_id_value = scrapie_id[0] if scrapie_id else None
    
                return contact_info_value, contact_phone_value, flock_number_value, scrapie_id_value
            elif to_id_companyid and to_id_companyid != 0:
                company_info = connection.execute(GET_COMPANY_PREMISE_INFO, (to_id_companyid,)).fetchall()
                company_phone = connection.execute(GET_COMPANY_PHONE, (to_id_companyid,)).fetchone() # returns tuple, [0] - companyid, [1] - company phone number
                flock_number = connection.execute(GET_COMPANY_FLOCK_ID, (to_id_companyid,)).fetchone()
                scrapie_id = connection.execute(GET_COMPANY_SCRAPIE_ID, (to_id_companyid,)).fetchone()
                
                # Initialize default values in case any of the fetchone() calls returned None
                company_info_value = [address[:-1] + (address[-1].replace(', ,', ','),) for address in company_info]if company_info else None
                company_phone_value = company_phone[1] if company_phone else None
                flock_number_value = flock_number[0] if flock_number else None
                scrapie_id_value = scrapie_id[0] if scrapie_id else None
    
                return company_info_value, company_phone_value, flock_number_value, scrapie_id_value
            else:
                # Handle unexpected id_type
                ownership_info = ("unknown", None)
                return ownership_info
        return None, None, None, None
    except Exception as e:
        # Logging or handling the exception as needed
        print(f"An error occurred in 'get_owner_info': {e}")
        return None, None, None, None
    
def get_codons(connection, animal_id):
    """
    Fetches the genetic characteristic values for codons 136 and 171 based on the animal ID.

    Parameters:
    - connection: A database connection object.
    - animal_id: The ID of the animal whose codons are being queried.

    Returns:
    - A dictionary with keys 'codon_136' and 'codon_171', containing their respective values.
    """
    
    def get_codon_136(connection, codon_136_value_id):
        """
        Fetches the alleles for codon 136 based on the value ID.

        Parameters:
        - connection: A database connection object.
        - codon_136_value_id: The ID of the value in the genetic_codon136_table.

        Returns:
        - The alleles for codon 136, or None if not found.
        """
        
        if codon_136_value_id is None:
            return None

        # Executing query
        result = connection.execute(GET_CODON_136, (codon_136_value_id,)).fetchone()
        
        # Return the alleles if found
        if result:
            return result[0]
        else:
            return None

    def get_codon_171(connection, codon_171_value_id):
        """
        Fetches the alleles for codon 171 based on the value ID.

        Parameters:
        - connection: A database connection object.
        - codon_171_value_id: The ID of the value in the genetic_codon171_table.

        Returns:
        - The alleles for codon 171, or None if not found.
        """
              
        if codon_171_value_id is None:
            return None
        
        # Executing query
        result = connection.execute(GET_CODON_171, (codon_171_value_id,)).fetchone()
        
        # Return the alleles if found
        if result:
            return result[0]
        else:
            return None

    # Execute the query
    results = connection.execute(GET_CODONS_VALUE_IDS, (animal_id,)).fetchall()

    # Initialize default values for codons in case they are not found
    codon_value_ids = {'codon_136': None, 'codon_171': None}

    # Iterate through the results and assign values based on id_geneticcharacteristictableid
    for table_id, value_id in results:
        if table_id == 2:
            codon_value_ids['codon_136'] = value_id
        elif table_id == 5:
            codon_value_ids['codon_171'] = value_id

    # Getting alleles from corresponding functions
    codon_136_alleles = get_codon_136(connection, codon_value_ids['codon_136'])
    codon_171_alleles = get_codon_171(connection, codon_value_ids['codon_171'])   
    
    return codon_136_alleles, codon_171_alleles
    
def get_all_registries(connection):
    with connection:
        return connection.execute(GET_ALL_REGISTRIES).fetchall()

def get_registry_id_by_name(connection,registry_name):
    with connection:
        return connection.execute(GET_REGISTRY_ID_BY_NAME, (registry_name,)).fetchone()

def get_all_members(connection,registry):
    with connection:
        return connection.execute(GET_ALL_MEMBERS,(registry,)).fetchall()

def get_all_member_status_options(connection,registry):
    with connection:
        return connection.execute(GET_ALL_MEMBER_STATUS_OPTIONS,(registry,)).fetchall()

def get_all_member_type_options(connection,registry):
    with connection:
        return connection.execute(GET_ALL_MEMBER_TYPE_OPTIONS,(registry,)).fetchall()

def get_all_registry_regions(connection, registry):
    with connection:
        return connection.execute(GET_ALL_REGISTRY_REGIONS, (registry,)).fetchall()

def get_member_notes(connection, member, registry):
    with connection:
        return connection.execute(GET_SINGLE_MEMBER_NOTES,(member, registry,)).fetchall()

def get_all_registration_type_options(connection,registry):
    with connection:
        return connection.execute(GET_ALL_REGISTRATION_TYPE_OPTIONS,(registry,)).fetchall()

def get_all_states_for_specific_country(connection,countryid):
    with connection:
        return connection.execute(GET_ALL_STATES_FOR_A_SPECIFIC_COUNTRY,countryid).fetchall()

def get_all_states(connection):
    with connection:
        return connection.execute(GET_ALL_STATES).fetchall()

def get_all_counties_for_specific_state(connection,stateid):
    with connection:
        return connection.execute(GET_ALL_COUNTIES_FOR_A_SPECIFIC_STATE, stateid).fetchall()

def get_all_tag_colors(connection):
    with connection:
        return connection.execute(GET_ALL_TAG_COLORS).fetchall()

def get_all_tag_types(connection):
    with connection:
        return connection.execute(GET_ALL_TAG_TYPES).fetchall()

def get_all_id_locations(connection):
    with connection:
        return connection.execute(GET_ALL_ID_LOCATIONS).fetchall()

def get_all_tissue_sample_types(connection):
    with connection:
        return connection.execute(GET_ALL_TISSUE_SAMPLE_TYPES).fetchall()

def get_all_tissue_test_types(connection):
    with connection:
        return connection.execute(GET_ALL_TISSUE_TEST_TYPES).fetchall()

def get_all_tissue_sample_container_types(connection):
    with connection:
        return connection.execute(GET_ALL_TISSUE_SAMPLE_CONTAINER_TYPES).fetchall()

def get_all_breeds_for_specific_species(connection,speciesid):
    with connection:
        return connection.execute(GET_ALL_BREEDS_FOR_A_SPECIFIC_SPECIES, speciesid).fetchall()

def get_all_sexes_for_specific_species(connection,speciesid):
    with connection:
        return connection.execute(GET_ALL_SEXES_FOR_A_SPECIFIC_SPECIES, speciesid).fetchall()

def get_all_contact_names(connection):
    with connection:
        return connection.execute(GET_ALL_CONTACT_NAMES).fetchall()

def get_all_laboratories(connection):
    with connection:
        cur = connection.cursor()
        return cur.execute(GET_ALL_LABORATORIES).fetchall()

def get_all_transfer_reasons(connection):
    with connection:
        return connection.execute(GET_ALL_TRANSFER_REASONS).fetchall()

def get_all_species(connection):
    with connection:
        return connection.execute(GET_ALL_SPECIES).fetchall()

def get_all_sexes_by_species(connection):
    with connection:
        return connection.execute(GET_ALL_SEXES_BY_SPECIES).fetchall()

def get_all_death_reasons(connection):
    with connection:
        return connection.execute(GET_ALL_DEATH_REASONS).fetchall()

def get_all_breeding_soundness_traits(connection):
    with connection:
        return connection.execute(GET_ALL_BREEDING_SOUNDNESS_TRAITS).fetchall()

def get_bull_test_results_for_csv(connection, fromdate, todate):
    command = GET_BULL_TEST_RESULTS_FOR_CSV.format(fromdate,todate,fromdate,todate)
    with connection:
        return connection.execute(command).fetchall()

def update_general_defaults(connection, key,value,record):
    command = UPDATE_GENERAL_DEFAULTS.format(key, value, record)
    with connection:
        connection.execute(command)

    # with connection:
    #     connection.execute(command, (key, value))
    #     return connection.commit
