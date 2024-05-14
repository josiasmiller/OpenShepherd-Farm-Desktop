from AnimalTrakker_Shared.Shared_BaseController import BaseController
from AnimalTrakker_Shared.Shared_Logging import get_logger
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Handlers import handle_trait_analysis
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_Widgets import SearchWidget, EvaluationWidget

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
        #self.show_search()
        
    def show_search(self):
        """
        Method to display the search widget in the main frame of the application.
        """
        logger.info("Attempting to display the Search Widget")
        self.app.main_frame.update_content(SearchWidget)
        logger.info("Search Widget display attempted")