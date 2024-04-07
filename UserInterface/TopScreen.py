import tkinter as tk
from tkinter import ttk
from Utilities.GeneralUtilities import GoHome


class TopScreen(tk.Frame):
    """TopScreen class serves as the base class for the top part of the application.

    It includes common elements that are shared across different top screens within the application. Currently, it primarily features a 'Go Home' button intended for navigation.

    Attributes:
        parent: The parent widget for this frame.
        name (str): A name for the screen, useful for identification and debugging.
    """
    def __init__(self, parent):
        super().__init__(parent, bg='lightblue')  # Temporary background color for visibility
        self.name = "TopScreen"
        self.parent = parent
        self.initialize_ui()

    def initialize_ui(self):
        """Initializes the UI components of the TopScreen, including the 'Go Home' button."""
        self.configure_layout()
        self.add_go_home_button()

    def configure_layout(self):
        """Configures the layout of the TopScreen. Can be extended for additional layout configurations."""
        self.grid(row=0, column=0, sticky="ew")
        self.grid_columnconfigure(0, weight=1)

    def add_go_home_button(self):
        """Adds the 'Go Home' button to the TopScreen."""
        self.leftsidebar = tk.Frame(self, borderwidth=2, relief="raised", width=200, bg="yellow")  # Distinct color
        self.leftsidebar.pack(side="left", fill="y")  # Adjusted for visibility
        self.gohome = ttk.Button(self.leftsidebar, text="Home", command=self.go_home)
        self.gohome.pack(pady=10)  # Ensure it's packed within leftsidebar

    def go_home(self):
        """Calls the GoHome function when the 'Go Home' button is clicked."""
        GoHome()

