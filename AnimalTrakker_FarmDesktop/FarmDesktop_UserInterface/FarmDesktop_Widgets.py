import tkinter as tk
from tkinter import ttk
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class EvaluationWidget(tk.Frame):    
    """
    A widget that displays the home screen of the application.

    This class is responsible for loading and displaying a logo image and welcoming text on the home screen.

    Attributes:
        parent (tk.Widget): The parent widget, which is typically a frame or another Tkinter container.
        style_manager (StyleManager): The style manager instance that provides style configurations.
    """
    
    def __init__(self, parent, style_manager, data, **kwargs):
        """
        Initialize the HomeWidget with a parent and a style manager.

        Args:
            parent (tk.Widget): The parent widget.
            style_manager (StyleManager): The style manager to use for retrieving styles.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        # Retrieve the background color for the main frame from the style manager
        self.style_manager = style_manager
        bg_color = self.style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, **kwargs)

        # Display a welcome message
        self.display_welcome_message(bg_color)
        
        self.search_widget = SearchWidget(self, style_manager)
        self.search_widget.pack(fill="x", expand=False, padx=0, pady=0, side='top')
        
        # Extract data if present
        if data:
            self.display_data(data)
        else:
            logger.error("No data provided for evaluation widget.")

    def display_welcome_message(self, bg_color):
        """
        Displays a welcome message on the widget.

        Args:
            bg_color (str): The background color for the label displaying the message.
        """
        label = tk.Label(self, text="Animal Evaluation History!", bg=bg_color)
        label.pack(pady=(5, 0))  # Additional padding for separation
        
    def display_data(self, data):
        """
        Renders the data passed to the widget on the UI using 'pack' instead of 'grid'.
        """
        traits_score, traits_units, traits_custom, trait_units_combined, units = data

        # Create separate containers for each type of widget
        traits_score_frame = tk.Frame(self, bg=self['bg'])
        traits_units_frame = tk.Frame(self, bg=self['bg'])

        # Position the frames within the EvaluationWidget using pack
        traits_score_frame.pack(fill='x', expand=False, padx=7, pady=5)
        traits_units_frame.pack(fill='x', expand=False, padx=7, pady=5)

        # For traits_score, place each widget in the traits_score_frame using pack
        for i, trait in enumerate(traits_score):
            trait_widget = TraitScoreWidget(traits_score_frame, trait[1], self.style_manager)
            trait_widget.pack(fill='x', expand=True, padx=5, pady=2)
        
        # For traits_units, place each widget in the traits_units_frame using pack
        for i, trait_unit in enumerate(traits_units):
            trait_unit_widget = TraitUnitWidget(traits_units_frame, trait_unit, self.style_manager)
            trait_unit_widget.pack(fill='x', expand=True, padx=5, pady=2)


class SearchWidget(tk.Frame):
    """
    A dedicated widget for performing searches within the application.

    This widget includes a search type dropdown, a text entry for the search term,
    a search button, and a frame to display search results.

    Attributes:
        parent (tk.Widget): The parent widget.
        style_manager (object): A style manager instance for styling the widget.
    """
    def __init__(self, parent, style_manager, **kwargs):
        bg_color = style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, **kwargs)
        self.init_ui()

    def init_ui(self):
        """
        Initializes the user interface components of the SearchWidget.
        Sets up layout configurations and widgets like labels, combobox, entry, and button.
        """
        # Configure layout to distribute space among widgets
        self.columnconfigure(1, weight=2)  # Gives more space to the combobox
        self.columnconfigure(3, weight=2)  # Gives more space to the entry

        # Search Type Dropdown Menu
        self.search_type_label = tk.Label(self, text="Select search type:", bg=self['bg'])
        self.search_type_label.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

        self.search_type_var = tk.StringVar(self)
        self.search_type_combobox = ttk.Combobox(self, textvariable=self.search_type_var, state="readonly", width=20)
        self.search_type_combobox['values'] = ("Name", "Id", "Electronic", "Farm")
        self.search_type_combobox.current(0)
        self.search_type_combobox.grid(row=0, column=1, padx=10, pady=10, sticky="ew")

        # Search String Entry
        self.search_string_label = tk.Label(self, text="Search string:", bg=self['bg'])
        self.search_string_label.grid(row=0, column=2, padx=10, pady=10, sticky="ew")

        self.search_entry = tk.Entry(self, width=20)
        self.search_entry.grid(row=0, column=3, padx=10, pady=10, sticky="ew")

        # Search Button
        self.search_button = tk.Button(self, text="Search", command=self.perform_search)
        self.search_button.grid(row=0, column=4, padx=10, pady=10, sticky="ew")

        # Results Frame
        self.search_results_frame = tk.Frame(self, bg=self['bg'], height=50,
                                            highlightbackground='gray', highlightcolor='white',
                                            highlightthickness=2, borderwidth=0, relief='flat')
        self.search_results_frame.grid(row=1, column=0, columnspan=5, padx=10, pady=10, sticky="ew")
        self.rowconfigure(1, weight=0)  # Allows the results area to expand vertically
        
        self.update_idletasks()
        print("Frame height:", self.search_results_frame.winfo_height())
        print("Parent height:", self.search_results_frame.winfo_width())
        
        self.after(100, self.print_frame_size)

    def print_frame_size(self):
        print("Delayed Frame height:", self.search_results_frame.winfo_height())
        print("Delayed Parent height:", self.winfo_height())


    # !Just a dummy function to show how to perform a search!
    def perform_search(self):
        """
        Triggered by the Search button; performs the search operation.
        Replace this stub with the actual search logic and result display update.
        """
        print("Search initiated!")  # Placeholder for actual search logic
        # Clear previous search results from the results frame
        for widget in self.search_results_frame.winfo_children():
            widget.destroy()

        search_type = self.search_type_var.get()
        search_query = self.search_entry.get()

        # Placeholder for your search function
        search_results = your_search_function(search_type, search_query)

        # Display search results as labels
        for i, result in enumerate(search_results):
            result_label = tk.Label(self.search_results_frame, text=result, anchor="w")
            result_label.pack(fill='x', padx=10, pady=2)

        # Replace `your_search_function` with the actual function that performs the search based on type and query.
        # The function should return a list of strings representing search results.
        
class TraitScoreWidget(tk.Frame):
    def __init__(self, parent, trait_name, style_manager, *args, **kwargs):
        bg_color = style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, *args, **kwargs)
        self.trait_name = trait_name
        self.rating = tk.IntVar(value=0)

        self.grid_columnconfigure(0, weight=1, minsize=250)  # Allocate equal weight
        self.grid_columnconfigure(1, weight=1)  # Allocate equal weight

        self.build_widget()

    def build_widget(self):
        lable = tk.Label(self, text=self.trait_name, font=('Helvetica', 10, 'bold'), bg=self['bg'])
        lable.grid(row=0, column=0, sticky="nsew")

        self.stars_frame = tk.Frame(self)
        self.stars_frame.grid(row=0, column=1, sticky="nsew")  # Use grid for positioning
        
        # Initialize the list to store star button references
        self.star_buttons = []

        for i in range(5):  # 1 to 5 stars
            self.stars_frame.grid_columnconfigure(i, weight=1)
            star = tk.Button(self.stars_frame,
                     text='☆',
                     command=lambda i=i: self.set_rating(i),
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
    def __init__(self, parent, trait_data, style_manager, *args, **kwargs):
        bg_color = style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, *args, **kwargs)
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
        self.trait_label = tk.Label(self, text=self.trait_name, font=('Helvetica', 10, 'bold'), bg=self['bg'])
        self.trait_label.grid(row=0, column=0, sticky="nsew", columnspan=1)  # Spanning two columns for 1/3 space

        self.input_label = tk.Label(self, text="Input:", bg=self['bg'])
        self.input_label.grid(row=0, column=1, sticky="nsew")

        self.value_entry = tk.Entry(self)
        self.value_entry.grid(row=0, column=2, sticky="nsew")

        self.units_label = tk.Label(self, text="     Units:", bg=self['bg'])
        self.units_label.grid(row=0, column=3, sticky="nsew")

        self.unit_combobox = ttk.Combobox(self, textvariable=tk.StringVar(), values=self.unit_options, state="readonly", width=15)
        self.unit_combobox.current(0)
        self.unit_combobox.grid(row=0, column=4, sticky="nsew", columnspan=3)  # Spanning two columns if needed for 1/3 space

    def get_selected_unit(self):
        return self.unit_var.get()