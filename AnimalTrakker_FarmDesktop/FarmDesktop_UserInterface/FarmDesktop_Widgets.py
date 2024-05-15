import tkinter as tk
from tkinter import ttk, messagebox
from AnimalTrakker_Shared.Shared_Logging import get_logger

from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Database_Utilities import *

logger = get_logger(__name__)

class EvaluationWidget(tk.Frame):    
    """
    A widget that displays Evaluation information.

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

class DefaultSettingChoiceWidget(tk.Frame):
    def __init__(self, parent, choices, controller, style_manager, **kwargs):
        # Get the background color from the style manager
        bg_color = style_manager.get_bg('sidebar')
        super().__init__(parent, bg=bg_color, **kwargs)
        logger.info(f"DefaultSettingChoiceWidget initialized with choices: {choices}")
        self.controller = controller
        self.style_manager = style_manager
        
        self.choice_var = tk.StringVar(self)
        
        # Configuring column weights for proportionate division
        self.grid_columnconfigure(0, weight=1)
        
        # Label with style
        self.label = tk.Label(self, text="Select a default setting:", bg=bg_color)
        self.label.grid(row=0, column=0, pady=5, sticky="nsew")
        
        # Combobox with style
        print(choices)
        self.combobox = ttk.Combobox(self, textvariable=self.choice_var, values=choices, state="readonly")
        self.combobox.grid(row=1, column=0, padx=5, pady=5, sticky="nsew")
        self.combobox.current(0)
        
        # Confirm button with style
        self.confirm_button = tk.Button(self, text="Confirm", command=self.confirm_choice)
        self.confirm_button.grid(row=2, column=0, padx=5, pady=5, sticky="nsew")
        
        # Edit button
        self.create_new_button = tk.Button(self, text="Edit", command=self.edit_choice)
        self.create_new_button.grid(row=3, column=0, padx=5, pady=5, sticky="nsew")
        
        # Create New button with style
        self.create_new_button = tk.Button(self, text="Create New", command=self.create_new_choice)
        self.create_new_button.grid(row=4, column=0, padx=5, pady=5, sticky="nsew")

    def confirm_choice(self):
        choice = self.choice_var.get()
        logger.info('Confirm default setting button was clicked')
        self.controller.load_setting(choice)
        
    def create_new_choice(self):
        logger.info('Create New default setting button was clicked')
        #self.controller.load_default_setting('Create New')
                
    def edit_choice(self):
        logger.info('Edit setting button was clicked')
        choice = self.choice_var.get()
        self.controller.load_setting(choice, edit=True)

class EditSettingWidget(tk.Frame):
    """
    A widget for editing settings.

    This widget displays setting details in entry fields that can be edited and saved.

    Attributes:
        parent (tk.Widget): The parent widget.
        setting_details (dict): A dictionary containing the setting details.
        style_manager (StyleManager): An instance of StyleManager for styling.
        controller (object): The controller handling the save logic.
        db_connection (DatabaseConnection): The database connection instance.
    """
    def __init__(self, parent, setting_details, style_manager, controller, db_connection, **kwargs):
        """
        Initialize the EditSettingWidget.

        Args:
            parent (tk.Widget): The parent widget.
            setting_details (dict): A dictionary containing the setting details.
            style_manager (StyleManager): An instance of StyleManager for styling.
            controller (object): The controller handling the save logic.
            db_connection (DatabaseConnection): The database connection instance.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        self.combobox_active = False
        self.combobox_clicked = False
        bg_color = style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, **kwargs)
        
        self.setting_details = setting_details
        self.controller = controller
        self.db_connection = db_connection

        self.build_widget()

    def build_widget(self):
        """
        Build the widget with title, scrollable area, and entry fields.
        """
        # Create a title label
        title_label = tk.Label(self, text="Edit Setting", font=('Helvetica', 16, 'bold'), bg=self['bg'])
        title_label.pack(pady=10)

        # Create a frame to hold the canvas and scrollbar
        frame = tk.Frame(self, bg=self['bg'])
        frame.pack(fill=tk.BOTH, expand=True)

        # Create a canvas
        self.canvas = tk.Canvas(frame, bg=self['bg'], highlightthickness=0)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Add a scrollbar
        self.scrollbar = tk.Scrollbar(frame, orient=tk.VERTICAL, command=self.canvas.yview)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Configure the canvas to use the scrollbar
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.canvas.bind('<Configure>', lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))

        # Create an internal frame to hold the entry widgets
        self.internal_frame = tk.Frame(self.canvas, bg=self['bg'])
        self.canvas.create_window((0, 0), window=self.internal_frame, anchor="nw")

        row = 0
        for key, value in self.setting_details.items():
            label = tk.Label(self.internal_frame, text=key, bg=self['bg'])
            label.grid(row=row, column=0, padx=5, pady=5, sticky="w")
            
            # Check for foreign key fields to use combobox
            if key in ['id_speciesid', 'id_breedid', 'id_stateid', 'id_countyid']:
                names = self.fetch_names(key)
                combobox = ttk.Combobox(self.internal_frame, values=names, state='readonly')
                combobox.set(names[0] if value not in names else value)
                combobox.grid(row=row, column=1, padx=5, pady=5, sticky="w")
                self.bind_combobox_events(combobox)
                setattr(self, f"entry_{key}", combobox)
            else:
                entry = tk.Entry(self.internal_frame)
                entry.insert(0, value)
                entry.grid(row=row, column=1, padx=5, pady=5, sticky="w")
                setattr(self, f"entry_{key}", entry)
            
            row += 1

        self.save_button = tk.Button(self.internal_frame, text="Save", command=self.save_changes)
        self.save_button.grid(row=row, column=0, columnspan=2, pady=10)

        # Bind mouse wheel scrolling to the canvas
        self.bind_mousewheel(self.canvas)

    def fetch_names(self, key):
        """
        Fetch names for the combobox based on the key.

        Args:
            key (str): The key to determine which names to fetch.

        Returns:
            list: A list of names.
        """
        if key == 'id_speciesid':
            return fetch_species_names(self.db_connection)
        elif key == 'id_breedid':
            return fetch_breed_names(self.db_connection)
        elif key == 'id_stateid':
            return fetch_state_names(self.db_connection)
        elif key == 'id_countyid':
            return fetch_county_names(self.db_connection)

    def save_changes(self):
        """
        Save the changes made in the entry fields.

        This method retrieves the updated values from the entry fields and passes them to the controller.
        """
        updated_details = {key: getattr(self, f"entry_{key}").get() for key in self.setting_details.keys()}
        self.controller.save_edited_setting(updated_details)

    def on_mousewheel(self, event):
        """
        Handle mouse wheel scrolling.

        Args:
            event (tk.Event): The event object containing details about the mouse wheel scroll event.
        """
        if not self.combobox_active:
            self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def bind_mousewheel(self, widget):
        """
        Bind the mouse wheel event to a widget.

        Args:
            widget (tk.Widget): The widget to bind the mouse wheel event to.
        """
        widget.bind_all("<MouseWheel>", self.on_mousewheel)

    def bind_combobox_events(self, combobox):
        """
        Bind events to the combobox for handling mouse wheel scrolling.

        Args:
            combobox (ttk.Combobox): The combobox to bind events to.
        """
        combobox.bind("<Enter>", self.on_combobox_enter)
        combobox.bind("<Leave>", self.on_combobox_leave)
        combobox.bind("<Button-1>", self.on_combobox_click)
        combobox.bind("<<ComboboxSelected>>", lambda e: self.bind_mousewheel(self.canvas))
        combobox.bind("<MouseWheel>", self.on_combobox_mousewheel)

    def on_combobox_enter(self, event):
        self.combobox_active = True
        self.unbind_mousewheel()

    def on_combobox_leave(self, event):
        # Check if the combobox dropdown is still open
        widget = event.widget
        if widget.state() == ("readonly",):
            self.combobox_active = False
            self.bind_mousewheel(self.canvas)

    def on_combobox_click(self, event):
        self.combobox_clicked = True

    def on_combobox_mousewheel(self, event):
        """
        Handle mouse wheel scrolling for combobox.

        Args:
            event (tk.Event): The event object containing details about the mouse wheel scroll event.
        """
        if self.combobox_clicked:
            try:
                popdown_widget_name = event.widget.tk.call("ttk::combobox::PopdownWindow", event.widget)
                popdown_widget = event.widget.nametowidget(popdown_widget_name)
                listbox = popdown_widget.winfo_children()[0]
                listbox.yview_scroll(int(-1 * (event.delta / 120)), 'units')
                return "break"  # Prevent further propagation of the event
            except (tk.TclError, IndexError) as e:
                pass

    def unbind_mousewheel(self):
        """
        Unbind the mouse wheel event from all widgets.
        """
        self.canvas.unbind_all("<MouseWheel>")
