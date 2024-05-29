from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import fetch_evaluation_data
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import *

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

def construct_search_query(search_params, option_to_field, display_options, db_connection):
    
    def generate_alias(base_alias, alias_counters):
        # Since we are using same data from the table, sqlite don't understand it directly, so we need to create aliases for forming query
        if base_alias not in alias_counters:
            alias_counters[base_alias] = 1
        else:
            alias_counters[base_alias] += 1
        return f"{base_alias}{alias_counters[base_alias]}"

    # Initial query to get id_animalid and necessary fields for filtering
    base_query = "SELECT {fields} FROM animal_table"
    join_clauses = []
    selected_fields = ["animal_table.id_animalid"]  # Ensure id_animalid is always selected

    alias_counters = {}

    for display_option in display_options:
        field, join_table_1, join_table_2, join_field = option_to_field[display_option]
        if join_field:
            base_alias = join_table_1.split('.')[0]
            table_alias = generate_alias(base_alias, alias_counters)
            if join_table_2:
                join_clause = f"""
                LEFT JOIN {join_table_1.split('.')[0]} AS {table_alias} ON animal_table.{field} = {table_alias}.{join_table_1.split('.')[1]}
                LEFT JOIN {join_table_2.split('.')[0]} AS {table_alias}2 ON {table_alias}.{join_table_2.split('.')[1]} = {table_alias}2.{join_table_2.split('.')[1]}
                """
                join_clauses.append(join_clause)
                selected_fields.append(f"{table_alias}2.{join_field.split('.')[1]} AS {display_option.lower().replace(' ', '_')}")
            else:
                join_clause = f"LEFT JOIN {join_table_1.split('.')[0]} AS {table_alias} ON animal_table.{field} = {table_alias}.{join_table_1.split('.')[1]}"
                join_clauses.append(join_clause)
                selected_fields.append(f"{table_alias}.{join_field.split('.')[1]} AS {display_option.lower().replace(' ', '_')}")
        else:
            if display_option not in ["Scrapie Codon 171", "Scrapie Codon 136", "Coat Color"]:
                selected_fields.append(f"animal_table.{field} AS {display_option.lower().replace(' ', '_')}")

    fields = ", ".join(selected_fields)
    joins = " ".join(join_clauses)
    
    conditions = []
    for field, value in search_params.items():
        if value:
            conditions.append(f"animal_table.{field} LIKE '%{value}%'")
    
    if not conditions:
        conditions.append("1=1")  # No filters applied

    where_clause = " AND ".join(conditions)
    initial_query = f"{base_query.format(fields=fields)} {joins} WHERE {where_clause}"
    
    # Execute initial query to get id_animalid values and other fields
    results = db_connection.fetchall(initial_query)
    if not results:
        return []

    # Retrieve codon values using id_animalid
    codon_136_selected = "Scrapie Codon 136" in display_options
    codon_171_selected = "Scrapie Codon 171" in display_options
    coat_color_selected = "Coat Color" in display_options

    final_results = []
    for result in results:
        result_dict = dict(zip(selected_fields, result))  # Create a dictionary for easy manipulation
        animal_id = result_dict.pop('animal_table.id_animalid')  # Remove id_animalid

        if codon_136_selected or codon_171_selected or coat_color_selected:
            codon_values = get_codon_values(animal_id, db_connection)
            codon_136_alleles, codon_171_alleles, coat_color = codon_values

            if codon_136_selected:
                result_dict["scrapie_codon_136"] = codon_136_alleles

            if codon_171_selected:
                result_dict["scrapie_codon_171"] = codon_171_alleles
                
            if coat_color_selected:
                result_dict["coat_color"] = coat_color

        final_results.append(list(result_dict.values()))  # Append only the values to the final results

    return final_results


def get_codon_values(animal_id, db_connection):

    def get_codon_136(db_connection, codon_136_value_id):
        if codon_136_value_id is None:
            return None
        result = db_connection.fetchone(GET_CODON_136, (codon_136_value_id,))
        return result[0] if result else None

    def get_codon_171(db_connection, codon_171_value_id):
        if codon_171_value_id is None:
            return None
        result = db_connection.fetchone(GET_CODON_171, (codon_171_value_id,))
        return result[0] if result else None
    
    def get_coat_color(db_connection, coat_color_value_id):
        if coat_color_value_id is None:
            return None
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