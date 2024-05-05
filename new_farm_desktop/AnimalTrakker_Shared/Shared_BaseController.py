from AnimalTrakker_Shared.Shared_Logging import get_logger
import sys
from AnimalTrakker_Shared.Shared_Database.Shared_Utilities import DatabaseConnection

logger = get_logger(__name__)

class BaseController:
    """
    The base controller for handling generic actions and configurations across different parts of the application.

    This controller defines basic operations and utility actions such as quitting the application and handling
    common click events, which can be extended by subclassing for more specific application needs.

    Attributes:
        config (dict): A dictionary to hold configuration settings for the application, provided during initialization.
    """

    def __init__(self, config=None):
        """
        Initializes the BaseController with a configuration dictionary.

        Args:
            config (dict, optional): Configuration settings for the controller and possibly for the entire application.
                Defaults to an empty dictionary if none is provided.
        """
        # Store configuration settings passed, or use an empty dictionary if none provided.
        self.config = config if config is not None else {}

    def handle_common_click(self, item, item_text):
        """
        Handles click events on common items defined in the application, executing predefined actions based on item identifiers.

        Args:
            item (str): The identifier (iid) of the clicked Treeview item, used to determine the action to be taken.
            item_text (str): The text of the clicked Treeview item, mainly used for logging purposes.
        """
        # Mapping of item identifiers to their corresponding action methods
        common_actions = {
            'quitanimaltrakker': self.quit_application
        }
        
        # Check if the clicked item is one of the common actions and handle accordingly
        if item in common_actions:
            logger.info(f"Common item clicked: {item_text}")
            # Execute the corresponding method based on the item identifier
            common_actions[item]()

    def quit_application(self):
        """
        Quits the application, handling necessary cleanup operations before exiting.
        """
        logger.info("Application quit initiated")
        # Encapsulate cleanup logic in a try-except block to handle exceptions gracefully
        try:
            # Perform any necessary cleanup here such as saving state, closing database connections, etc.
            logger.info("Performing cleanup before quit")
            # Close the database connection safely
            if DatabaseConnection._instance and hasattr(DatabaseConnection._instance, 'connection'):
                DatabaseConnection._instance.close()  # Make sure close method is implemented in DatabaseConnection
        except Exception as e:
            # Log any errors during cleanup
            logger.error(f"Error during application quit: {e}", exc_info=True)
        finally:
            # Exit the application
            sys.exit(0)
