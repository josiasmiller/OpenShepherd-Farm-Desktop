from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import fetch_evaluation_data
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import GET_EVALUATION_TRAIT, GET_EVALUATION_UNITS

from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

def handle_trait_analysis(db_connection, evaluation_id, evaluation_name):
    traits_and_units = fetch_evaluation_data(db_connection, evaluation_id, evaluation_name)
    
    # Filter traits and untis, and put them in tuples with names of the traits
    traits_score = [trait for trait in traits_and_units[:10] if trait != 0]
    traits_units = [trait for trait in traits_and_units[10:15] if trait != 0]
    traits_custom = [trait for trait in traits_and_units[15:20] if trait != 0]
    units = [unit for unit in traits_and_units[20:] if unit != 0]
    
    trait_units_combined = [(trait_unit, unit) for trait_unit, unit in zip(traits_units, units)]
    
    traits_score_final = []
    traits_units_final = []  # Initialize an empty list to store the final tuples

    for trait in traits_score:
        trait_output = db_connection.fetchone(GET_EVALUATION_TRAIT, (trait,))
        # Create a tuple and append it to traits_score_final
        traits_score_final.append((trait, trait_output[0]))
    print(traits_score_final)
    for trait, unit in trait_units_combined:
        trait_output = db_connection.fetchone(GET_EVALUATION_TRAIT, (trait,))
        unit_output = db_connection.fetchall(GET_EVALUATION_UNITS, (unit,))
        # Create a tuple and append it to traits_score_final
        traits_units_final.append((trait_output[0], unit_output))
    print(traits_units_final)
        
    return traits_score_final, traits_units_final, traits_custom, trait_units_combined, units