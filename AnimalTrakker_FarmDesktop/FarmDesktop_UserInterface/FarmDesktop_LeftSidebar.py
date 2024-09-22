
#################################
# define strings for minor tabs #
#################################
class TabNames:
    ## Animal Reports
    LIST_OF_ANIMALS                  = 'Get List of Animals'
    ANIMAL_SCAN                      = 'Get Animal Scan & Count Log'
    OWNERSHIP_HISTORY                = 'Get Ownership History'
    LOCATION_HISTORY                 = 'Get Location History'
    ID_HISTORY                       = 'Get ID History'
    DRUG_HISTORY                     = 'Get Drug History'
    NOTE_HISTROY                     = 'Get Note History'
    EVALUATION_RESULTS               = 'Get Evaluation Results'
    OPTIMAL_LIVESTOCK_RAM_BSE_REPORT = 'Get Optimal Livestock Ram BSE Report'
    OPTIMAL_LIVESTOCK_EWE_REPORT     = 'Get Optimal Ewe Ultrasound Report'
    MALE_BREEDING_SOUNDNESS_REPORT   = 'Get Male Breeding Soundness Report'
    FEMALE_PREGNANCY_REPORT          = 'Get Female Pregnancy Status Report'
    ANIMAL_DEATHS_REPORT             = 'Get Animal Deaths Report'
    PURCHASE_ANIMAL_REPORT           = 'Get Purchased Animals Report'
    SOLD_ANIMALS_REPORT              = 'Get Sold Animals Report'

    ## Estimated Breeding Values
    GET_SHEEP_NISP_REPORT       = "Get Sheep NSIP Report"
    ADD_NSIP_RESULT_DATA        = "Add NSIP Result Data"
    CREATE_NSIP_DATA_SUBMISSION = "Create NSIP Data Submission"

    ## Animal/EID Management
    UPDATE_ANIMAL_DETAILS = "Update Animal Details"
    SIMPLE_ADD_ANIMAL     = "Simple Add Animal"
    DETAILED_ADD_ANIMAL   = "Detailed Add Animal"
    UPDATE_ANIMAL_ID      = "Update Animal ID"
    ANIMAL_DEATHS         = "Animal Deaths"

    ## Animal Evaluation
    DELETE_SAVED_EVALUATION          = "Delete Saved Evaluation"
    OPTIMAL_LIVESTOCK_RAM_BSE        = "Optimal Livestock Ram BSE"
    OPTIMAL_LIVESTOCK_EWE_ULTRASOUND = "Optimal Livestock Ewe Ultrasound"
    TAKE_TISSUE_SAMPLES              = "Take Tissue Samples"
    EVALUATE_ANIMAL                  = "Evaluate Animal"
    MALE_BREEDING_SOUNDESS           = "Male Breeding Soundness"
    FEMALE_PREGNANCY_STATUS          = "Female Pregnancy Status"
    CREATE_SAVED_EVALUATION          = "Create Saved Evaluation"

    ## Animal Care/Vet
    GIVE_DRUGS                 = "Give Drugs"
    VACCINATE_AND_DEWORM       = "Vaccinate & Deworm"
    GENERAL_ANIMAL_CARE        = "General Animal Care"
    REMOVE_DRUGS               = "Remove Drugs"
    GROUP_GIVE_DRUGS           = "Group Give Drugs"
    GROUP_REMOVE_DRUGS         = "Group Remove Drugs"
    GROUP_VACCINATE_AND_DEWORM = "Group Vaccinate & Deworm"
    GROUP_GENERAL_ANIMAL_CARE  = "Group General Animal Care"

    ## Breeding & Birthing
    ADD_MALE_BREEDING_RECORDS   = "Add Male Breeding Records"
    ADD_FEMALE_BREEDING_RECORDS = "Add Female Breeding Records"
    SIMPLE_LAMBING              = "Simple Lambing"
    DETAILED_LAMBING            = "Detailed Lambing"
    SIMPLE_BIRTHS               = "Simple Births"

    ## Animal Movements
    SORT_FEMALES_FOR_BREEDING = "Sort Females For Breeding"
    MOVE_TO_NEW_PREMISE       = "Move To New Premise"
    BUY_ANIMAL                = "Buy Animal"
    SELL_ANIMAL               = "Sell Animal"
    GROUP_MOVE_TO_NEW_PREMISE = "Group Move To New Premise"

    ## Contact & Company Reports
    GET_CONTACT_LIST = "Get Contact List"

    ## Contact & Company Management
    ADD_EDIT_CONTACT = "Add/Edit Contact"
    ADD_EDIT_COMPANY = "Add/Edit Company"
    ADD_EDIT_PREMISE = "Add/Edit Premise"
    ADD_EDIT_VET     = "Add/Edit Veterinarian"
    ADD_EDIT_LAB     = "Add/Edit Laboratory"

    ## Setup
    SET_AND_CLEAR_ANIMAL_ALERTS = "Set & Clear Animal Alerts"
    SELECT_SAVED_DEFAULTS       = "Select Saved Defaults"
    CREATE_SAVED_DEFAULTS       = "Create Saved Defaults"
    DELETE_SAVED_DEFAULTS       = "Delete Saved Defaults"
    PURCHASE_DRUGS              = "Purchase Drugs"
    DISPOSE_DRUGS               = "Dispose Drugs"
    ADD_PREDEFINED_NOTES        = "Add Predefined Notes"

    ## Database Management
    SELECT_NEW_DB = "Select New Database"
    BACKUP_DB     = "Backup Databse"

