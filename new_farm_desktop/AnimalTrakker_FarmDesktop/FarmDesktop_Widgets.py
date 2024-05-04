import tkinter as tk
import customtkinter as ctk

class TraitScoreWidget(tk.Frame):
    """
    A custom widget to rate traits using a star system.

    Inherits from tk.Frame and utilizes a grid layout to display a label and a row of stars
    that can be interactively clicked to set a rating for a particular trait.

    Attributes:
        trait_name (str): Name of the trait to be rated.
        rating (tk.IntVar): Variable to store the current rating.
        star_buttons (list): List of button widgets representing the stars.
    """
    def __init__(self, parent, trait_name, *args, **kwargs):
        """
        Initialize the TraitScoreWidget with a given parent widget and trait name.

        Args:
            parent (tk.Widget): The parent widget.
            trait_name (str): The name of the trait to be rated.
            *args, **kwargs: Additional arguments passed to the tk.Frame constructor.
        """
        super().__init__(parent, *args, **kwargs)
        self.trait_name = trait_name
        self.rating = tk.IntVar(value=0)

        # Configure the grid layout for the frame
        self.grid_columnconfigure(0, weight=1, minsize=250)
        self.grid_columnconfigure(1, weight=1)

        # Build the widget components
        self.build_widget()

    def build_widget(self):
        """
        Constructs the widget components including the label and stars.
        """
        # Create and place the label
        label = tk.Label(self, text=self.trait_name, font=('Helvetica', 10, 'bold'), background="white")
        label.grid(row=0, column=0, sticky="nsew")

        # Create and place the frame to hold star buttons
        self.stars_frame = tk.Frame(self, background="white")
        self.stars_frame.grid(row=0, column=1, sticky="nsew")

        self.star_buttons = []
        for i in range(5):  # Add five star buttons
            self.stars_frame.grid_columnconfigure(i, weight=1)
            star = ctk.CTkButton(self.stars_frame,
                                 text='☆',
                                 command=lambda i=i: self.set_rating(i + 1),
                                 bg_color="white",
                                 fg_color="white",
                                 hover_color="lightgray",
                                 text_color="black",
                                 corner_radius=10,
                                 width=50)
            star.grid(row=0, column=i, sticky="nsew")
            self.star_buttons.append(star)

    def set_rating(self, rating):
        """
        Set the current rating and update the display of star buttons.

        Args:
            rating (int): The rating to set, expected range is 1-5.
        """
        self.rating.set(rating)
        for i, star in enumerate(self.star_buttons):
            star.configure(text='★' if i < rating else '☆')

    def get_rating(self):
        """
        Returns the current rating value.

        Returns:
            int: The current rating stored in the rating variable.
        """
        return self.rating.get()
