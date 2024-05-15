import tkinter as tk
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class TopBar(tk.Frame):
    """
    TopBar is a custom tkinter Frame that contains navigation buttons like 'Home' and 'Quit',
    facilitating basic navigation and application control within the GUI.

    Attributes:
        parent (tk.Widget): The parent widget, typically a main application window.
        controller (object): The controller that handles logic for user interactions.
    """

    def __init__(self, parent, controller, **kwargs):
        """
        Initializes the TopBar with a parent and a controller.

        Args:
            parent (tk.Widget): The parent widget.
            controller (object): The controller handling the interactions.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        super().__init__(parent, **kwargs)
        self.controller = controller
        self.init_ui()

    def init_ui(self):
        """
        Initializes the user interface of the TopBar.

        This method sets up the buttons ('Home' and 'Quit') and their layouts within the TopBar.
        """
        # Home button
        self.home_button = tk.Button(self, text="Home", command=self.on_home_click)
        self.home_button.pack(side=tk.LEFT, padx=10, pady=10)

        # Quit button
        self.quit_button = tk.Button(self, text="Quit", command=self.on_quit_click)
        self.quit_button.pack(side=tk.LEFT, padx=10, pady=10)

    def on_home_click(self):
        """
        Handles the 'Home' button click event.

        Logs the event and triggers the go_home method on the controller.
        """
        logger.info("Home button clicked")
        self.controller.go_home()

    def on_quit_click(self):
        """
        Handles the 'Quit' button click event.

        Logs the event and triggers the quit_application method on the controller.
        """
        logger.info("TopBar quit button clicked")
        self.controller.quit_application()
