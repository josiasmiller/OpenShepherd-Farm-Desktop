def farm_desktop_left_sidebar(evaluation_history):
    tree_data = [
        {'parent': '', 'index': 0, 'iid': 'animals', 'text': 'Animals', 'children': [
            {'text': 'Animal Search'},
            {'text': 'Update Animal'},
            {'text': 'Move Animals'},
            {'text': 'Buy Animals'},
            {'text': 'Sell Animals'},
            {'text': 'Animal Deaths'},
            {'text': 'Set and Clear Animal Alerts'},
            {'text': 'Simple Births'},
            {'text': 'Simple Lambing'},
            {'text': 'Detailed Lambing'}
        ]},
        {'parent': '', 'index': 1, 'iid': 'addanimaldata', 'text': 'Add Animal Data', 'children': [
            {'text': 'Add, Edit and Remove ID'},
            {'text': 'Add General Evaluations'},
            {'text': 'Add Vaccination and Deworming'},
            {'text': 'Add and Remove Drugs Given'},
            {'text': 'Add Trim Hooves and Other General Tasks'},
            {'text': 'Add Male Breeding Soundness Exams'},
            {'text': 'Update Optimal Ag Ram BSE'},
            {'text': 'Add Male Breeding Records'},
            {'text': 'Add Female Breeding Records'},
            {'text': 'Add Female Pregnancy Tests'},
            {'text': 'Add Tissue Sample Tests'}
        ]},
        {'parent': '', 'index': 2, 'iid': 'animalreports', 'text': 'Animal Reports', 'children': [
            {'text': 'Get List of Current Animals'},
            {'text': 'Get Ownership History'},
            {'text': 'Get Location History'},
            {'text': 'Get ID History'},
            {'text': 'Get Male Breeding Soundness Report'},
            {'text': 'Get Optimal Ag Ram BSE Report'},
            {'text': 'Get Female Pregnancy Status Report'},
            {'text': 'Get Optimal Ag Ewe Ultrasound Report'},
            {'text': 'Get Animal Deaths Report'},
            {'text': 'Get Purchased Animals Report'},
            {'text': 'Get Sold Animal Report'}
        ]},
        {'parent': '', 'index': 3, 'iid': 'estimatedbreedingvalues', 'text': 'Estimated Breeding Values', 'children': [
            {'text': 'Add NSIP Data'},
            {'text': 'Get NSIP Data on Animal'}
        ]},
        {'parent': '', 'index': 4, 'iid': 'contactsandcompanies', 'text': 'Contacts and Companies', 'children': [
            {'text': 'Contact Add/Edit'},
            {'text': 'Company Add/Edit'},
            {'text': 'Premise Add'}
        ]},
        {'parent': '', 'index': 5, 'iid': 'contactsandcompaniesreports', 'text': 'Contact and Company Reports', 'children': []},
        {'parent': '', 'index': 6, 'iid': 'setup', 'text': 'Setup', 'children': [
            {'text': 'Set, Create and Edit General Defaults'},
            {'text': 'Set Current Evaluation'},
            {'text': 'Create and Edit Custom Evaluations'},
            {'text': 'Add Drug Purchases'},
            {'text': 'Drugs Disposed or Used Up'}
        ]},
        {'parent': '', 'index': 7, 'iid': 'databasemanagement', 'text': 'Database Management', 'children': [
            {'text': 'Select a New Database'},
            {'text': 'Backup Database with New Name'}
        ]},
        {'parent': '', 'index': 8, 'iid': 'animalevaluationhistory', 'text': 'Animal Evaluation History', 'children': evaluation_history},
        {'parent': '', 'index': 9, 'iid': 'quitanimaltrakker', 'text': 'Quit'}
    ]
    
    return tree_data
