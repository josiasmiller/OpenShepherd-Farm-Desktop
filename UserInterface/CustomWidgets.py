import tkinter as tk
from tkinter import ttk

class TraitScoreWidget(tk.Frame):
    def __init__(self, parent, trait_name, *args, **kwargs):
        super().__init__(parent, *args, **kwargs)
        self.trait_name = trait_name
        self.rating = tk.IntVar(value=0)

        self.build_widget()

    def build_widget(self):
        tk.Label(self, text=self.trait_name).pack(side=tk.LEFT)

        self.stars_frame = tk.Frame(self)
        self.stars_frame.pack(side=tk.LEFT)

        self.stars = []
        for i in range(1, 6):  # 1 to 5 stars
            star = ttk.Button(self.stars_frame, text='☆', command=lambda i=i: self.set_rating(i))
            star.pack(side=tk.LEFT)
            self.stars.append(star)

    def set_rating(self, rating):
        self.rating.set(rating)
        for i, star in enumerate(self.stars, start=1):
            star['text'] = '★' if i <= rating else '☆'

    def get_rating(self):
        return self.rating.get()


class TraitUnitWidget(tk.Frame):
    def __init__(self, parent, trait_data, *args, **kwargs):
        super().__init__(parent, *args, **kwargs)
        self.trait_name = trait_data[0]
        self.unit_options = [unit[0] for unit in trait_data[1]]  # Unpack unit options from tuples

        # Configure column widths
        self.grid_columnconfigure(0, weight=3)  # Allocate more weight to trait name for longer names
        self.grid_columnconfigure(1, weight=1)  # Label "Input"
        self.grid_columnconfigure(2, weight=2)  # For input field
        self.grid_columnconfigure(3, weight=1)  # Label "Units"
        self.grid_columnconfigure(4, weight=2)  # For combobox

        self.build_widget()

    def build_widget(self):
        # Trait name, bold
        self.trait_label = tk.Label(self, text=self.trait_name, font=('Helvetica', 10, 'bold'))
        self.trait_label.grid(row=0, column=0, sticky="w")

        # Label "Input"
        self.input_label = tk.Label(self, text="Input:")
        self.input_label.grid(row=0, column=1, sticky="w")

        # Integer input field
        self.value_entry = tk.Entry(self)
        self.value_entry.grid(row=0, column=2, sticky="ew")

        # Label "Units"
        self.units_label = tk.Label(self, text="Units:")
        self.units_label.grid(row=0, column=3, sticky="w")

        # Combobox filled with unit options
        self.unit_var = tk.StringVar()
        self.unit_combobox = ttk.Combobox(self, textvariable=self.unit_var, values=self.unit_options, state="readonly", width=15)
        self.unit_combobox.current(0)  # Default to the first unit option
        self.unit_combobox.grid(row=0, column=4, sticky="ew")

    def get_selected_unit(self):
        return self.unit_var.get()

