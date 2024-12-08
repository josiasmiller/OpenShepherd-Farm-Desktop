from AnimalTrakker_Shared.Shared_BaseController import BaseController
from AnimalTrakker_Shared.Shared_Widgets import HomeWidget, ConfirmationMessageWidget
from AnimalTrakker_Shared.Shared_Logging import get_logger
from AnimalTrakker_Shared.Shared_Database.Shared_Utilities import report_picker

from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import *
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Handlers import handle_trait_analysis, construct_search_query
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_Widgets import EvaluationWidget, EditWidget, LeftSidebarChoiceWidget, CreateNewDBEntryWidget, SearchLeftSidebarWidget, SearchMainFrameWidget
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import *
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.csv_writer import write_animal_notes, write_id_history

from AnimalTrakker_FarmDesktop.FarmDesktop_Database.DefaultSettings import default_settings

import pandas as pd
from tkinter import messagebox, filedialog
import tkinter as tk

logger = get_logger(__name__)

from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_LeftSidebar import TabNames


def not_implemented_popup():
    """
    Display a popup message indicating that the button functionality is not yet implemented.
    """
    messagebox.showinfo("Not Implemented", "This button's functionality is not yet implemented.")



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

        # define dictionary that maps the minor tab string to the function to be called
        self._click_handler = {
            ## Animal Reports
            TabNames.LIST_OF_ANIMALS:                  lambda: self.animal_search("default"),
            TabNames.ANIMAL_SCAN:                      not_implemented_popup,
            TabNames.OWNERSHIP_HISTORY:                not_implemented_popup,
            TabNames.LOCATION_HISTORY:                 not_implemented_popup,
            TabNames.ID_HISTORY:                       lambda: self.animal_search("id_history"),
            TabNames.DRUG_HISTORY:                     not_implemented_popup,
            TabNames.NOTE_HISTORY:                     lambda: self.animal_search("notes"),
            TabNames.EVALUATION_RESULTS:               not_implemented_popup,
            TabNames.OPTIMAL_LIVESTOCK_RAM_BSE_REPORT: not_implemented_popup,
            TabNames.OPTIMAL_LIVESTOCK_EWE_REPORT:     not_implemented_popup,
            TabNames.MALE_BREEDING_SOUNDNESS_REPORT:   not_implemented_popup,
            TabNames.FEMALE_PREGNANCY_REPORT:          not_implemented_popup,
            TabNames.ANIMAL_DEATHS_REPORT:             not_implemented_popup,
            TabNames.PURCHASE_ANIMAL_REPORT:           not_implemented_popup,
            TabNames.SOLD_ANIMALS_REPORT:              not_implemented_popup,

            ## Estimated Breeding Values
            TabNames.GET_SHEEP_NISP_REPORT:       not_implemented_popup,
            TabNames.ADD_NSIP_RESULT_DATA:        not_implemented_popup,
            TabNames.CREATE_NSIP_DATA_SUBMISSION: not_implemented_popup,

            ## Animal/EID Management
            TabNames.UPDATE_ANIMAL_DETAILS: not_implemented_popup,
            TabNames.SIMPLE_ADD_ANIMAL:     not_implemented_popup,
            TabNames.DETAILED_ADD_ANIMAL:   not_implemented_popup,
            TabNames.UPDATE_ANIMAL_ID:      not_implemented_popup,
            TabNames.ANIMAL_DEATHS:         not_implemented_popup,

            ## Animal Evaluation
            TabNames.DELETE_SAVED_EVALUATION:          not_implemented_popup,
            TabNames.OPTIMAL_LIVESTOCK_RAM_BSE:        not_implemented_popup,
            TabNames.OPTIMAL_LIVESTOCK_EWE_ULTRASOUND: not_implemented_popup,
            TabNames.TAKE_TISSUE_SAMPLES:              not_implemented_popup,
            TabNames.EVALUATE_ANIMAL:                  not_implemented_popup,
            TabNames.MALE_BREEDING_SOUNDESS:           not_implemented_popup,
            TabNames.FEMALE_PREGNANCY_STATUS:          not_implemented_popup,
            TabNames.CREATE_SAVED_EVALUATION:          not_implemented_popup,

            ## Animal Care/Vet
            TabNames.GIVE_DRUGS:                 not_implemented_popup,
            TabNames.VACCINATE_AND_DEWORM:       not_implemented_popup,
            TabNames.GENERAL_ANIMAL_CARE:        not_implemented_popup,
            TabNames.REMOVE_DRUGS:               not_implemented_popup,
            TabNames.GROUP_GIVE_DRUGS:           not_implemented_popup,
            TabNames.GROUP_REMOVE_DRUGS:         not_implemented_popup,
            TabNames.GROUP_VACCINATE_AND_DEWORM: not_implemented_popup,
            TabNames.GROUP_GENERAL_ANIMAL_CARE:  not_implemented_popup,

            ## Breeding & Birthing
            TabNames.ADD_MALE_BREEDING_RECORDS:   not_implemented_popup,
            TabNames.ADD_FEMALE_BREEDING_RECORDS: not_implemented_popup,
            TabNames.SIMPLE_LAMBING:              not_implemented_popup,
            TabNames.DETAILED_LAMBING:            not_implemented_popup,
            TabNames.SIMPLE_BIRTHS:               not_implemented_popup,

            ## Animal Movements
            TabNames.SORT_FEMALES_FOR_BREEDING: not_implemented_popup,
            TabNames.MOVE_TO_NEW_PREMISE:       not_implemented_popup,
            TabNames.BUY_ANIMAL:                not_implemented_popup,
            TabNames.SELL_ANIMAL:               not_implemented_popup,
            TabNames.GROUP_MOVE_TO_NEW_PREMISE: not_implemented_popup,

            ## Contact & Company Reports
            TabNames.GET_CONTACT_LIST: not_implemented_popup,

            ## Contact & Company Management
            TabNames.ADD_EDIT_CONTACT: not_implemented_popup,
            TabNames.ADD_EDIT_COMPANY: not_implemented_popup,
            TabNames.ADD_EDIT_PREMISE: not_implemented_popup,
            TabNames.ADD_EDIT_VET:     not_implemented_popup,
            TabNames.ADD_EDIT_LAB:     not_implemented_popup,

            ## Setup
            TabNames.SET_AND_CLEAR_ANIMAL_ALERTS: not_implemented_popup,
            TabNames.SELECT_SAVED_DEFAULTS:       not_implemented_popup,
            TabNames.CREATE_SAVED_DEFAULTS:       not_implemented_popup,
            TabNames.DELETE_SAVED_DEFAULTS:       not_implemented_popup,
            TabNames.PURCHASE_DRUGS:              not_implemented_popup,
            TabNames.DISPOSE_DRUGS:               not_implemented_popup,
            TabNames.ADD_PREDEFINED_NOTES:        not_implemented_popup,

            ## Database Management
            TabNames.SELECT_NEW_DB: not_implemented_popup,
            TabNames.BACKUP_DB:     not_implemented_popup,
        }

    def handle_sidebar_click(self, item_text):
        """
        Handles click events on items within the sidebar of the Farm Desktop application.

        This method extends the common click handler by logging specific interactions
        and performing application-specific logic based on the item clicked in the sidebar.

        Args:
            item_text (str): The text of the clicked Treeview item.

        Extends:
            This method extends the `handle_common_click` method from BaseController to include
            additional logging and handling specific to the Farm Desktop environment.
        """
        # Call the common click handler first to handle generic tasks such as logging and possibly quitting
        # super().handle_common_click(item, item_text)

        logger.info(f"Farm Desktop specific interaction for item: {item_text}")

        # do nothing for non clicked items
        if item_text is None:
            return

        if item_text in self._click_handler:
            self._click_handler[item_text]()
        return

                
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
                    set_settings(self.app.db_connection, choice)

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

        if search_type == "default":
            on_csv_save = self.save_csv
        elif search_type == "notes":
            on_csv_save = self.save_notes_csv
        elif search_type == "id_history":
            on_csv_save = self.save_animal_id_history
        else:
            raise Exception("Unknown search type")

        # Create and display the SearchLeftSidebarWidget
        self.left_sidebar_widget = SearchLeftSidebarWidget(
            parent=self.app.left_sidebar.content_frame, 
            controller=self, 
            style_manager=self.app.style_manager,
            search_type=search_type,
            db_connection=self.app.db_connection,
            on_csv_save=on_csv_save,
            on_ods_save=self.save_ods,
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

        :arg results: list[list[str]]   --> data pulled from DB
        :arg display_options: list[str] --> column headers
        """
        if not hasattr(self, 'search_main_frame_widget'):
            logger.error("search_main_frame_widget is not initialized.")
            return

        self.search_main_frame_widget.display_search_results(column_headers=display_options, results=results)

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
        self.message = ""

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

        def show_detailed_missing_animals_popup(parent, missing_animal, evaluated_animals, on_close_callback):
            popup = tk.Toplevel(parent)
            popup.transient(parent)  # Keep the popup on top of the parent
            popup.grab_set()  # Make the popup modal
            popup.title("Match Missing Animal")
            popup.geometry("800x600")

            left_frame = tk.Frame(popup)
            left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

            right_frame = tk.Frame(popup)
            right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

            tk.Label(left_frame, text="Missing Animal").pack()
            tk.Label(right_frame, text="Evaluated Animals on Same Date").pack()

            missing_listbox = tk.Listbox(left_frame, selectmode=tk.SINGLE, exportselection=False)
            missing_listbox.pack(fill=tk.BOTH, expand=True)
            evaluated_listbox = tk.Listbox(right_frame, selectmode=tk.SINGLE, exportselection=False)
            evaluated_listbox.pack(fill=tk.BOTH, expand=True)

            missing_listbox.insert(tk.END, f"EID: {missing_animal['EID']}, Name: {missing_animal['Animal ID']}")

            filtered_evaluated_animals = filter_evaluated_animals(evaluated_animals, data)

            for animal in filtered_evaluated_animals:
                evaluated_listbox.insert(tk.END, f"Flock Prefix: {animal[2]}, Animal Name: {animal[1]}")

            tk.Button(popup, text="Match Selected", command=lambda: match_animals(missing_listbox, evaluated_listbox, popup, missing_animal, on_close_callback)).pack()

            def on_cancel():
                if missing_animals:
                    unprocessed_animals = ', '.join([f"{animal['Animal ID']} (EID: {animal['EID']})" for animal in missing_animals])
                    messagebox.showerror("Unprocessed Animals", f"The following animals were not processed:\n{unprocessed_animals}")
                popup.destroy()
                

            tk.Button(popup, text="Cancel", command=on_cancel).pack()
    
            def on_close():
                if missing_animals:
                    unprocessed_animals = ', '.join([f"{animal['Animal ID']} (EID: {animal['EID']})" for animal in missing_animals])
                    messagebox.showerror("Unprocessed Animals", f"The following animals were not processed:\n{unprocessed_animals}")
                popup.destroy()
                on_close_callback()

            popup.protocol("WM_DELETE_WINDOW", on_close)
            parent.wait_window(popup)  # Wait for the popup to close before continuing

        def extract_classification_text(classification):
            """Extracts the text part from the classification string."""
            return ' '.join(classification.split()[1:])
        
        def match_animals(missing_listbox, evaluated_listbox, popup, missing_animal, on_close_callback):
            selected_missing = missing_listbox.curselection()
            selected_evaluated = evaluated_listbox.curselection()

            if selected_missing and selected_evaluated:
                evaluated_id = evaluated_listbox.get(selected_evaluated[0]).split(',')[0].split(': ')[1]

                missing_animal['id_animalid'] = evaluated_id
                
                # Remove the processed animal from the missing animals list
                missing_animals.pop(0)

                popup.destroy()
                process_animal(missing_animal)

            else:
                messagebox.showwarning("Selection Error", "Please select an item from both lists to match.")
                popup.destroy()
                on_close_callback()
                
            on_close_callback()
            
        def process_animal(row):
            try:
                if not pd.isna(row.get("Morphological Defects")):
                    add_animal_note(
                        self.app.db_connection,
                        row["id_animalid"],
                        row["Morphological Defects"],
                        row["Date"].strftime('%Y-%m-%d'),
                        row["Date"].strftime('%H:%M:%S'),
                        predefined_notes_id=0
                    )
                if not pd.isna(row.get("Remarks")):
                    add_animal_note(
                        self.app.db_connection,
                        row["id_animalid"],
                        row["Remarks"],
                        row["Date"].strftime('%Y-%m-%d'),
                        row["Date"].strftime('%H:%M:%S'),
                        predefined_notes_id=0
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
                                numeric_part = row['Classification'].split(' ')[0]
                                update_trait_score(self.app.db_connection, eval_id, i, numeric_part)

                self.message += f"Animal {row['Animal ID']} with EID {row['EID']} was updated successfully\n"
                self.app.main_frame.update_content(ConfirmationMessageWidget, message=self.message)

            except Exception as e:
                messagebox.showerror("Processing Error", f"Error processing animal {row['Animal ID']} with EID {row['EID']}: {str(e)}")
                return

        def process_next_missing_animal(missing_animals, evaluated_animals):
            if missing_animals:
                next_missing_animal = missing_animals[0]
                show_detailed_missing_animals_popup(self.app, next_missing_animal, evaluated_animals, lambda: process_next_missing_animal(missing_animals, evaluated_animals))

        file_path = report_picker()
        
        if not file_path:
            self.app.main_frame.update_content(ConfirmationMessageWidget, message="No report was selected")
            return
        
        # Load the Excel file
        if file_path.endswith('.xls'):
            df = pd.read_excel(file_path, engine='xlrd')
        else:
            df = pd.read_excel(file_path, engine='openpyxl')

        data = df.to_dict(orient='records')

        for row in data:
            for key, value in list(row.items()):
                if key == "EID":
                    modified_eid = modify_eid(value)
                    row[key] = modified_eid
                    animal_id_info = fetch_animalid_by_eid(self.app.db_connection, modified_eid)
                    if animal_id_info:
                        row["id_animalid"] = animal_id_info
                        process_animal(row)
                    else:
                        row["id_animalid"] = 'not found'

        missing_animals = find_missing_animals(data)
        eval_date = data[0]['Date'].strftime('%Y-%m-%d') if data else None

        if eval_date:
            evaluated_animals = fetch_animalids_by_evaluation_date(self.app.db_connection, eval_date)
            process_next_missing_animal(missing_animals, evaluated_animals)

    def save_csv(self):
        self.search_main_frame_widget.save_csv()
        return

    def save_notes_csv(self):

        ids = self.search_main_frame_widget.get_checked_animal_ids()

        # Open file dialog to select file path for saving the CSV
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if not file_path:  # If the user cancels the file dialog, do nothing
            return

        note_content = list()

        for animal_id in ids:
            notes = fetch_animal_notes(self.app.db_connection, animal_id)
            for row in notes:
                note_content.append(row)

        write_animal_notes(file_path, note_content)

        return

    def save_evaluation_csv(self):

        ids = self.search_main_frame_widget.get_checked_animal_ids()

        # Open file dialog to select file path for saving the CSV
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if not file_path:  # If the user cancels the file dialog, do nothing
            return

        note_content = list()

        for animal_id in ids:
            notes = fetch_animal_notes(self.app.db_connection, animal_id)
            for row in notes:
                note_content.append(row)
        # FIXME
        # write_animal_notes(file_path, note_content)

        return

    def save_animal_id_history(self):
        ids = self.search_main_frame_widget.get_checked_animal_ids()

        # Open file dialog to select file path for saving the CSV
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if not file_path:  # If the user cancels the file dialog, do nothing
            return

        id_history_content = list()

        for animal_id in ids:
            id_history = fetch_animal_id_history(self.app.db_connection, animal_id)
            for row in id_history:
                id_history_content.append(row)

        write_id_history(file_path, id_history_content)

        return

    def save_ods(self):
        self.search_main_frame_widget.save_ods()
        return