import sqlite3

# Define the value tuple
params = ('New Setting', 700, 700, 0, 700, 700, 0, 0, 0, 0, 0, 700, 0, 32, 8, 0, 1, 1, 2, 2, 4, 3, 1, 1, 1, 2, 1, 1, 5, 5, 5, 1, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 5, 0, 0, 0, 1, 0, 0, 0, 2, 2, 0.0, 15.0, 1, 1, 8, 0, 0, 700, 14, 0, 700, 5, 0, '2024-05-15 20:17:18', '2024-05-15 20:17:18')

# Connect to the SQLite database
db_connection = sqlite3.connect(':memory:')  # Using in-memory database for testing
cursor = db_connection.cursor()

# Create the schema
create_table_query = """
CREATE TABLE animaltrakker_default_settings_table (
    id_animaltrakkerdefaultsettingsid INTEGER PRIMARY KEY,
    default_settings_name TEXT NOT NULL,
    owner_id_contactid INTEGER NOT NULL,
    owner_id_companyid INTEGER NOT NULL,
    owner_id_premiseid INTEGER NOT NULL,
    breeder_id_contactid INTEGER NOT NULL,
    breeder_id_companyid INTEGER NOT NULL,
    breeder_id_premiseid INTEGER NOT NULL,
    vet_id_contactid INTEGER NOT NULL,
    vet_id_premiseid INTEGER NOT NULL,
    lab_id_companyid INTEGER NOT NULL,
    lab_id_premiseid INTEGER NOT NULL,
    id_registry_id_companyid INTEGER NOT NULL,
    registry_id_premiseid INTEGER NOT NULL,
    id_stateid INTEGER NOT NULL,
    id_countyid INTEGER NOT NULL,
    id_flockprefixid INTEGER NOT NULL,
    id_speciesid INTEGER NOT NULL,
    id_breedid INTEGER NOT NULL,
    id_sexid INTEGER NOT NULL,
    id_idtypeid_primary INTEGER NOT NULL,
    id_idtypeid_secondary INTEGER NOT NULL,
    id_idtypeid_tertiary INTEGER NOT NULL,
    id_eid_tag_male_color_female_color_same INTEGER NOT NULL,
    eid_tag_color_male INTEGER NOT NULL,
    eid_tag_color_female INTEGER NOT NULL,
    eid_tag_location INTEGER NOT NULL,
    id_farm_tag_male_color_female_color_same INTEGER NOT NULL,
    farm_tag_based_on_eid_tag INTEGER NOT NULL,
    farm_tag_number_digits_from_eid INTEGER NOT NULL,
    farm_tag_color_male INTEGER NOT NULL,
    farm_tag_color_female INTEGER NOT NULL,
    farm_tag_location INTEGER NOT NULL,
    id_fed_tag_male_color_female_color_same INTEGER NOT NULL,
    fed_tag_color_male INTEGER NOT NULL,
    fed_tag_color_female INTEGER NOT NULL,
    fed_tag_location INTEGER NOT NULL,
    id_nues_tag_male_color_female_color_same INTEGER NOT NULL,
    nues_tag_color_male INTEGER NOT NULL,
    nues_tag_color_female INTEGER NOT NULL,
    nues_tag_location INTEGER NOT NULL,
    id_trich_tag_male_color_female_color_same INTEGER NOT NULL,
    trich_tag_color_male INTEGER NOT NULL,
    trich_tag_color_female INTEGER NOT NULL,
    trich_tag_location INTEGER NOT NULL,
    trich_tag_auto_increment INTEGER NOT NULL,
    trich_tag_next_tag_number INTEGER NOT NULL,
    id_bangs_tag_male_color_female_color_same INTEGER NOT NULL,
    bangs_tag_color_male INTEGER NOT NULL,
    bangs_tag_color_female INTEGER NOT NULL,
    bangs_tag_location INTEGER NOT NULL,
    id_sale_order_tag_male_color_female_color_same INTEGER NOT NULL,
    sale_order_tag_color_male INTEGER NOT NULL,
    sale_order_tag_color_female INTEGER NOT NULL,
    sale_order_tag_location INTEGER NOT NULL,
    use_paint_marks INTEGER NOT NULL,
    paint_mark_color INTEGER NOT NULL,
    paint_mark_location INTEGER NOT NULL,
    tattoo_color INTEGER NOT NULL,
    tattoo_location INTEGER NOT NULL,
    freeze_brand_location INTEGER NOT NULL,
    id_idremovereasonid INTEGER NOT NULL,
    id_tissuesampletypeid INTEGER NOT NULL,
    id_tissuetestid INTEGER NOT NULL,
    id_tissuesamplecontainertypeid INTEGER NOT NULL,
    birth_type INTEGER NOT NULL,
    rear_type INTEGER NOT NULL,
    minimum_birth_weight REAL NOT NULL,
    maximum_birth_weight REAL NOT NULL,
    birth_weight_id_unitsid INTEGER NOT NULL,
    weight_id_unitsid INTEGER NOT NULL,
    sale_price_id_unitsid INTEGER NOT NULL,
    evaluation_update_alert INTEGER NOT NULL,
    death_reason_id_contactid INTEGER NOT NULL,
    death_reason_id_companyid INTEGER NOT NULL,
    id_deathreasonid INTEGER NOT NULL,
    transfer_reason_id_contactid INTEGER NOT NULL,
    transfer_reason_id_companyid INTEGER NOT NULL,
    id_transferreasonid INTEGER NOT NULL,
    user_system_serial_number INTEGER NOT NULL,
    created TEXT NOT NULL,
    modified TEXT NOT NULL
)
"""
cursor.execute(create_table_query)

