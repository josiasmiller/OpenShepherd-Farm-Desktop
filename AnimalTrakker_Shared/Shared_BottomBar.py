import tkinter as tk
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class BottomBar(tk.Frame):
    """
    A bottom bar GUI component that displays application status or information.
    Currently configured to show the current database path being used.
    """
    def __init__(self, parent, currentdatabase, bg='default', **kwargs):
        """
        Initializes the BottomBar with the current database path displayed.

        Args:
            parent (tk.Widget): The parent widget, typically a Tk.Frame or Tk.Tk instance.
            currentdatabase (str): The path to the currently used database, displayed in the bar.
        """
        super().__init__(parent, bg=bg, **kwargs)

        # Create and pack a label to display the current database path
        # Use the parent's background color if not specified
        self.db_label = tk.Label(self, text=f"Current DB: {currentdatabase}", bg=bg)
        self.db_label.pack(side='left') # Align the label to the left
        
    def update_database_path(self, new_db_path):
        """
        Updates the text of the label to reflect a new database path.

        Args:
            new_db_path (str): The new path to the database to display.
        """
        self.db_label.config(text=f"Current DB: {new_db_path}")
        
        logger.info(f"Database path in BottomBar updated to: {new_db_path}")
        