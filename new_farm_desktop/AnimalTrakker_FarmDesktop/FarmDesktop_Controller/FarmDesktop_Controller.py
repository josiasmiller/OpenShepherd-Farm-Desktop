from AnimalTrakker_Shared.Shared_BaseController import BaseController
from AnimalTrakker_Shared.Shared_Logging import get_logger

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
            # Here, you can add more specific logic that should happen after an item click
            # For example, updating other UI components, fetching data, etc.
        else:
            # Handle clicks on the empty area of the sidebar, which might be used for deselecting items, etc.
            logger.info("Clicked on empty area - specific to Farm Desktop")
