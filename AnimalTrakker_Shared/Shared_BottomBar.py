import tkinter as tk
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class BottomBar(tk.Frame):
    """
    A bottom bar GUI component that displays application status or information.
    Currently configured to show the current database path being used.
    """
    def __init__(self, parent, currentdatabase, current_setting=None, bg='default', **kwargs):
        """
        Initializes the BottomBar with the current database path displayed.

        Args:
            parent (tk.Widget): The parent widget, typically a Tk.Frame or Tk.Tk instance.
            currentdatabase (str): The path to the currently used database, displayed in the bar.
        """
        super().__init__(parent, bg=bg, **kwargs)

       # Create and pack a label to display the current database path
        self.db_label = tk.Label(self, text=f"Current DB: {currentdatabase}", bg=bg)
        self.db_label.grid(row=0, column=0, sticky="w", padx=5)
        
        # Create and pack a label to display the current default setting
        self.setting_label = tk.Label(self, text=f"Current Setting: {current_setting}", bg=bg)
        self.setting_label.grid(row=1, column=0, sticky="w", padx=5)
        
    def update_database_path(self, new_db_path):
        """
        Updates the text of the label to reflect a new database path.

        Args:
            new_db_path (str): The new path to the database to display.
        """
        self.db_label.config(text=f"Current DB: {new_db_path}")
        
        logger.info(f"Database path in BottomBar updated to: {new_db_path}")
    
    def update_current_setting(self, new_setting):
        """
        Updates the text of the label to reflect the current default setting.

        Args:
            new_setting (str): The new default setting to display.
        """
        self.setting_label.config(text=f"Current Setting: {new_setting}")
        logger.info(f"Current setting in BottomBar updated to: {new_setting}")