import tkinter as tk
from AnimalTrakker_Shared.Shared_Widgets import HomeWidget 
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class MainFrame(tk.Frame):
    """
    A frame that manages the main content area of the application.

    This class is responsible for displaying different widgets in the main area of the application,
    depending on user actions and navigation events.

    Attributes:
        parent (tk.Widget): The parent widget.
        style_manager (StyleManager): A reference to the style manager that provides styling configurations.
    """
    def __init__(self, parent, style_manager, **kwargs):
        """
        Initialize the MainFrame with a parent and a style manager.

        The HomeWidget is loaded by default upon initialization.

        Args:
            parent (tk.Widget): The parent widget.
            style_manager (StyleManager): The style manager to use for retrieving and applying styles.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        super().__init__(parent, **kwargs)
        self.style_manager = style_manager
        self.current_widget = None
        self.load_initial_widget()

    def load_initial_widget(self):
        """
        Loads the initial widget, which is the HomeWidget, into the MainFrame.
        """
        self.update_content(HomeWidget)

    def update_content(self, widget_class, *args, **kwargs):
        """
        Updates the content of the MainFrame with a new widget.

        Args:
            widget_class (class): The widget class to instantiate and display.
            *args: Positional arguments to pass to the widget class constructor.
            **kwargs: Keyword arguments to pass to the widget class constructor.
        """
        logger.info(f"Updating content to {widget_class.__name__}")
        self.clear_mainframe()
        
        # Extract data if it's passed as keyword argument and remove it from kwargs
        data = kwargs.pop('data', None)  
        
        # Now kwargs should only contain args suitable for tkinter Frame
        try:
            self.current_widget = widget_class(self, style_manager=self.style_manager, data=data, **kwargs)
            self.current_widget.pack(fill=tk.BOTH, expand=True)
            logger.info(f"Widget {widget_class.__name__} added and packed.")
        except Exception as e:
            logger.error(f"Failed to initialize or pack widget {widget_class.__name__}: {str(e)}")

    def clear_mainframe(self):
        """
        Clears all widgets from the MainFrame.

        This method destroys all child widgets and resets the current widget reference.
        """
        for widget in self.winfo_children():
            widget.destroy()
        self.current_widget = None