##################################################### end TabNames




def farm_desktop_left_sidebar(evaluation_history):
    tree_data = [
        {'parent': '', 'index': 0, 'iid': 'animal_reports', 'text': 'Animal Reports', 'children': [
            {'text': TabNames.LIST_OF_ANIMALS},
            {'text': TabNames.ANIMAL_SCAN},
            {'text': TabNames.OWNERSHIP_HISTORY},
            {'text': TabNames.LOCATION_HISTORY},
            {'text': TabNames.ID_HISTORY},
            {'text': TabNames.DRUG_HISTORY},
            {'text': TabNames.NOTE_HISTROY},
            {'text': TabNames.EVALUATION_RESULTS},
            {'text': TabNames.OPTIMAL_LIVESTOCK_RAM_BSE_REPORT},
            {'text': TabNames.OPTIMAL_LIVESTOCK_EWE_REPORT},
            {'text': TabNames.MALE_BREEDING_SOUNDNESS_REPORT},
            {'text': TabNames.FEMALE_PREGNANCY_REPORT},
            {'text': TabNames.ANIMAL_DEATHS_REPORT},
            {'text': TabNames.PURCHASE_ANIMAL_REPORT},
            {'text': TabNames.SOLD_ANIMALS_REPORT},
        ]},
        {'parent': '', 'index': 1, 'iid': 'estimated_breeding_values', 'text': 'Estimated Breeding Values', 'children': [
            {'text': TabNames.GET_SHEEP_NISP_REPORT},
            {'text': TabNames.ADD_NSIP_RESULT_DATA},
            {'text': TabNames.CREATE_NSIP_DATA_SUBMISSION},
        ]},
        {'parent': '', 'index': 2, 'iid': 'animal_eid_management', 'text': 'Animal/EID Management', 'children': [
            {'text': TabNames.UPDATE_ANIMAL_DETAILS},
            {'text': TabNames.SIMPLE_ADD_ANIMAL},
            {'text': TabNames.DETAILED_ADD_ANIMAL},
            {'text': TabNames.UPDATE_ANIMAL_ID},
            {'text': TabNames.ANIMAL_DEATHS},
        ]},
        {'parent': '', 'index': 3, 'iid': 'animal_evaluation', 'text': 'Animal Evaluation', 'children': [
            {'text': TabNames.DELETE_SAVED_EVALUATION},
            {'text': TabNames.OPTIMAL_LIVESTOCK_RAM_BSE},
            {'text': TabNames.OPTIMAL_LIVESTOCK_EWE_ULTRASOUND},
            {'text': TabNames.TAKE_TISSUE_SAMPLES},
            {'text': TabNames.EVALUATE_ANIMAL},
            {'text': TabNames.MALE_BREEDING_SOUNDESS},
            {'text': TabNames.FEMALE_PREGNANCY_STATUS},
            {'text': TabNames.CREATE_SAVED_EVALUATION},
        ]},
        {'parent': '', 'index': 4, 'iid': 'animal_care_vet', 'text': 'Animal Care/Vet', 'children': [
            {'text': TabNames.GIVE_DRUGS},
            {'text': TabNames.VACCINATE_AND_DEWORM},
            {'text': TabNames.GENERAL_ANIMAL_CARE},
            {'text': TabNames.REMOVE_DRUGS},
            {'text': TabNames.GROUP_GIVE_DRUGS},
            {'text': TabNames.GROUP_REMOVE_DRUGS},
            {'text': TabNames.GROUP_VACCINATE_AND_DEWORM},
            {'text': TabNames.GROUP_GENERAL_ANIMAL_CARE},
        ]},
        {'parent': '', 'index': 5, 'iid': 'breeding_and_birthing', 'text': 'Breeding & Birthing', 'children': [
            {'text': TabNames.ADD_MALE_BREEDING_RECORDS},
            {'text': TabNames.ADD_FEMALE_BREEDING_RECORDS},
            {'text': TabNames.SIMPLE_LAMBING},
            {'text': TabNames.DETAILED_LAMBING},
            {'text': TabNames.SIMPLE_BIRTHS},
        ]},
        {'parent': '', 'index': 6, 'iid': 'animal_movements', 'text': 'Animal Movements', 'children': [
            {'text': TabNames.SORT_FEMALES_FOR_BREEDING},
            {'text': TabNames.MOVE_TO_NEW_PREMISE},
            {'text': TabNames.BUY_ANIMAL},
            {'text': TabNames.SELL_ANIMAL},
            {'text': TabNames.GROUP_MOVE_TO_NEW_PREMISE},
        ]},
        {'parent': '', 'index': 7, 'iid': 'contact_and_company_reports', 'text': 'Contact & Company Reports', 'children': [
            {'text': TabNames.GET_CONTACT_LIST},
        ]},
        {'parent': '', 'index': 8, 'iid': 'contact_and_company_management', 'text': 'Contact & Company Management', 'children': [
            {'text': TabNames.ADD_EDIT_CONTACT},
            {'text': TabNames.ADD_EDIT_COMPANY},
            {'text': TabNames.ADD_EDIT_PREMISE},
            {'text': TabNames.ADD_EDIT_VET},
            {'text': TabNames.ADD_EDIT_LAB},
        ]},
        {'parent': '', 'index': 9, 'iid': 'setup', 'text': 'Setup', 'children': [
            {'text': TabNames.SET_AND_CLEAR_ANIMAL_ALERTS},
            {'text': TabNames.SELECT_SAVED_DEFAULTS},
            {'text': TabNames.CREATE_SAVED_DEFAULTS},
            {'text': TabNames.DELETE_SAVED_DEFAULTS},
            {'text': TabNames.PURCHASE_DRUGS},
            {'text': TabNames.DISPOSE_DRUGS},
            {'text': TabNames.ADD_PREDEFINED_NOTES},
        ]},
        {'parent': '', 'index': 10, 'iid': 'database_management', 'text': 'Database Management', 'children': [
            {'text': TabNames.SELECT_NEW_DB},
            {'text': TabNames.BACKUP_DB},
        ]},
    ]

    return tree_data
