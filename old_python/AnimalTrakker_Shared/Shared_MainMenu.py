import tkinter as tk
from AnimalTrakker_Shared.Shared_Logging import get_logger
from AnimalTrakker_Shared.Shared_Database.Shared_Utilities import file_picker

logger = get_logger(__name__)

class MainMenu(tk.Menu):
    def __init__(self, parent, app_instance, controller, **kwargs):
        """
        Initialize the MainMenu with a parent tk.Menu widget.

        Args:
            parent (tk.Tk): The parent window for this menu.
            **kwargs: Arbitrary keyword arguments passed to the tk.Menu constructor.
        """
        super().__init__(parent, **kwargs)
        self.parent = parent
        self.app_instance = app_instance
        self.controller = controller  # Store the controller instance
        self.init_ui()

    def init_ui(self):
        """
        Initializes the user interface components of the menu.
        """
        # Create and configure the File menu
        file_menu = tk.Menu(self, tearoff=0)
        file_menu.add_command(label="Open Database", command=self.on_open)
        file_menu.add_command(label="Save", command=self.on_save)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.on_exit)

        # Create and configure the Edit menu
        edit_menu = tk.Menu(self, tearoff=0)
        edit_menu.add_command(label="Undo", command=self.on_undo)
        edit_menu.add_command(label="Redo", command=self.on_redo)

        # Create and configure the Help menu
        help_menu = tk.Menu(self, tearoff=0)
        help_menu.add_command(label="About", command=self.on_about)
        help_menu.add_command(label="Help", command=self.on_help)

        # Add menus to the menu bar
        self.add_cascade(label="File", menu=file_menu)
        self.add_cascade(label="Edit", menu=edit_menu)
        self.add_cascade(label="Help", menu=help_menu)

    def on_open(self):
        """
        Handles the "Open Database" action from the File menu by opening a file picker dialog,
        updating the application's database connection, and refreshing the GUI.
        """
        logger.info("Open Database menu item clicked")
        file_path = file_picker()  # Call the file picker function to get a new database path

        try:
            # Update the database connection in the application GUI instance
            self.app_instance.update_database(file_path)
            # Optionally refresh the sidebar or other components that depend on the database
            self.app_instance.refresh_gui_data()
        except Exception as e:
            logger.error(f"Database wasn't reopened: {e}")


    def on_save(self):
        logger.info("Save menu item clicked")

    def on_exit(self):
        """
        Handles the 'Exit' action from the menu.

        This method is triggered when the 'Exit' option in the menu is selected. It logs the action
        and delegates the task of quitting the application to the 'quit_application' method of the
        BaseController. This ensures that any necessary cleanup and shutdown procedures are
        performed properly before the application exits.

        The 'quit_application' method encapsulates all the necessary steps to safely terminate the
        application, including saving state, closing database connections, and releasing assets.
        """
        logger.info("Exit menu item clicked")
        # Call the quit_application method from the BaseController to handle the exit
        self.controller.quit_application()

    def on_undo(self):
        logger.info("Undo menu item clicked")

    def on_redo(self):
        logger.info("Redo menu item clicked")

    def on_about(self):
        logger.info("About menu item clicked")

    def on_help(self):
        logger.info("Help menu item clicked")
