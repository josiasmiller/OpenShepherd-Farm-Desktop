from Database.AnimalTrakker_Query_Defs import *

def fetch_animal_pedigree_data(currentdatabase, animal_id):
    # Establish a connection to the database
    connection = db_connect(currentdatabase)

    # Fetch the registry information for the animal
    animal_registry_data = get_animal_pedigree_recursive(connection, animal_id, depth=5)  # Assuming you want a depth of 3 generations

    # Close the connection if it's no longer needed
    connection.close()

    # Display the data or do further processing
    return animal_registry_data

def get_animal_pedigree_recursive(connection, animal_id, depth):
    if depth == 0:
        return "Depth limit reached"

    animal_data = get_animal_pedigree(connection, animal_id)
    if animal_data:
        # Unpack the data
        id_animalid, flock_prefix, animal_name, sire_id, dam_id, birth_date, id_sexid, birth_type, reg_num = animal_data
        # reg_num = get_recent_reg_num(animal_id)  # Assuming this function is defined elsewhere
    else:
        return "No data on the animal"

    # Recursively fetch registry for sire and dam
    sire_data = get_animal_pedigree_recursive(connection, sire_id, depth - 1)
    dam_data = get_animal_pedigree_recursive(connection, dam_id, depth - 1)

    # Structure the output
    animal_pedigree_info = {
        "id": id_animalid,
        "name": animal_name,
        "birth_date": birth_date,
        "sex_id": id_sexid,
        "birth_type": birth_type,
        "reg_num": reg_num,
        "flock_prefix": flock_prefix,
        "parents": {
            "sire": sire_data,
            "dam": dam_data
        }
    }
    return animal_pedigree_info

def fetch_animal_aditional_data(currentdatabase, animal_id):
    connection = db_connect(currentdatabase)

    federal_id = get_federal_id(connection, animal_id)
    farm_id = get_farm_id(connection, animal_id)
    inbreed_coef = get_inbreeding_coefficient(connection, animal_id)
    birth_weight = get_animal_birth_weight(connection, animal_id)
    weight_50days = get_animal_50days_weight(connection, animal_id)
    codon_136, codon_171 = get_codons(connection, animal_id)
    
    breeder_info, breeder_phone, breeder_flock_number, breeder_scrapie_id = get_breeder_info(connection, animal_id)
    owner_info, owner_phone, owner_flock_number, owner_scrapie_id = get_owner_info(connection, animal_id)

    connection.close()
    
    def sort_address_info(address_info):
        """
        Sorts and selects address information based on their status, jurisdiction, and type.
        
        If there is only one address, it returns that address with a detailed report. 
        For multiple addresses, it prioritizes active addresses, 
        and within those, addresses with a Federal jurisdiction (jurisdiction == 2). 
        If multiple addresses still remain, it selects based on the premise type preference 
        for 'Both' or 'Physical', finally defaulting to the first address if needed.
        
        Parameters:
        - address_info (list of tuples): Each tuple contains address details 
        with the structure (status, jurisdiction, type, full_address).
        
        Returns:
        - tuple: Selected address information and a formatted report string.
        """
        report = ""
        selected_address = None

        if len(address_info) == 1:
            # Handling a single address scenario
            address = address_info[0]
            report = (f"+++ Only one address found. Premise Status: {address[0]}, "
                    f"Premise Jurisdiction: {address[1]}, Premise Type: {address[2]}, "
                    f"Address: {address[-1]}")
            selected_address = address
        elif len(address_info) > 1:
            # Handling multiple addresses
            active_addresses = [addr for addr in address_info if addr[0] == 'active']

            if len(active_addresses) == 1:
                # Only one active address
                address = active_addresses[0]
            elif len(active_addresses) == 0:
                # No active addresses
                preferred_types = [addr for addr in address_info if addr[2] in ["Both", "Physical"]]
                address = preferred_types[0] if preferred_types else address_info[0]
            else:
                # Multiple active addresses
                federal_addresses = [addr for addr in active_addresses if addr[1] == 2]
                address = federal_addresses[0] if federal_addresses else active_addresses[0]
            
            selected_address = address
            # Generate report based on the first occurrence with full names
            report = (f"!!! Multiple Addresses found. Premise Status: {address[0]}, "
                    f"Premise Status: {address[0]}, Premise Jurisdiction: {address[1]}, Premise Type: {address[2]}, "
                    f"Address: {address[-1]}")
            if len(address_info) > 1:
                # Append additional addresses with indices if more than one
                report += "\nAdditional addresses:\n" + "\n".join(
                    [f"Premise Status {i+1}: {addr[0]}, Premise Jurisdiction {i+1}: {addr[1]}, Premise Type {i+1}: {addr[2]}, Address {i+1}: {addr[-1]}" for i, addr in enumerate(address_info) if addr != address])
            
        return selected_address[-1], report
    
    print("fetch_animal_aditional_data, breeder_info: ", breeder_info)
    print("fetch_animal_aditional_data, owner_info: ", owner_info)
        
    breeder_info, _ = sort_address_info(breeder_info)
    owner_info, print_report = sort_address_info(owner_info)
    
    print("final info: ", breeder_info, owner_info, print_report)
    
    animal_additional_info = {
        "id": animal_id,
        "federal_id": federal_id,
        "farm_id": farm_id,
        "inbreed_coef": inbreed_coef,
        "breeder_info": breeder_info,
        "breeder_phone": breeder_phone,
        "owner_info": owner_info,
        "owner_phone": owner_phone,
        "breeder_flock_number": breeder_flock_number,
        "owner_flock_number": owner_flock_number,
        "breeder_scrapie_id": breeder_scrapie_id,
        "owner_scrapie_id": owner_scrapie_id,
        "birth_weight": birth_weight,
        "weight_50days": weight_50days,
        "codon_136": codon_136,
        "codon_171": codon_171,
        "print_report": print_report,
    }
    
    return animal_additional_info
