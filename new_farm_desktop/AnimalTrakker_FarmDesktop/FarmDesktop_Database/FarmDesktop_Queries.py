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
		id_savedevaluationstableid = ?
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