# Define the insert query
create_new_setting_query = """
INSERT INTO animaltrakker_default_settings_table (
    default_settings_name, owner_id_contactid, owner_id_companyid, owner_id_premiseid,
    breeder_id_contactid, breeder_id_companyid, breeder_id_premiseid, vet_id_contactid,
    vet_id_premiseid, lab_id_companyid, lab_id_premiseid, id_registry_id_companyid,
    registry_id_premiseid, id_stateid, id_countyid, id_flockprefixid, id_speciesid,
    id_breedid, id_sexid, id_idtypeid_primary, id_idtypeid_secondary, id_idtypeid_tertiary,
    id_eid_tag_male_color_female_color_same, eid_tag_color_male, eid_tag_color_female, eid_tag_location,
    id_farm_tag_male_color_female_color_same, farm_tag_based_on_eid_tag, farm_tag_number_digits_from_eid,
    farm_tag_color_male, farm_tag_color_female, farm_tag_location, id_fed_tag_male_color_female_color_same,
    fed_tag_color_male, fed_tag_color_female, fed_tag_location, id_nues_tag_male_color_female_color_same,
    nues_tag_color_male, nues_tag_color_female, nues_tag_location, id_trich_tag_male_color_female_color_same,
    trich_tag_color_male, trich_tag_color_female, trich_tag_location, trich_tag_auto_increment,
    trich_tag_next_tag_number, id_bangs_tag_male_color_female_color_same, bangs_tag_color_male,
    bangs_tag_color_female, bangs_tag_location, id_sale_order_tag_male_color_female_color_same,
    sale_order_tag_color_male, sale_order_tag_color_female, sale_order_tag_location, use_paint_marks,
    paint_mark_color, paint_mark_location, tattoo_color, tattoo_location, freeze_brand_location,
    id_idremovereasonid, id_tissuesampletypeid, id_tissuetestid, id_tissuesamplecontainertypeid,
    birth_type, rear_type, minimum_birth_weight, maximum_birth_weight, birth_weight_id_unitsid,
    weight_id_unitsid, sale_price_id_unitsid, evaluation_update_alert, death_reason_id_contactid,
    death_reason_id_companyid, id_deathreasonid, transfer_reason_id_contactid,
    transfer_reason_id_companyid, id_transferreasonid, user_system_serial_number, created, modified
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

# Debugging: Print the insert query and number of placeholders
placeholder_count = create_new_setting_query.count('?')
print(f"Number of placeholders in query: {placeholder_count}")

# Debugging: Print the params tuple and its length
print(params)
print(f"Number of elements in params: {len(params)}")

# Execute the insert query
try:
    cursor.execute(create_new_setting_query, params)
    db_connection.commit()
    print("Insert successful")
except Exception as e:
    print(f"Error executing query: {e}")
    db_connection.rollback()
finally:
    cursor.close()
    db_connection.close()
