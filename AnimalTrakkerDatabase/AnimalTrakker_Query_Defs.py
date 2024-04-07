# 	AnimalTrakker Syste
# Jose Salvatierra from Teclado puts the queries here as string variable.
# This is to make it easier to change the queries by building queries from pieces of query code.

GET_ALL_BREEDS_FOR_A_SPECIFIC_SPECIES = """
	-- This needs a species identifier. It is a foreign key into the species table
	SELECT * FROM breed_table WHERE id_speciesid = ? ORDER BY breed_display_order
	"""

GET_ALL_COUNTIES_FOR_A_SPECIFIC_STATE = """
    SELECT * FROM county_table WHERE id_stateid = ? ORDER BY county_name_display_order
    """

GET_ALL_GENERAL_DEFAULTS = """
	SELECT * FROM animaltrakker_default_settings_table
	"""


GET_ALL_ID_COLORS = """
    SELECT * FROM id_color_table ORDER BY id_color_display_order
    """

GET_ALL_ID_LOCATIONS = """
	SELECT * FROM id_location_table ORDER BY id_location_display_order
	"""

GET_ALL_ID_TYPES = """
    SELECT * FROM id_type_table ORDER BY id_type_display_order
    """

GET_ALL_ID_REMOVE_REASONS = """
	SELECT * FROM id_remove_reason_table ORDER BY id_remove_reason_display_order
	"""

GET_ALL_SAVED_EVALUATIONS = """
	SELECT * FROM saved_evaluations_table 
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

GET_ALL_STATES = """
    SELECT * FROM state_table
    """

GET_ALL_STATES_FOR_A_SPECIFIC_COUNTRY = """
    SELECT * FROM state_table WHERE id_countryid = ? ORDER BY state_display_order
    """

GET_ALL_TISSUE_SAMPLE_CONTAINER_TYPES = """
    SELECT * FROM tissue_sample_container_type_table ORDER BY tissue_sample_container_display_order
    """

GET_ALL_TISSUE_SAMPLE_TYPES = """
    SELECT * FROM tissue_sample_type_table ORDER BY tissue_sample_type_display_order
    """

GET_ALL_TISSUE_TEST_TYPES = """
    SELECT * FROM tissue_test_table ORDER BY tissue_test_display_order
    """


GET_ALL_SPECIES = """
    SELECT * FROM species_table
    """