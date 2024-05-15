import tkinter as tk
from tkinter import ttk

class StyleManager:
    """
    Manages the styles for the Tkinter GUI components, ensuring consistency and ease of theme adjustments.

    This class encapsulates the configuration of styles and colors used across the GUI components
    of the application. It utilizes Tkinter's themed widget (ttk) library to apply uniform styles
    across different widget types.

    Attributes:
        style (ttk.Style): The Style object used to configure and manage widget styles.
    """
    def __init__(self, theme='clam'):
        """
        Initializes the StyleManager with a specified theme.

        Args:
            theme (str): The name of the theme to use for styling ttk widgets. Defaults to 'clam' which is
                         more flexible and customizable compared to the default theme.
        """
        self.style = ttk.Style()
        self.style.theme_use(theme)  # Sets the theme for styling
        self.configure_styles()
    
    def configure_styles(self):
        """
        Configures the styles for various ttk widgets according to the application's design requirements.
        This method sets up the colors and other style parameters for frames, treeviews, and potentially other widgets.
        """
        # Define colors
        self.bg_main_frame = 'lightyellow'
        self.bg_sidebar = 'lightblue'
        self.bg_top_bar = 'lightgreen'
        self.bg_bottom_bar = 'lightpink'

        # Configure specific Treeview widget styles, including selection and field backgrounds
        self.style.configure("Treeview", background=self.bg_sidebar, fieldbackground=self.bg_sidebar, 
                             foreground="black", rowheight=25)
        
        # Modify the Treeview layout to remove borders around the tree area
        self.style.layout("Treeview", [('Treeview.treearea', {'sticky': 'nswe'})])
        
        self.style.map("Treeview", background=[('selected', 'green')])

    def get_bg(self, component_name):
        """
        Retrieves the background color for a specified component by name.

        Args:
            component_name (str): The name of the component as defined in the style settings.

        Returns:
            str: The color code for the component's background. Returns 'white' if the component name is not found.
        """
        return getattr(self, f'bg_{component_name}', 'white')