def farm_desktop_left_sidebar(evaluation_history):
    tree_data = [
        {'parent': '', 'index': 0, 'iid': 'animals', 'text': 'Setup', 'children': [
            {'text': 'Animal Search'},
            {'text': 'Add/Edit Animal'},
            {'text': 'Process Web Entries'},
            {'text': 'Animal Reports'},
            {'text': 'Animal Deaths'},
            {'text': 'Animal Transfers'}
        ]},
        {'parent': '', 'index': 1, 'iid': 'members', 'text': 'Animal/EID Management', 'children': [
            {'text': 'Member Search'},
            {'text': 'Member Reports'},
            {'text': 'Add/Edit Member'}
        ]},
        {'parent': '', 'index': 2, 'iid': 'animalevaluationhistory', 'text': 'Animal Evaluation History', 'children': evaluation_history},
        {'parent': '', 'index': 3, 'iid': 'flockherdbook', 'text': 'Animal Care/Vet', 'children': [
            {'text': 'Print Registrations'},
            {'text': 'Print Transfers'},
            {'text': 'Print Members'},
            {'text': 'Print Prefixes'}
        ]},
        {'parent': '', 'index': 4, 'iid': 'populationanalysis', 'text': 'Birthing', 'children': [
            {'text': 'Define Founders'},
            {'text': 'Calculate Inbreeding'},
            {'text': 'Calculate Bloodlines'}
        ]},
        {'parent': '', 'index': 5, 'iid': 'animalmovements', 'text': 'Animal Movements'},
        {'parent': '', 'index': 6, 'iid': 'animalhistory', 'text': 'Animal History'},
        {'parent': '', 'index': 7, 'iid': 'registryreports', 'text': 'Database Management'},
        {'parent': '', 'index': 8, 'iid': 'quitanimaltrakker', 'text': 'Quit'}
    ]
    
    return tree_data
