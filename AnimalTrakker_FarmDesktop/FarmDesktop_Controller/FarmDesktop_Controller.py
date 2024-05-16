from AnimalTrakker_Shared.Shared_BaseController import BaseController
from AnimalTrakker_Shared.Shared_Widgets import HomeWidget, ConfirmationMessageWidget
from AnimalTrakker_Shared.Shared_Logging import get_logger

from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import *
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Handlers import handle_trait_analysis
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_Widgets import EvaluationWidget, EditSettingWidget, LeftSidebarChoiceWidget, CreateNewSettingWidget
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import *

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
                self.set_defaults()
            if item_text == 'Set Current Evaluation':
                self.set_evaluation()

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
        
    def set_defaults(self):
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
                self.app.main_frame.update_content(CreateNewSettingWidget, controller=self)
            else:
                if edit:
                    setting_details = fetch_setting_details(self.app.db_connection, setting_name=choice)
                    if setting_details:
                        self.app.main_frame.update_content(EditSettingWidget, setting_details=setting_details, controller=self, db_connection=self.app.db_connection)
                else:
                    self.app.current_default_setting = choice
                    self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"{choice} has been chosen as the default setting.")
                    self.app.bottom_bar.update_current_setting(choice)
        elif choice_type == "evaluation":
            if choice == 'Create New':
                pass
                self.app.main_frame.update_content(CreateNewEvaluationWidget, controller=self)
            else:
                if edit:
                    pass
                    evaluation_details = fetch_evaluation_details(self.app.db_connection, evaluation_name=choice)
                    if evaluation_details:
                        self.app.main_frame.update_content(EditEvaluationWidget, evaluation_details=evaluation_details, controller=self, db_connection=self.app.db_connection)
                else:
                    pass
                    self.app.current_evaluation = choice
                    self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"{choice} has been chosen as the evaluation.")
                    self.app.bottom_bar.update_current_evaluation(choice)
                
    def save_edited_setting(self, updated_details):
        logger.info("Farm Desktop Controller: Save button clicked")
        save_setting_changes(self.app.db_connection, updated_details)
        
    def confirm_new_setting_creation(self, new_setting_name):
        """
        Handle the confirmation of a new setting creation.

        Args:
            new_setting_name (str): The name of the new setting.
        """
        logger.info(f'New setting created with name: {new_setting_name}')
        save_new_setting(self.app.db_connection, new_setting_name)
        self.app.main_frame.update_content(ConfirmationMessageWidget, message=f"New setting '{new_setting_name}' has been created.")
        self.choose_general_defaluts()
        
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
