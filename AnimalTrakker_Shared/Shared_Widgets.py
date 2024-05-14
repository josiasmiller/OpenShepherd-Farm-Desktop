import tkinter as tk
from tkinter import Label
from PIL import Image, ImageTk
from pathlib import Path
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class HomeWidget(tk.Frame):
    """
    A widget that displays the home screen of the application.

    This class is responsible for loading and displaying a logo image and welcoming text on the home screen.

    Attributes:
        parent (tk.Widget): The parent widget, which is typically a frame or another Tkinter container.
        style_manager (StyleManager): The style manager instance that provides style configurations.
    """
    
    def __init__(self, parent, style_manager, **kwargs):
        """
        Initialize the HomeWidget with a parent and a style manager.

        Args:
            parent (tk.Widget): The parent widget.
            style_manager (StyleManager): The style manager to use for retrieving styles.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        # Retrieve the background color for the main frame from the style manager
        bg_color = style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, **kwargs)

        # Load and display the image
        self.load_and_display_image()

        # Display a welcome message
        self.display_welcome_message(bg_color)

    def load_and_display_image(self):
        """
        Loads an image from the specified path and displays it at the given size.

        Args:
            path (Path): The file path of the image to load.
            size (tuple): The desired size of the image as a tuple (width, height).
        """
        # Load and display the logo image
        path = Path(__file__).parent / 'logo.jpg'
        size = (759, 375)
        
        try:
            image = Image.open(path).resize(size, Image.LANCZOS)
            self.home_image = ImageTk.PhotoImage(image)
            image_label = Label(self, image=self.home_image, border=0)
            image_label.pack(pady=40)
        except Exception as e:
            logger.error(f"Failed to load or display image from {path}: {e}")

    def display_welcome_message(self, background_color):
        """
        Displays a welcome message on the widget.

        Args:
            background_color (str): The background color for the label displaying the message.
        """
        label = Label(self, text="Welcome to AnimalTrakker!", bg=background_color)
        label.pack()
