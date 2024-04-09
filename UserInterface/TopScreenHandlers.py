from Database.AnimalTrakker_Query_Defs import db_connect, get_animals_without_printed_pedigree, get_animal_evaluation_history, get_evaluation_traits, get_evaluation_trait, get_evaluation_units

def handle_print_pedigree(currentdatabase):
    connection = db_connect(currentdatabase)
    animals_without_printed_pedigree = get_animals_without_printed_pedigree(connection)
    connection.close()

    pedigree_data = []
    for animal in animals_without_printed_pedigree:
        pedigree_data.append((animal[1], animal[2], animal[3], animal[4], animal[5]))

    return pedigree_data
    
def handle_animal_evaluation_history(currentdatabase):
    connection = db_connect(currentdatabase)
    animal_evaluation_history = get_animal_evaluation_history(connection)
    connection.close()

    return animal_evaluation_history

def handle_trait_analysis(currentdatabase, evaluation_id):
    connection = db_connect(currentdatabase)
    # Get the traits and units11-15 from db
    traits_and_units = get_evaluation_traits(connection, evaluation_id)
    
    # Filter traits and untis, and put them in tuples with names of the traits
    traits_score = [trait for trait in traits_and_units[:10] if trait != 0]
    traits_units = [trait for trait in traits_and_units[10:15] if trait != 0]
    traits_custom = [trait for trait in traits_and_units[15:20] if trait != 0]
    units = [unit for unit in traits_and_units[20:] if unit != 0]
    
    trait_units_combined = [(trait_unit, unit) for trait_unit, unit in zip(traits_units, units)]
    
    traits_score_final = []
    traits_units_final = []  # Initialize an empty list to store the final tuples

    for trait in traits_score:
        trait_output = get_evaluation_trait(connection, trait)
        # Create a tuple and append it to traits_score_final
        traits_score_final.append((trait, trait_output[0]))
    for trait, unit in trait_units_combined:
        trait_output = get_evaluation_trait(connection, trait)
        unit_output = get_evaluation_units(connection, unit)
        # Create a tuple and append it to traits_score_final
        traits_units_final.append((trait_output[0], unit_output))
        print(traits_units_final)
        
    connection.close()
    return traits_score_final, traits_units_final, traits_custom, trait_units_combined, units