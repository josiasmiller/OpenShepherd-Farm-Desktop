import tkinter as tk
from AnimalTrakker_Shared.Shared_MainMenu import MainMenu
from AnimalTrakker_Shared.Shared_Logging import animaltrakker_setup_logging, get_logger
from AnimalTrakker_Shared.Shared_Database.Shared_Utilities import DatabaseConnection, file_picker, InitialPage

from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_GUI import FarmDesktopGUI
from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import fetch_evaluation_history
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_LeftSidebar import farm_desktop_left_sidebar
from AnimalTrakker_FarmDesktop.FarmDesktop_Controller.FarmDesktop_Controller import FarmDesktopController

logger = get_logger(__name__)

def main():
    """
    Main entry point of the AnimalTrakker application.

    Initializes the application, sets up the main window and its components, and enters the main event loop.
    This includes setting up logging, picking the database, fetching necessary data, and initializing
    the GUI with all its components like sidebar, menu, and controllers.
    """
    initial_page = InitialPage(run_main_app)
    initial_page.mainloop()


def run_main_app(database_path: str, default_settings_pk: int):
    # Set up the main application window
    root = tk.Tk()
    root.title("AnimalTrakker")
    root.geometry("1126x844")  # Configure the initial size of the window
    animaltrakker_setup_logging()  # Initialize the logging system for the application

    # Initialize the controller for handling application logic
    controller = FarmDesktopController()

    # Initialize the database connection
    db_connection = DatabaseConnection(database_path)

    # Fetch historical data for the sidebar from the selected database
    evaluation_history = fetch_evaluation_history(db_connection)
    tree_data = farm_desktop_left_sidebar(evaluation_history=evaluation_history)

    logger.info("App started successfully")

    # Set up the main graphical interface for the application
    app = FarmDesktopGUI(root, sidebar_title="AnimalTrakker - Farm Desktop", tree_structure=tree_data, controller=controller, currentdatabase=database_path, db_connection=db_connection)

    # Passing the instance of the app to the controller
    controller.initialize_gui_reference(app)

    # Set up the main menu of the application
    main_menu = MainMenu(root, app_instance=app, controller=controller)
    root.config(menu=main_menu)

    # Enter the main event loop to handle user interactions
    root.mainloop()


if __name__ == "__main__":
    main()
