import tkinter as tk
from AnimalTrakker_Shared.Shared_BaseGUI import BaseGUI  # Import BaseGUI from its module

from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import fetch_evaluation_history
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_LeftSidebar import farm_desktop_left_sidebar
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_MainFrame import FarmDesktopMainFrame

from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class FarmDesktopGUI(BaseGUI):
    """
    Extends the BaseGUI to provide functionalities specific to the FarmDesktop application,
    including methods to refresh data dynamically within the application's GUI.
    """
    
    def __init__(self, parent, sidebar_title, tree_structure, controller, currentdatabase, **kwargs):
        super().__init__(parent, sidebar_title, tree_structure, controller, currentdatabase, **kwargs)
        logger.info("FarmDesktop_GUI initialized")

    def refresh_gui_data(self):
        """
        Refreshes the GUI components such as the sidebar with updated data.
        This method can be triggered from various points within the application.
        """

        try:
            # Assume fetch_evaluation_history and farm_desktop_left_sidebar are imported and available
            evaluation_history = fetch_evaluation_history(self.db_connection)

            tree_data = farm_desktop_left_sidebar(evaluation_history=evaluation_history)

            self.left_sidebar.update_treeview(tree_data)
            
            logger.info("GUI refreshed successfully")
        except Exception as e:
            logger.error(f"Error refreshing GUI: {e}")
