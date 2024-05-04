import tkinter as tk
from AnimalTrakker_Shared.Shared_TopBar import TopBar
from AnimalTrakker_Shared.Shared_LeftSidebar import LeftSidebar
from AnimalTrakker_Shared.Shared_MainFrame import MainFrame
from AnimalTrakker_Shared.Shared_BottomBar import BottomBar
from AnimalTrakker_Shared.Shared_Logging import get_logger
from AnimalTrakker_Shared.Shared_Database.Shared_Utilities import DatabaseConnection

logger = get_logger(__name__)

class BaseGUI(tk.Frame):
    """
    The main GUI frame for the application, organizing and managing all major GUI components
    like the top bar, left sidebar, main frame, and bottom bar.

    Attributes:
        parent (tk.Tk): The parent Tkinter window.
        sidebar_title (str): Title for the sidebar.
        tree_structure (dict): The hierarchical structure data for the sidebar.
        controller (object): The controller that handles interactions.
        currentdatabase (str): The path to the currently used database.
    """
    
    def __init__(self, parent, sidebar_title, tree_structure, controller, currentdatabase, db_connection, **kwargs):
        """
        Initializes the BaseGUI class with all necessary components and layout configurations.

        Args:
            parent (tk.Widget): The parent widget, typically a Tk instance, to which this Frame belongs.
            sidebar_title (str): The title to display at the top of the LeftSidebar.
            tree_structure (dict): A structure representing the items and hierarchy for the LeftSidebar.
            controller (object): The application's controller that handles user interactions.
            currentdatabase (str): Database file path used for data operations within the application.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        super().__init__(parent, **kwargs)
        self.pack(expand=True, fill='both')
        self.currentdatabase = currentdatabase
        self.db_connection = db_connection
        self.controller = controller

        # Create a container frame for the TopBar and LeftSidebar to keep the UI organized.
        self.left_panel = tk.Frame(self)
        self.left_panel.pack(side='left', fill='both', expand=True)

        # Initialize and pack the TopBar with specified background color and height.
        self.top_bar = TopBar(self.left_panel, bg='lightblue', height=100)
        self.top_bar.pack(fill='x')

        # Initialize and pack the LeftSidebar with configurations for background color and width.
        self.left_sidebar = LeftSidebar(self.left_panel, sidebar_title=sidebar_title, tree_structure=tree_structure, controller=controller, bg='lightgreen', width=200)
        self.left_sidebar.pack(fill='both', expand=True)

        # Initialize the main content frame and bottom bar with specified colors and packing settings.
        self.main_frame = MainFrame(self, bg='lightpink')
        
        # Initialize the bottom bar with specified background color and passing current database path
        self.bottom_bar = BottomBar(self, bg='lightblue', height=25, currentdatabase=self.currentdatabase)

        # Call to layout the components correctly in the frame.
        self.layout_components()
        
        logger.info("BaseGUI initialized")

    def layout_components(self):
        """
        Arranges the sub-components within the BaseGUI using grid layout manager.
        This method ensures that the components are properly aligned and scaled according to the application window size.
        """
        # Position the left panel on the grid.
        self.left_panel.grid(row=0, column=0, sticky="ns")
        # Position the MainFrame to fill the space beside the left panel.
        self.main_frame.grid(row=0, column=1, sticky="nsew")
        # Position the BottomBar at the bottom spanning across both columns.
        self.bottom_bar.grid(row=1, column=0, columnspan=2, sticky="ew")

        # Configure grid weights to make the main frame expand with the window.
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

    def update_database(self, new_db_path):
        """
        Updates the database connection using the new database path.

        Args:
            new_db_path (str): The path to the new database file.
        """
        logger.info(f"Updating database connection to {new_db_path}")
        self.currentdatabase = new_db_path
        self.db_connection.update_connection(new_db_path)
        
        # Update the BottomBar with new database path
        self.bottom_bar.update_database_path(new_db_path)  