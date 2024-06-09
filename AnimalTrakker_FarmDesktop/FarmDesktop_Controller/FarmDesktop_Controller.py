from AnimalTrakker_Shared.Shared_BaseController import BaseController
from AnimalTrakker_Shared.Shared_Widgets import HomeWidget, ConfirmationMessageWidget
from AnimalTrakker_Shared.Shared_Logging import get_logger
from AnimalTrakker_Shared.Shared_Database.Shared_Utilities import report_picker

from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import *
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Handlers import handle_trait_analysis, construct_search_query
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_Widgets import EvaluationWidget, EditWidget, LeftSidebarChoiceWidget, CreateNewDBEntryWidget, SearchLeftSidebarWidget, SearchMainFrameWidget
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import *

import pandas as pd
from tkinter import messagebox
import tkinter as tk

logger = get_logger(__name__)

class FarmDesktopController(BaseController):
    """
    Controller for the Farm Desktop application, handling specific user interactions
    and extending the functionality of the BaseController from the shared module.

    This controller adds specific logic to the basic functions provided by the BaseController,
    focusing on the specific needs of the Farm Desktop application, such as handling sidebar clicks
    with a focus on specific operational logic depending on the area of the application interacted with.
    """
    
    def __init__(self):
        """
        Initialize the FarmDesktopController by calling the initializer of the BaseController.
        """
        super().__init__()  # Call the base class constructor to perform any setup defined there.
        self.search_results = None

    def handle_sidebar_click(self, item, item_text):
        """
        Handles click events on items within the sidebar of the Farm Desktop application.

        This method extends the common click handler by logging specific interactions
        and performing application-specific logic based on the item clicked in the sidebar.

        Args:
            item (str): The identifier (iid) of the clicked Treeview item.
            item_text (str): The text of the clicked Treeview item.

        Extends:
            This method extends the `handle_common_click` method from BaseController to include
            additional logging and handling specific to the Farm Desktop environment.
        """
        # Call the common click handler first to handle generic tasks such as logging and possibly quitting
        super().handle_common_click(item, item_text)
        
        if item:
            # Log a specific message about the interaction with the item, using the item's text for clarity
            logger.info(f"Farm Desktop specific interaction for item: {item_text}")
        else:
            # Handle clicks on the empty area of the sidebar, which might be used for deselecting items, etc.
            logger.info("Clicked on empty area - specific to Farm Desktop")
            
        # Perform specific logic based on the item clicked in the sidebar
        # Get the parent of the clicked item
        parent_id = self.app.left_sidebar.treeview.parent(item)
        
        if parent_id == 'animalevaluationhistory':
            logger.info(f"Handling evaluation history for item: {item_text}")
            self.handle_evaluation_history(item, item_text)
        elif parent_id == 'setup':
            logger.info(f"Handling setup for item: {item_text}")
            if item_text == 'Set, Create and Edit General Defaults':
                self.set_default_setting()
            if item_text == 'Set Current Evaluation':
                self.set_evaluation()
        elif parent_id == 'animals':
            logger.info(f"Handling animals for item: {item_text}")
            if item_text == 'Animal Search':
                self.animal_search(search_type="default")
            if item_text == 'Move Animals':
                self.animal_search(search_type="moveanimals")
        elif parent_id == 'addanimaldata':
            logger.info(f"Handling animal reports for item: {item_text}")
            if item_text == 'Update Optimal Ag Ram BSE':
                self.update_optimal_ag_ram_bse_report()
                
    def handle_evaluation_history(self, item, item_text):
        """
        Handles the fetching and displaying of evaluation history based on a sidebar item selection.

        This method is triggered when an item under 'Animal Evaluation History' in the sidebar is clicked.

        Args:
            item (str): The ID of the sidebar item that was clicked.
        """
        
        # Fetching the data from the database
        data = handle_trait_analysis(self.app.db_connection, item, item_text)
        
        # Updating the main frame content
        self.app.main_frame.update_content(EvaluationWidget, data=data)
        
    def set_default_setting(self):
        choices = fetch_default_settings(self.app.db_connection)
        logger.info(f"Choices for Default settings: {choices}")
        self.app.left_sidebar.switch_to_widget(
            LeftSidebarChoiceWidget, 
            choices=choices, 
            choice_type="setting", 
            controller=self, 
            style_manager=self.app.style_manager
        )

    def set_evaluation(self):
        choices = fetch_evaluations(self.app.db_connection)
        logger.info(f"Choices for Evaluation settings: {choices}")
        self.app.left_sidebar.switch_to_widget(
            LeftSidebarChoiceWidget, 
            choices=choices, 
            choice_type="evaluation", 
            controller=self, 
            style_manager=self.app.style_manager
        )

    def load_setting(self, choice, edit=False, choice_type="setting"):
        """
        Loads the selected choice and updates the main frame.

        Args:
            choice (str): The name of the selected choice.
            edit (bool): Whether the choice is for editing an existing item. Defaults to False.
            choice_type (str): The type of choice ('setting' or 'evaluation'). Defaults to 'setting'.
        """
        if choice_type == "setting":
            if choice == 'Create New':
                self.app.main_frame.update_content(CreateNewDBEntryWidget, controller=self, entry_type="setting")
            else:
                if edit:
                    setting_details = fetch_setting_details(self.app.db_connection, setting_name=choice)
                    if setting_details:
                        self.app.main_frame.update_content(EditWidget, data_details=setting_details, controller=self, db_connection=self.app.db_connection, data_type="setting")
                else:
                    self.app.current_default_setting = choice
                    self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"{choice} has been chosen as the default setting.")
                    self.app.bottom_bar.update_current_setting(choice)
        elif choice_type == "evaluation":
            if choice == 'Create New':
                self.app.main_frame.update_content(CreateNewDBEntryWidget, controller=self, entry_type="evaluation")
            else:
                if edit:
                    evaluation_details = fetch_evaluation_details(self.app.db_connection, evaluation_name=choice)
                    if evaluation_details:
                        self.app.main_frame.update_content(EditWidget, data_details=evaluation_details, controller=self, db_connection=self.app.db_connection, data_type="evaluation")
                else:
                    self.app.current_evaluation = choice
                    self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"{choice} has been chosen as the evaluation.")
                    self.app.bottom_bar.update_current_evaluation(choice)
                    
    def save_edited_data(self, updated_details, data_type):
        logger.info(f"Farm Desktop Controller: Save button clicked for {data_type}")
        if data_type == "setting":
            save_setting_changes(self.app.db_connection, updated_details)
            self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"Edits for {updated_details['default_settings_name']} has been saved.")
            self.set_default_setting()
        elif data_type == "evaluation":
            save_evaluation_changes(self.app.db_connection, updated_details)
            self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"Edits for {updated_details['evaluation_name']} has been saved.")
            self.set_evaluation()
        
    def confirm_new_setting_creation(self, new_setting_name):
        """
        Handle the confirmation of a new setting creation.

        Args:
            new_setting_name (str): The name of the new setting.
        """
        logger.info(f'New setting created with name: {new_setting_name}')
        save_new_setting(self.app.db_connection, new_setting_name)
        self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"New setting '{new_setting_name}' has been created.")
        self.set_default_setting()
        
    def confirm_new_evaluation_creation(self, new_evaluation_name):
        """
        Handle the confirmation of a new evaluation creation.

        Args:
            new_evaluation_name (str): The name of the new evaluation.
        """
        logger.info(f'New evaluation created with name: {new_evaluation_name}')
        save_new_evaluation(self.app.db_connection, new_evaluation_name)
        self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"New evaluation '{new_evaluation_name}' has been created.")
        self.set_evaluation()
    
    def animal_search(self, search_type):
        """
        Display the Animal Search interface with the search parameters sidebar and main frame.
        """
        logger.info("Displaying Animal Search interface")
        
        # Clear any existing content in the left sidebar
        self.app.left_sidebar.clear_content_frame()

        # Create and display the SearchLeftSidebarWidget
        self.left_sidebar_widget = SearchLeftSidebarWidget(
            parent=self.app.left_sidebar.content_frame, 
            controller=self, 
            style_manager=self.app.style_manager,
            search_type=search_type,
            db_connection=self.app.db_connection
        )
        self.left_sidebar_widget.pack(expand=True, fill='both')
        self.app.left_sidebar.current_widget = self.left_sidebar_widget  # Store the reference

        # Create and display the SearchMainFrameWidget
        self.app.main_frame.update_content(
            SearchMainFrameWidget, 
            controller=self
        )

        # Store a reference to the newly created SearchMainFrameWidget
        self.main_frame_widget = self.app.main_frame.current_widget

    def perform_animal_search(self, search_params):
        """
        Perform the animal search based on input fields and selected display options.
        """
        if not hasattr(self, 'left_sidebar_widget'):
            logger.error("Left sidebar widget is not initialized.")
            return

        display_options = self.left_sidebar_widget.get_selected_options()
        if not display_options:
            logger.error("No display options selected.")
            if hasattr(self, 'main_frame_widget'):
                self.main_frame_widget.update_message("Please select at least one display option.")
            return
        
        self.search_results = construct_search_query(search_params, self.left_sidebar_widget.option_to_field, display_options, self.app.db_connection)
        
        self.display_search_results(self.search_results, display_options)


    def display_search_results(self, results, display_options):
        """
        Display the search results in the SearchBoxWidget.
        """
        if not hasattr(self, 'search_box_widget'):
            logger.error("Search box widget is not initialized.")
            return

        self.search_box_widget.display_results(results, display_options)
        
    def go_home(self):
        """
        Handles the home button logic specific to the Farm Desktop.
        """
        logger.info("Farm Desktop Controller: Home button clicked")
        
        if self.app:
            # Refresh the GUI data
            self.app.refresh_gui_data()
            # Update the main frame content to the HomeWidget
            self.app.main_frame.update_content(HomeWidget)
        else:
            logger.error("GUI instance is not set in the controller.")
            
    def update_optimal_ag_ram_bse_report(self):
        """
        Reads the selected Excel file using pandas, structures the data, fetches animal ID, and processes it.
        """
        def modify_eid(eid):
            """Modifies the EID by removing the trailing underscore and adding one after the third digit."""
            eid = eid.rstrip('_')
            if len(eid) > 3:
                eid = eid[:3] + '_' + eid[3:]
            return eid

        def find_missing_animals(data):
            missing_animals = []
            for row in data:
                if row.get("id_animalid") == 'not found':
                    missing_animals.append(row)
            return missing_animals

        def filter_evaluated_animals(evaluated_animals, data):
            found_animal_ids = {row["id_animalid"] for row in data if "id_animalid" in row}
            return [animal for animal in evaluated_animals if animal[0] not in found_animal_ids]

        def show_detailed_missing_animals_popup(missing_animals, evaluated_animals):
            root = tk.Tk()
            root.title("Missing Animals")
            root.geometry("800x600")  # Set initial size of the popup window

            left_frame = tk.Frame(root)
            left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

            right_frame = tk.Frame(root)
            right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

            tk.Label(left_frame, text="Missing Animals").pack()
            tk.Label(right_frame, text="Evaluated Animals on Same Date").pack()

            missing_listbox = tk.Listbox(left_frame, selectmode=tk.SINGLE, exportselection=False)
            missing_listbox.pack(fill=tk.BOTH, expand=True)

            evaluated_listbox = tk.Listbox(right_frame, selectmode=tk.SINGLE, exportselection=False)
            evaluated_listbox.pack(fill=tk.BOTH, expand=True)

            for animal in missing_animals:
                missing_listbox.insert(tk.END, f"EID: {animal['EID']}, Name: {animal['Animal ID']}")

            filtered_evaluated_animals = filter_evaluated_animals(evaluated_animals, data)

            for animal in filtered_evaluated_animals:
                evaluated_listbox.insert(tk.END, f"Animal ID: {animal[0]}, Date: {animal[1]}")

            tk.Button(root, text="Match Selected", command=lambda: match_animals(missing_listbox, evaluated_listbox, root)).pack()

            root.mainloop()

        def extract_classification_text(classification):
            """Extracts the text part from the classification string."""
            return ' '.join(classification.split()[1:])
        
        def match_animals(missing_listbox, evaluated_listbox, root):
            selected_missing = missing_listbox.curselection()
            selected_evaluated = evaluated_listbox.curselection()

            if selected_missing and selected_evaluated:
                missing_animal = missing_listbox.get(selected_missing[0])
                evaluated_animal = evaluated_listbox.get(selected_evaluated[0])
                # Extract the EID and animal ID from the selected items and update the data dictionary accordingly
                missing_eid = missing_animal.split(',')[0].split(': ')[1]
                evaluated_id = evaluated_animal.split(',')[0].split(': ')[1]

                # Find the corresponding data entry and update its id_animalid
                for row in data:
                    if row['EID'] == missing_eid:
                        row['id_animalid'] = evaluated_id
                        break

                # Optionally, update the UI or provide feedback to the user
                logger.info(f"Matched {missing_eid} with animal ID {evaluated_id}")

                # Remove the matched items from the listboxes
                missing_listbox.delete(selected_missing[0])
                evaluated_listbox.delete(selected_evaluated[0])

                # Check if there are no more missing animals left
                if missing_listbox.size() == 0:
                    root.destroy()  # Close the popup window
                    for row in data:
                        if not pd.isna(row.get("Morphological Defects")):  # Check if Morphological Defects is not empty
                            add_animal_note(
                                self.app.db_connection,
                                row["id_animalid"],
                                row["Morphological Defects"],
                                row["Date"].strftime('%Y-%m-%d'),
                                row["Date"].strftime('%H:%M:%S'),
                                predefined_notes_id=0  # Assuming 1 is the ID for predefined note
                            )

                        if not pd.isna(row.get("Remarks")):  # Check if Remarks is not empty
                            add_animal_note(
                                self.app.db_connection,
                                row["id_animalid"],
                                row["Remarks"],
                                row["Date"].strftime('%Y-%m-%d'),
                                row["Date"].strftime('%H:%M:%S'),
                                predefined_notes_id=0  # Assuming 2 is the ID for predefined note
                            )
                        
                        classification_text = extract_classification_text(row["Classification"])
                        existing_alert = fetch_animal_alert(self.app.db_connection, row["id_animalid"])
                        new_alert = f"{classification_text}\n{existing_alert}".strip()
                        update_animal_alert(self.app.db_connection, row["id_animalid"], new_alert)
                            
                        eval_rows = fetch_animal_evaluations_by_date(self.app.db_connection, row["id_animalid"], row["Date"].strftime('%Y-%m-%d'))
                        if eval_rows:
                            for eval_row in eval_rows:
                                eval_id = eval_row['id_animalevaluationid']
                                for i in range(11, 16):
                                    if eval_row[f"trait_name{i}"] == 47:
                                        update_trait_score(self.app.db_connection, eval_id, i, row["Motility"])
                                    elif eval_row[f"trait_name{i}"] == 48:
                                        update_trait_score(self.app.db_connection, eval_id, i, row["Morphology"])
                                for i in range(16, 21):
                                    if eval_row[f"trait_name{i}"] == 53:
                                        update_trait_score(self.app.db_connection, eval_id, i, row["Classification"])
                    self.app.main_frame.update_content(ConfirmationMessageWidget, message="Optimal Ag Ram BSE was updated successfully.")
            else:
                messagebox.showwarning("Selection Error", "Please select an item from both lists to match.")

        file_path = report_picker()
        
        if not file_path:
            return
        
        # Load the Excel file
        if file_path.endswith('.xls'):
            df = pd.read_excel(file_path, engine='xlrd')
        else:
            df = pd.read_excel(file_path, engine='openpyxl')

        # Convert the dataframe to a list of dictionaries
        data = df.to_dict(orient='records')

        for row in data:
            # Iterate over a copy of the dictionary's items to avoid changing size during iteration
            for key, value in list(row.items()):
                if key == "EID":
                    modified_eid = modify_eid(value)
                    row[key] = modified_eid
                    # Fetch the animal ID using the modified EID
                    animal_id_info = fetch_animalid_by_eid(self.app.db_connection, modified_eid)
                    if animal_id_info:
                        row["id_animalid"] = animal_id_info
                    else:
                        row["id_animalid"] = 'not found'

        # After processing the data
        missing_animals = find_missing_animals(data)
        eval_date = data[0]['Date'].strftime('%Y-%m-%d') if data else None

        if eval_date:
            evaluated_animals = fetch_animalids_by_evaluation_date(self.app.db_connection, eval_date)
            show_detailed_missing_animals_popup(missing_animals, evaluated_animals)


