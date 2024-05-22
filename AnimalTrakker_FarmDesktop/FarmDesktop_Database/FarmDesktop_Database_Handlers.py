from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import fetch_evaluation_data
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import GET_EVALUATION_TRAIT, GET_EVALUATION_UNITS, GET_CODONS_VALUE_IDS, GET_CODON_136, GET_CODON_171

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
        base_query = "SELECT {fields} FROM animal_table"
        join_clauses = []
        selected_fields = []
        codon_136_selected = False
        codon_171_selected = False
        table_aliases = {
            "sire_id": "sire_table",
            "dam_id": "dam_table"
        }

        for display_option in display_options:
            field, join_table_1, join_table_2, join_field = option_to_field[display_option]
            if join_field:
                if field in table_aliases:
                    table_alias = table_aliases[field]
                    join_clause = f"LEFT JOIN animal_table AS {table_alias} ON animal_table.{field} = {table_alias}.id_animalid"
                    join_clauses.append(join_clause)
                    selected_fields.append(f"{table_alias}.animal_name AS {display_option.lower().replace(' ', '_')}")
                else:
                    table_alias = join_table_1.split('.')[0]
                    if join_table_2:
                        join_clause = f"""
                        LEFT JOIN {join_table_1.split('.')[0]} AS {join_table_1.split('.')[0]} ON animal_table.{field} = {join_table_1.split('.')[0]}.{join_table_1.split('.')[1]}
                        LEFT JOIN {join_table_2.split('.')[0]} AS {join_table_2.split('.')[0]} ON {join_table_1.split('.')[0]}.{join_table_2.split('.')[1]} = {join_table_2.split('.')[0]}.{join_table_2.split('.')[1]}
                        """
                        join_clauses.append(join_clause)
                        selected_fields.append(f"{join_table_2.split('.')[0]}.{join_field.split('.')[1]} AS {display_option.lower().replace(' ', '_')}")
                    else:
                        join_clause = f"LEFT JOIN {table_alias} AS {table_alias} ON animal_table.{field} = {table_alias}.{join_table_1.split('.')[1]}"
                        join_clauses.append(join_clause)
                        selected_fields.append(f"{join_table_1.split('.')[0]}.{join_field.split('.')[1]} AS {display_option.lower().replace(' ', '_')}")
            else:
                if display_option == "Scrapie Codon 171":
                    codon_171_selected = True
                    selected_fields.append("codon_171_alleles AS scrapie_codon_171")
                elif display_option == "Scrapie Codon 136":
                    codon_136_selected = True
                    selected_fields.append("codon_136_alleles AS scrapie_codon_136")
                else:
                    selected_fields.append(f"animal_table.{field} AS {display_option.lower().replace(' ', '_')}")

        fields = ", ".join(selected_fields)
        joins = " ".join(join_clauses)
        
        conditions = []
        for field, value in search_params.items():
            if value:
                if field == "id_animalid":
                    conditions.append(f"animal_table.{field} = '{value}'")
                else:
                    conditions.append(f"animal_table.{field} LIKE '%{value}%'")
        
        if not conditions:
            conditions.append("1=1")  # No filters applied

        where_clause = " AND ".join(conditions)
        query = f"{base_query.format(fields=fields)} {joins} WHERE {where_clause}"
        
        if codon_136_selected or codon_171_selected:
            codon_values = get_codon_values(search_params.get("id_animalid"), db_connection)
            codon_136_alleles, codon_171_alleles = codon_values

            if codon_136_selected:
                query = query.replace("codon_136_alleles", f"'{codon_136_alleles}'")
            if codon_171_selected:
                query = query.replace("codon_171_alleles", f"'{codon_171_alleles}'")
            
        return query

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

    results = db_connection.fetchall(GET_CODONS_VALUE_IDS, (animal_id,))
    codon_value_ids = {'codon_136': None, 'codon_171': None}
    for table_id, value_id in results:
        if table_id == 2:
            codon_value_ids['codon_136'] = value_id
        elif table_id == 5:
            codon_value_ids['codon_171'] = value_id

    codon_136_alleles = get_codon_136(db_connection, codon_value_ids['codon_136'])
    codon_171_alleles = get_codon_171(db_connection, codon_value_ids['codon_171'])
    
    return codon_136_alleles, codon_171_alleles