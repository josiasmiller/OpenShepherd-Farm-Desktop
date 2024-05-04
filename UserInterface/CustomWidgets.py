import tkinter as tk
from tkinter import ttk

import customtkinter as ctk

class TraitScoreWidget(tk.Frame):
    def __init__(self, parent, trait_name, *args, **kwargs):
        super().__init__(parent, *args, **kwargs)
        self.trait_name = trait_name
        self.rating = tk.IntVar(value=0)

        self.grid_columnconfigure(0, weight=1, minsize=250)  # Allocate equal weight
        self.grid_columnconfigure(1, weight=1)  # Allocate equal weight

        self.build_widget()

    def build_widget(self):
        lable = tk.Label(self, text=self.trait_name, font=('Helvetica', 10, 'bold'), background="white")
        lable.grid(row=0, column=0, sticky="nsew")

        self.stars_frame = tk.Frame(self, background="white")
        self.stars_frame.grid(row=0, column=1, sticky="nsew")  # Use grid for positioning
        
        # Initialize the list to store star button references
        self.star_buttons = []

        for i in range(5):  # 1 to 5 stars
            self.stars_frame.grid_columnconfigure(i, weight=1)
            star = ctk.CTkButton(self.stars_frame,
                     text='☆',
                     command=lambda i=i: self.set_rating(i),
                     bg_color="white",  # Set the background color
                     fg_color="white",  # Set the foreground color (optional, for the button's face color)
                     hover_color="lightgray",  # Color when the mouse hovers over (optional)
                     text_color="black",  # Set the text color
                     corner_radius=10,
                     width=50)  # Rounded corners (optional, for a modern look)
            star.grid(row=0, column=i, sticky="nsew")  # Packing stars side by side within their frame
            self.star_buttons.append(star)  # Store the reference to the button

    def set_rating(self, rating):
        print(f"Setting rating for {self.trait_name}: {rating}")  # Debug print
        self.rating.set(rating)
        for i, star in enumerate(self.star_buttons, start=0):
            star.configure(text='★') if i <= rating else star.configure(text='☆')

    def get_rating(self):
        return self.rating.get()


class TraitUnitWidget(tk.Frame):
    def __init__(self, parent, trait_data, *args, **kwargs):
        super().__init__(parent, *args, **kwargs)
        self.trait_name = trait_data[0]
        self.unit_options = [unit[0] for unit in trait_data[1]]

        # Configuring column weights for proportionate division
        self.grid_columnconfigure(0, weight=1, minsize=250)  # Trait name, 1/3 of the space
        self.grid_columnconfigure(1, weight=1)  # Input label, part of 1/3 of the space
        self.grid_columnconfigure(2, weight=1)  # Input field, part of 1/3 of the space
        self.grid_columnconfigure(3, weight=1)  # Unit label, part of 1/3 of the space
        self.grid_columnconfigure(4, weight=1)  # Combobox, part of 1/3 of the space

        self.build_widget()

    def build_widget(self):
        # Use grid for all internal widget placements and sticky="nsew" for expansion
        self.trait_label = tk.Label(self, text=self.trait_name, font=('Helvetica', 10, 'bold'), background="white")
        self.trait_label.grid(row=0, column=0, sticky="nsew", columnspan=2)  # Spanning two columns for 1/3 space

        self.input_label = tk.Label(self, text="Input:", background="white")
        self.input_label.grid(row=0, column=2, sticky="nsew")

        self.value_entry = tk.Entry(self)
        self.value_entry.grid(row=0, column=3, sticky="nsew")

        self.units_label = tk.Label(self, text="     Units:", background="white")
        self.units_label.grid(row=0, column=4, sticky="nsew")

        self.unit_combobox = ttk.Combobox(self, textvariable=tk.StringVar(), values=self.unit_options, state="readonly", width=15)
        self.unit_combobox.current(0)
        self.unit_combobox.grid(row=0, column=5, sticky="nsew", columnspan=2)  # Spanning two columns if needed for 1/3 space

    def get_selected_unit(self):
        return self.unit_var.get()

