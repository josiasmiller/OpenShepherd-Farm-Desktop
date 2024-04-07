from Database.AnimalTrakker_Query_Defs import db_connect, get_animals_without_printed_pedigree

def handle_print_pedigree(currentdatabase):
        connection = db_connect(currentdatabase)
        animals_without_printed_pedigree = get_animals_without_printed_pedigree(connection)
        connection.close()

        pedigree_data = []
        for animal in animals_without_printed_pedigree:
            pedigree_data.append((animal[1], animal[2], animal[3], animal[4], animal[5]))

        return pedigree_data