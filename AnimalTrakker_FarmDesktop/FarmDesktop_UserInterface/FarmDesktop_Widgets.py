import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from tkcalendar import DateEntry
from ttkwidgets import CheckboxTreeview
from AnimalTrakker_Shared.Shared_Logging import get_logger

import csv

## ods packages
from pyexcel_ods3 import save_data
from collections import OrderedDict
##

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
        # Clear previous search results from the results frame
        for widget in self.search_results_frame.winfo_children():
            widget.destroy()

        search_type = self.search_type_var.get()
        search_query = self.search_entry.get()

        # Placeholder for search function
        search_results = search_function(search_type, search_query)

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

class LeftSidebarChoiceWidget(tk.Frame):
    def __init__(self, parent, choices, choice_type, controller, style_manager, **kwargs):
        # Get the background color from the style manager
        bg_color = style_manager.get_bg('sidebar')
        super().__init__(parent, bg=bg_color, **kwargs)
        self.controller = controller
        self.style_manager = style_manager
        self.choice_type = choice_type
        
        self.choice_var = tk.StringVar(self)
        
        # Configuring column weights for proportionate division
        self.grid_columnconfigure(0, weight=1)
        
        # Label with style
        self.label = tk.Label(self, text="Select a setting or evaluation:", bg=bg_color)
        self.label.grid(row=0, column=0, pady=5, sticky="nsew")
        
        # Combobox with style
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
        logger.info(f'Confirm {self.choice_type} choice button was clicked')
        self.controller.load_setting(choice, choice_type=self.choice_type)
        
    def create_new_choice(self):
        logger.info(f'Create New {self.choice_type} choice button was clicked')
        self.controller.load_setting('Create New', choice_type=self.choice_type)
                
    def edit_choice(self):
        logger.info(f'Edit {self.choice_type} choice button was clicked')
        choice = self.choice_var.get()
        self.controller.load_setting(choice, edit=True, choice_type=self.choice_type)

class PopupWidget(tk.Toplevel):
    def __init__(self, parent, key, current_id, fetch_function, style_manager, popup_type="list", popup_purpose="edit", text_fields=None):
        """
        Initialize the PopupWidget.

        Args:
            parent (tk.Widget): The parent widget.
            key (str): The key of the setting being edited.
            current_id (int): The current ID of the setting.
            fetch_function (callable): The function to fetch options for the setting.
            style_manager (StyleManager): An instance of StyleManager for styling.
            popup_type (str): The type of popup ("list", "single_text", or "multiple_text").
            text_fields (dict): Dictionary for multiple text fields with field names as keys.
        """
        super().__init__(parent)
        self.parent = parent
        self.key = key
        self.current_id = current_id
        self.fetch_function = fetch_function
        self.style_manager = style_manager
        self.popup_type = popup_type
        self.popup_purpose = popup_purpose
        self.text_fields = text_fields or {}
        self.build_widget()
        self.center_popup()

    def build_widget(self):
        """
        Build the popup widget.

        This method creates the layout of the popup based on the popup type.
        """
        self.title(f"Edit {self.key}")
        self.geometry("400x300")
        self.configure(bg=self.style_manager.get_bg('main_frame'))

        label = tk.Label(self, text=self.key, bg=self.style_manager.get_bg('main_frame'))
        label.pack(pady=10)

        if self.popup_type == "list":
            self.build_list_widget()
        elif self.popup_type == "single_text":
            self.build_single_text_widget()
        elif self.popup_type == "multiple_text":
            self.build_multiple_text_widget()

        if self.popup_purpose == "edit":
            update_button = tk.Button(self, text="Update", command=self.update_changes)
            update_button.pack(pady=10)
        if self.popup_purpose == "moveanimals":
            choose_new_owner_button = tk.Button(self, text="Confirm", command=self.choose_new_owner)
            choose_new_owner_button.pack(pady=10)

        # Prevent main frame from scrolling when popup is open
        self.bind("<MouseWheel>", self.on_mousewheel)

    def build_list_widget(self):
        """
        Build the list widget for list selection popup.
        """
        options = self.fetch_function(self.parent.db_connection)
        self.ids = [row[0] for row in options]
        self.names = [row[1] for row in options]

        frame = tk.Frame(self)
        frame.pack(pady=5, fill=tk.BOTH, expand=True)

        self.listbox = tk.Listbox(frame, selectmode=tk.SINGLE)
        self.listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        self.scrollbar = ttk.Scrollbar(frame, orient=tk.VERTICAL, command=self.listbox.yview)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.listbox.config(yscrollcommand=self.scrollbar.set)

        # Insert names into the listbox
        for name in self.names:
            self.listbox.insert(tk.END, name)

        # Handle initial value 0 by selecting the first item or a default value
        if self.current_id in self.ids:
            current_index = self.ids.index(self.current_id)
        else:
            current_index = 0  # Default to the first item if current_id is not in the list

        self.listbox.selection_set(current_index)
        self.listbox.activate(current_index)

        self.listbox.bind("<MouseWheel>", self.on_listbox_mousewheel)
        self.listbox.bind("<Button-1>", self.on_listbox_click)

    def build_single_text_widget(self):
        """
        Build the widget for single text field popup.
        """
        self.text_var = tk.StringVar(value=self.current_id)
        self.text_entry = tk.Entry(self, textvariable=self.text_var)
        self.text_entry.pack(pady=10, fill=tk.X, padx=10)

    def build_multiple_text_widget(self):
        """
        Build the widget for multiple text fields popup.
        """
        self.text_vars = {}
        for field_name, field_value in self.text_fields.items():
            label = tk.Label(self, text=field_name, bg=self.style_manager.get_bg('main_frame'))
            label.pack(pady=5)

            text_var = tk.StringVar(value=field_value)
            self.text_vars[field_name] = text_var
            text_entry = tk.Entry(self, textvariable=text_var)
            text_entry.pack(pady=5, fill=tk.X, padx=10)

    def on_mousewheel(self, event):
        """
        Prevent the main frame from scrolling when the mouse wheel is used within the popup.
        """
        return "break"

    def on_listbox_mousewheel(self, event):
        """
        Handle mouse wheel scrolling within the listbox.

        Args:
            event (tk.Event): The event object containing details about the mouse wheel scroll event.
        """
        self.listbox.yview_scroll(int(-1 * (event.delta / 120)), "units")
        return "break"

    def on_listbox_click(self, event):
        """
        Handle click events within the listbox to log the selected element.

        Args:
            event (tk.Event): The event object containing details about the click event.
        """
        selected_index = self.listbox.curselection()
        if selected_index:
            logger.info(f"Selected element: {self.names[selected_index[0]]}")

    def center_popup(self):
        """
        Center the popup window on the screen.
        """
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')

    def update_changes(self):
        """
        Update the changes made in the popup and pass them to the parent widget.
        """
        if self.popup_type == "list":
            selected_index = self.listbox.curselection()
            if selected_index:
                selected_id = self.ids[selected_index[0]]
                self.parent.update_data_field(self.key, selected_id)
        elif self.popup_type == "single_text":
            new_value = self.text_var.get()
            self.parent.update_data_field(self.key, new_value)
        elif self.popup_type == "multiple_text":
            new_values = {field_name: text_var.get() for field_name, text_var in self.text_vars.items()}
            self.parent.update_data_field(self.key, new_values)
        self.destroy()
        
    def choose_new_owner(self):
        # Set logic for where to store new owner information
        if self.popup_type == "list":
            selected_index = self.listbox.curselection()
            if selected_index:
                selected_id = self.ids[selected_index[0]]
                self.parent.new_owner = (self.key, selected_id)
                print("Here we've saved new_owner data to a variable, but it is also can be a function")
                print(self.parent.new_owner)
        elif self.popup_type == "single_text":
            new_value = self.text_var.get()
            self.parent.new_owner = (self.key, new_value)
        elif self.popup_type == "multiple_text":
            new_values = {field_name: text_var.get() for field_name, text_var in self.text_vars.items()}
            self.parent.new_owner = (self.key, new_values)
        self.destroy()

class EditWidget(tk.Frame):
    """
    A widget for editing data.

    This widget displays data details in entry fields that can be edited and saved.

    Attributes:
        parent (tk.Widget): The parent widget.
        data_details (dict): A dictionary containing the data details.
        style_manager (StyleManager): An instance of StyleManager for styling.
        controller (object): The controller handling the save logic.
        db_connection (DatabaseConnection): The database connection instance.
        data_type (str): The type of data being edited ("setting" or "evaluation").
    """
    def __init__(self, parent, data_details, style_manager, controller, db_connection, data_type, **kwargs):
        """
        Initialize the EditWidget.

        Args:
            parent (tk.Widget): The parent widget.
            data_details (dict): A dictionary containing the data details.
            style_manager (StyleManager): An instance of StyleManager for styling.
            controller (object): The controller handling the save logic.
            db_connection (DatabaseConnection): The database connection instance.
            data_type (str): The type of data being edited ("setting" or "evaluation").
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        super().__init__(parent, bg=style_manager.get_bg('main_frame'), **kwargs)
        self.data_details = data_details
        self.controller = controller
        self.db_connection = db_connection
        self.style_manager = style_manager
        self.data_type = data_type
        
        self.hidden_fields = ['id_animaltrakkerdefaultsettingsid', 'id_savedevaluationstableid']  # List of keys to hide

        self.build_widget()

    def build_widget(self):
        """
        Build the widget with title, scrollable area, and entry fields.
        """
        # Create a frame to hold the title label and scrollbar
        title_frame = tk.Frame(self, bg=self['bg'])
        title_frame.pack(fill=tk.BOTH, expand=False)

        # Create a title label
        title_text = "Edit Setting" if self.data_type == "setting" else "Edit Evaluation"
        title_label = tk.Label(title_frame, text=title_text, font=('Helvetica', 16, 'bold'), bg=self['bg'])
        title_label.pack(pady=10, side=tk.TOP)

        # Create a frame to hold the canvas and scrollbar
        frame = tk.Frame(self, bg=self['bg'])
        frame.pack(fill=tk.BOTH, expand=True)

        # Create a canvas
        self.canvas = tk.Canvas(frame, bg=self['bg'], highlightthickness=0)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Add a ttk scrollbar
        self.scrollbar = ttk.Scrollbar(frame, orient=tk.VERTICAL, command=self.canvas.yview)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Configure the canvas to use the scrollbar
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.canvas.bind('<Configure>', lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))

        # Create an internal frame to hold the entry widgets
        self.internal_frame = tk.Frame(self.canvas, bg=self['bg'])
        self.canvas.create_window((0, 0), window=self.internal_frame, anchor="nw")

        self.value_labels = {}
        row = 0
        for key, value in self.data_details.items():
            if key in self.hidden_fields:
                continue  # Skip rendering this field if it is in the hidden_fields list

            label = tk.Label(self.internal_frame, text=key, bg=self['bg'])
            label.grid(row=row, column=0, padx=5, pady=5, sticky="w")

            display_value, action = self.get_display_value_and_function(key, value)
            if action == "single_text":
                value_label = tk.Label(self.internal_frame, text=display_value, bg=self['bg'])
                value_label.grid(row=row, column=1, padx=5, pady=5, sticky="w")
                edit_button = tk.Button(self.internal_frame, text="Edit", command=lambda k=key, v=value: self.open_edit_popup(k, v, popup_type="single_text"))
                edit_button.grid(row=row, column=2, padx=5, pady=5, sticky="w")
            elif callable(action):
                value_label = tk.Label(self.internal_frame, text=display_value, bg=self['bg'])
                value_label.grid(row=row, column=1, padx=5, pady=5, sticky="w")
                edit_button = tk.Button(self.internal_frame, text="Edit", command=lambda k=key, v=value, f=action: self.open_edit_popup(k, v, f))
                edit_button.grid(row=row, column=2, padx=5, pady=5, sticky="w")
            else:
                value_label = tk.Label(self.internal_frame, text=value, bg=self['bg'])
                value_label.grid(row=row, column=1, padx=5, pady=5, sticky="w")

            self.value_labels[key] = value_label
            row += 1

        self.save_button = tk.Button(self.internal_frame, text="Save", command=self.save_changes)
        self.save_button.grid(row=row, column=0, columnspan=3, pady=10)

        # Bind mouse wheel scrolling to the canvas
        self.bind_mousewheel(self.canvas)

    def get_display_value_and_function(self, key, value):
        """
        Get the display value and corresponding fetch function for a key.

        Args:
            key (str): The key to fetch the display value for.
            value (str): The current value.

        Returns:
            tuple: A tuple containing the display value and the fetch function.
        """
        fetch_function = None
        popup_type = "list"
        
        if self.data_type == "setting":
            if key == 'id_speciesid':
                fetch_function = fetch_species_names
            elif key == 'id_breedid':
                fetch_function = fetch_breed_names
            elif key == 'id_stateid':
                fetch_function = fetch_state_names
            elif key == 'id_countyid':
                fetch_function = fetch_county_names
            elif key == 'default_settings_name':
                return value, "single_text"
        elif self.data_type == "evaluation":
            if key == 'evaluation_name':
                return value, "single_text"
            pass
            """if key.startswith('trait_name'):
                fetch_function = fetch_trait_names
            elif key.startswith('trait_units'):
                fetch_function = fetch_units_names"""
        if fetch_function:
            display_value = self.get_name_by_id(fetch_function(self.db_connection), value)
            return display_value, fetch_function
        return value, popup_type

    def get_name_by_id(self, options, id_value):
        """
        Get the name corresponding to an ID from the options.

        Args:
            options (list): The list of options containing (ID, name) tuples.
            id_value (int): The ID value to look up.

        Returns:
            str: The name corresponding to the ID value, or "Unknown" if the ID is 0.
        """
        for option in options:
            if option[0] == id_value:
                return option[1]
        return "Unknown" if id_value == 0 else id_value

    def open_list_edit_popup(self, key, value, fetch_function):
        """
        Open the edit popup for a list selection.

        Args:
            key (str): The key of the data field to edit.
            value (int): The current ID of the data field.
            fetch_function (callable): The function to fetch options for the data field.
        """
        popup = PopupWidget(self, key, value, fetch_function, self.style_manager, popup_type="list")
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed

    def open_single_text_edit_popup(self, key, value):
        """
        Open the edit popup for a single text field.

        Args:
            key (str): The key of the data field to edit.
            value (str): The current value of the data field.
        """
        popup = PopupWidget(self, key, value, None, self.style_manager, popup_type="single_text")
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed

    def open_multiple_text_edit_popup(self, key, text_fields):
        """
        Open the edit popup for multiple text fields.

        Args:
            key (str): The key of the data field to edit.
            text_fields (dict): A dictionary of field names and their current values.
        """
        popup = PopupWidget(self, key, None, None, self.style_manager, popup_type="multiple_text", text_fields=text_fields)
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed

    def open_edit_popup(self, key, value, fetch_function=None, popup_type="list", text_fields=None):
        """
        Open the appropriate edit popup based on the popup type.

        Args:
            key (str): The key of the data field to edit.
            value (str or int): The current value or ID of the data field.
            fetch_function (callable, optional): The function to fetch options for list selection.
            popup_type (str): The type of popup ("list", "single_text", or "multiple_text").
            text_fields (dict, optional): A dictionary of field names and their current values for multiple text fields.
        """
        if popup_type == "list":
            self.open_list_edit_popup(key, value, fetch_function)
        elif popup_type == "single_text":
            self.open_single_text_edit_popup(key, value)
        elif popup_type == "multiple_text":
            self.open_multiple_text_edit_popup(key, text_fields)

    def update_data_field(self, key, new_value):
        """
        Update the data field value in the main widget.

        Args:
            key (str): The key of the data field to update.
            new_value (str or int or dict): The new value for the data field.
        """
        # Check if the new value is a dictionary (for multiple text fields)
        if isinstance(new_value, dict):
            for sub_key, sub_value in new_value.items():
                self.data_details[sub_key] = sub_value
                # Update the display value for each sub-key in the main widget
                display_value, _ = self.get_display_value_and_function(sub_key, sub_value)
                self.value_labels[sub_key].config(text=display_value)
        else:
            self.data_details[key] = new_value
            # Update the display value for the specific key in the main widget
            display_value, _ = self.get_display_value_and_function(key, new_value)
            self.value_labels[key].config(text=display_value)


    def save_changes(self):
        """
        Save the changes made in the entry fields.

        This method retrieves the updated values from the entry fields and passes them to the controller.
        """
        updated_details = {key: value for key, value in self.data_details.items()}
        self.controller.save_edited_data(updated_details, self.data_type)

    def on_mousewheel(self, event):
        """
        Handle mouse wheel scrolling.

        Args:
            event (tk.Event): The event object containing details about the mouse wheel scroll event.
        """
        if self.winfo_containing(event.x_root, event.y_root) == self.canvas:
            self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def bind_mousewheel(self, widget):
        """
        Bind the mouse wheel event to a widget.

        Args:
            widget (tk.Widget): The widget to bind the mouse wheel event to.
        """
        widget.bind_all("<MouseWheel>", self.on_mousewheel)

    def unbind_mousewheel(self):
        """
        Unbind the mouse wheel event from all widgets.
        """
        self.canvas.unbind_all("<MouseWheel>")
        
class CreateNewDBEntryWidget(tk.Frame):
    """
    A widget for creating a new database entry.

    This widget prompts the user to enter a name for the new entry and confirm the creation.

    Attributes:
        parent (tk.Widget): The parent widget.
        style_manager (StyleManager): An instance of StyleManager for styling.
        controller (object): The controller handling the logic.
        entry_type (str): The type of entry being created ('setting' or 'evaluation').
    """
    def __init__(self, parent, style_manager, controller, entry_type="setting", **kwargs):
        """
        Initialize the CreateNewDBEntryWidget.

        Args:
            parent (tk.Widget): The parent widget.
            style_manager (StyleManager): An instance of StyleManager for styling.
            controller (object): The controller handling the logic.
            entry_type (str): The type of entry being created ('setting' or 'evaluation').
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        super().__init__(parent, bg=style_manager.get_bg('main_frame'), **kwargs)
        self.style_manager = style_manager
        self.controller = controller
        self.entry_type = entry_type

        self.build_widget()
        self.bind('<Map>', self.on_map)  # Bind to the <Map> event

    def build_widget(self):
        """
        Build the widget with input field and confirm button.
        """
        # Create a title label
        title_text = "Create New Setting" if self.entry_type == "setting" else "Create New Evaluation"
        title_label = tk.Label(self, text=title_text, font=('Helvetica', 16, 'bold'), bg=self['bg'])
        title_label.pack(pady=10)

        # Create input field for entry name
        self.name_var = tk.StringVar()
        name_label_text = "Enter setting name:" if self.entry_type == "setting" else "Enter evaluation name:"
        name_label = tk.Label(self, text=name_label_text, bg=self['bg'])
        name_label.pack(pady=5)
        self.name_entry = tk.Entry(self, textvariable=self.name_var)
        self.name_entry.pack(pady=5)
        self.name_entry.config(state=tk.NORMAL)  # Ensure the entry is in normal state

        # Create confirm button
        confirm_button = tk.Button(self, text="Confirm", command=self.confirm_creation)
        confirm_button.pack(pady=10)

        # Create note label
        note_text = "Note: Add function to copy entry from existing setting entry?" if self.entry_type == "setting" else "Note: Add function to copy entry from existing evaluation entry?"
        note_label = tk.Label(self, text=note_text, bg=self['bg'])
        note_label.pack(pady=5)

    def on_map(self, event):
        """
        Set focus on the name entry widget when the widget is mapped (shown).
        """
        self.after(200, self.set_focus)  # Slightly increased delay

    def set_focus(self):
        """
        Set focus on the name entry widget and log the focus operation.
        """
        self.name_entry.focus_force()
        logger.info("Focus set on name entry widget")

    def confirm_creation(self):
        """
        Handle the confirmation of the new entry creation.
        """
        new_entry_name = self.name_var.get()
        logger.info(f'Confirm new {self.entry_type} creation button was clicked with name: {new_entry_name}')
        if self.entry_type == "setting":
            self.controller.confirm_new_setting_creation(new_entry_name)
        elif self.entry_type == "evaluation":
            self.controller.confirm_new_evaluation_creation(new_entry_name)

class SearchLeftSidebarWidget(tk.Frame):
    def __init__(self, parent, controller, style_manager, search_type, db_connection, on_csv_save, on_ods_save, **kwargs):
        super().__init__(parent, bg=style_manager.get_bg('sidebar'), **kwargs)
        self.controller = controller
        self.style_manager = style_manager
        self.search_type = search_type
        self.db_connection = db_connection
        self.on_csv_save = on_csv_save
        self.on_ods_save = on_ods_save
        self.new_owner = None

        self.option_to_field = {
            "Flock Prefix": ("id_animalid", "animal_flock_prefix_table.id_animalid", "flock_prefix_table.id_flockprefixid", "flock_prefix_table.flock_prefix"),
            "Animal Name": ("animal_name", None, None, None),
            "Sex": ("id_sexid", "sex_table.id_sexid", None, "sex_table.sex_name"),
            "Sire Flock Prefix": ("sire_id", "animal_flock_prefix_table.id_animalid", "flock_prefix_table.id_flockprefixid", "flock_prefix_table.flock_prefix"),
            "Sire Name": ("sire_id", "animal_table.id_animalid", None, "animal_table.animal_name"),
            "Dam Flock Prefix": ("dam_id", "animal_flock_prefix_table.id_animalid", "flock_prefix_table.id_flockprefixid", "flock_prefix_table.flock_prefix"),
            "Dam Name": ("dam_id", "animal_table.id_animalid", None, "animal_table.animal_name"),
            "Registration Number": ("id_animalid", "animal_registration_table.id_animalid", None, "animal_registration_table.registration_number"),




            "Alert Text": ("alert", None, None, None),
            "Birth Date": ("birth_date", None, None, None),
            "Birth Type": ("id_birthtypeid", "birth_type_table.id_birthtypeid", None, "birth_type_table.birth_type_abbrev"),
            "Death Date": ("death_date", None, None, None),
            "Death Reason": ("id_deathreasonid", "death_reason_table.id_deathreasonid", None, "death_reason_table.death_reason"),
            "Breed": ("id_animalid", "animal_breed_table.id_animalid", "breed_table.id_breedid", "breed_table.breed_name"),

            # genetic characteristics

            "Scrapie Codon 171": ("scrapie_codon_171", None, None, None),
            "Scrapie Codon 136": ("scrapie_codon_136", None, None, None),
            "Coat Color": ("coat_color", None, None, None),
            "Owner": ("owner", None, None, None),
            "Location": ("location", None, None, None),
            "Breeder": ("breeder", None, None, None)
        }

        # KEY : string of checkbox
        # VAL : tk.BoolVar
        self.selected_options = {}

        self.build_widget()

    def build_widget(self):
        title_label = tk.Label(self, text="Display Options", bg=self['bg'])
        title_label.pack(pady=10)

        for option in self.option_to_field.keys():
            var = tk.BooleanVar()
            chk = tk.Checkbutton(self, text=option, variable=var, bg=self['bg'])
            chk.pack(anchor='w', padx=10)
            self.selected_options[option] = var

        # Add the buttons at the bottom
        button_frame = tk.Frame(self, bg=self['bg'])
        button_frame.pack(pady=10, fill=tk.X)

        if self.search_type == "default":
            pdf_button = tk.Button(button_frame, text="Save as PDF", command=self.save_as_pdf)
            pdf_button.pack(fill=tk.X, padx=5, pady=2)

            csv_button = tk.Button(button_frame, text="Save as CSV", command=self.save_as_csv)
            csv_button.pack(fill=tk.X, padx=5, pady=2)

            odt_button = tk.Button(button_frame, text="Save as ODT", command=self.save_as_odt)
            odt_button.pack(fill=tk.X, padx=5, pady=2)

            ods_button = tk.Button(button_frame, text="Save as ODS", command=self.save_as_ods)
            ods_button.pack(fill=tk.X, padx=5, pady=2)
            
        elif self.search_type == "moveanimals":
            location_button = tk.Button(button_frame, text="Select New Location", command=self.select_new_location)
            location_button.pack(fill=tk.X, padx=5, pady=2)

            owner_button = tk.Button(button_frame, text="Select New Owner", command=self.select_new_owner)
            owner_button.pack(fill=tk.X, padx=5, pady=2)
            
            move_button = tk.Button(button_frame, text="Move Animals", command=self.move_animals)
            move_button.pack(fill=tk.X, padx=5, pady=2)
            
            move_button = tk.Button(button_frame, text="Single Text", command=self.select_new_owner_single_text)
            move_button.pack(fill=tk.X, padx=5, pady=2)
            
            move_button = tk.Button(button_frame, text="Multiple Text", command=self.select_new_owner_multiple_text)
            move_button.pack(fill=tk.X, padx=5, pady=2)

    def save_as_pdf(self):
        # Add logic to save as PDF
        pass

    def save_as_csv(self):
        self.on_csv_save()

    def save_as_odt(self):
        # Add logic to save as ODT
        pass

    def save_as_ods(self):
        self.on_ods_save()

    # This is a exmaple of two buttons which will handle the logic of moving animals
    # As per my understanding now, you want to select new owner (or location) 
    # and then move chosen animals by clicking "Move Animals" button
    # So far I've tried separate logic in MVC model - Model, View and Controller
    # Meaning that I have to have separate logic User Interface, general logic and database logic
    # For ease, you can call database logic from here
    # So far, functions for fetching/saving data are in FarmDesktop_Database_Utilities.py
    # And more complex data operations to handle multiple queries are in FarmDesktop_Database_Handlers.py
    
    def select_new_owner(self):
        # Add logic to select new owner
        # Here is an example of using 'list' popup widget, and two functions below show how to use 'single_text' and 'multiple_text' popup widgets
        logger.info("Select New Owner button in SearchLeftSidebarWidget was clicked")
        # Here, you can access database. For example you can look at fetch_example (copy of fetch_species_names) in FamDesktop_Database_Utilities.py
        # Data in it is fetched for the list construction as [(id, 'value')]
        # Here is an example of calling that function (from the way logic is set up so far, you don't need to use () after the function)
        fetch_function = fetch_example
        # key and value are the reference to keep existing values form the default settings, but can be ommited
        # Also key is what would be displayed on the top of the popup widget (next steps is to make conversion to readable names)
        key = "id_stateid"
        value = 6
        popup = PopupWidget(self, key, value, fetch_function, self.style_manager, popup_type="list", popup_purpose="moveanimals")
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed
        if self.new_owner:
            print("And here is new owner after our previous selection")
            print(self.new_owner)
        else:
            print("Here new owner is empty, because we haven't selected anything yet")
            print(self.new_owner)
        # And here we can access the search results, and manipulate it how we need
        print(self.controller.search_results)
        # after this we can manipulate search results as we want, create query to make changes to db based on new owner information
        # right now search_results are only showing what will be displayed in the searchbox, without animal id
        # I can add it if necessary

    def select_new_owner_single_text(self):
        """
        Select a new owner using a single text field popup.
        """
        logger.info("Select New Owner (Single Text) button was clicked")
        fetch_function = fetch_example
        key = "owner_name"
        value = "John Doe"
        popup = PopupWidget(self, key, value, fetch_function, self.style_manager, popup_type="single_text", popup_purpose="moveanimals")
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed
        if hasattr(self, 'new_owner'):
            print("And here is new owner after our previous selection")
            print(self.new_owner)
        else:
            print("Here new owner is empty, because we haven't selected anything yet")
            self.new_owner = None
            print(self.new_owner)

    def select_new_owner_multiple_text(self):
        """
        Select a new owner using multiple text fields popup.
        """
        logger.info("Select New Owner (Multiple Text) button was clicked")
        fetch_function = fetch_example
        key = "owner_details"
        value = {"First Name": "John", "Last Name": "Doe", "Address": "123 Main St"}
        popup = PopupWidget(self, key, value, fetch_function, self.style_manager, popup_type="multiple_text", popup_purpose="moveanimals", text_fields=value)
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed
        if hasattr(self, 'new_owner'):
            print("And here is new owner after our previous selection")
            print(self.new_owner)
        else:
            print("Here new owner is empty, because we haven't selected anything yet")
            self.new_owner = None
            print(self.new_owner)
        
    def select_new_location(self):
        # Add logic to select new location
        logger.info("Select New Location button in SearchLeftSidebarWidget was clicked")
        pass
    
    def move_animals(self):
        # Add logic to move animals
        pass
    
    def get_selected_options(self):
        if not self.selected_options:
            return None
        return [option for option, var in self.selected_options.items() if var.get()]


class SearchBoxWidget(tk.Frame):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, **kwargs)
        self.build_widget()

    def build_widget(self):
        # Create a frame to hold the treeview and both scrollbars
        self.tree_frame = tk.Frame(self)
        self.tree_frame.pack(expand=True, fill='both')

        # Create the vertical scrollbar
        self.tree_scroll_y = ttk.Scrollbar(self.tree_frame, orient="vertical")
        self.tree_scroll_y.pack(side='right', fill='y')

        # Create the treeview widget with a checkbox column
        self.tree = ttk.Treeview(self.tree_frame, columns=['checkbox'], show="headings", yscrollcommand=self.tree_scroll_y.set)
        self.tree.pack(expand=True, fill='both', side='left')
        self.tree_scroll_y.config(command=self.tree.yview)

        # Create the horizontal scrollbar
        self.tree_scroll_x = ttk.Scrollbar(self, orient="horizontal", command=self.tree.xview)
        self.tree_scroll_x.pack(side='bottom', fill='x')
        self.tree.configure(xscrollcommand=self.tree_scroll_x.set)

        # Configure the checkbox column
        self.tree.column('checkbox', anchor=tk.W, width=30)
        self.tree.heading('checkbox', text='')  # No text for the checkbox column header

        # Bind click event to toggle checkboxes
        self.tree.bind('<Button-1>', self.on_click)

    def clear_data(self):
        for row in self.tree.get_children():
            self.tree.delete(row)

    def set_columns(self, columns):
        self.tree["columns"] = ['checkbox'] + columns
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, anchor='w', stretch=True)  # Adjust to stretch columns

    def display_results(self, results, columns):
        self.clear_data()
        self.set_columns(columns)
        for row in results:
            self.tree.insert("", "end", values=('☐',) + tuple(row))

    def on_click(self, event):
        # Identify the region clicked
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            col = self.tree.identify_column(event.x)
            row_id = self.tree.identify_row(event.y)
            if col == '#1':  # Assuming the checkbox column is the first one
                # Get current value of the checkbox
                current_value = self.tree.item(row_id, 'values')[0]
                # Determine the new value based on current state
                new_value = '☑' if current_value == '☐' else '☐'
                # Update the checkbox value while preserving other column values
                values = list(self.tree.item(row_id, 'values'))
                values[0] = new_value  # Update checkbox state
                self.tree.item(row_id, values=values)
            
class SearchMainFrameWidget(tk.Frame):
    def __init__(self, parent, controller, style_manager, **kwargs):
        super().__init__(parent, bg=style_manager.get_bg('main_frame'), **kwargs)
        self.controller = controller
        self.style_manager = style_manager

        self.build_widget()
        self.configure_grid()
        
        # Forcing cursor to be on the main frame
        self.bind('<Map>', self.on_map)  # Bind to the <Map> event

    def add_combobox(self, parent, name, row, column, width=20):
            if name == "breed":
                data = fetch_breed_names(self.controller.app.db_connection)
            elif name == "birth_type":
                data = fetch_birth_type(self.controller.app.db_connection)
            elif name == "sex":
                data = fetch_sex_names(self.controller.app.db_connection)
            elif name == "state":
                data = fetch_state_names(self.controller.app.db_connection)

            values_list = [item[1] for item in data]
            combobox = ttk.Combobox(parent, values=values_list, width=width)
            combobox.grid(row=row, column=column, padx=2, pady=2, sticky="ew")
            self.entries[name] = combobox
            
    def build_widget(self):
    
        title_label = tk.Label(self, text="Animal Search", font=('Helvetica', 16, 'bold'), bg=self['bg'])
        title_label.grid(row=0, column=0, columnspan=10, pady=2)  # Adjusted vertical padding

        self.entries = {}

        # First Row: Flock Prefix, Animal Name, Sex, Birth Type, Breed Labels and Entry Fields
        self.add_label(self, "Flock Prefix", 1, 0)
        self.add_entry(self, "flock_prefix", 25, 2, 0, width=20)

        self.add_label(self, "Animal Name", 1, 2)
        self.add_entry(self, "animal_name", 25, 2, 2, width=20)

        self.add_label(self, "Sex", 1, 4)
        self.add_combobox(self, "sex", 2, 4, width=15)

        self.add_label(self, "Birth Type", 1, 6)
        self.add_combobox(self, "birth_type", 2, 6, width=15)

        self.add_label(self, "Breed", 1, 8)
        self.add_combobox(self, "breed", 2, 8, width=20)

        # Second Row: Birth Date Range and Death Date Range Labels
        self.add_label(self, "Birth Date Range", 3, 0, 2)
        self.add_label(self, "Death Date Range", 3, 4, 2)

        # Third Row: From/To Labels and Entry Fields for Birth Date Range and Death Date Range
        self.add_label(self, "From", 4, 0)
        self.birth_date_from = self.add_date_entry(self, "birth_date_from", 5, 0, "Birth Date From")

        self.add_label(self, "To", 4, 2)
        self.birth_date_to = self.add_date_entry(self, "birth_date_to", 5, 2, "Birth Date To")

        self.add_label(self, "From", 4, 4)
        self.death_date_from = self.add_date_entry(self, "death_date_from", 5, 4, "Death Date From")

        self.add_label(self, "To", 4, 6)
        self.death_date_to = self.add_date_entry(self, "death_date_to", 5, 6, "Death Date To")

        self.add_label(self, "Owner Name", 4, 8)
        self.add_entry(self, "owner_name", 30, 5, 8, width=20)

        # Fourth Row: Breeder Name, Address, State, Entry and Alert Lables andFields
        self.add_label(self, "Breeder Name", 6, 0)
        self.add_entry(self, "breeder_name", 30, 7, 0, width=20)

        self.add_label(self, "Address", 6, 2)
        self.add_entry(self, "address", 30, 7, 2, width=20)

        self.add_label(self, "State", 6, 4)
        self.add_combobox(self, "state", 7, 4, width=5)

        self.add_label(self, "Alert Text", 6, 6)
        self.add_entry(self, "alert", 50, 7, 6, width=20)

        # Search Button
        search_button = tk.Button(self, text="Search", command=self.on_search_button_click)
        search_button.grid(row=8, column=0, pady=5, padx=5)  # Removed columnspan and added padding

        select_all_button = tk.Button(self, text="Select All", command=self.on_select_all)
        select_all_button.grid(row=8, column=1, pady=5, padx=5)  # Removed columnspan and added padding

        unselect_all_button = tk.Button(self, text="Unselect All", command=self.on_search_button_click)
        unselect_all_button.grid(row=8, column=2, pady=5, padx=5)  # Removed columnspan and added padding

        # Message display area
        self.message_label = tk.Label(self, text="", fg="red", bg=self['bg'])
        self.message_label.grid(row=9, column=0, columnspan=10, padx=2, pady=2, sticky="ew")

        # Row 10: Search Box Widget
        # self.search_box_widget = SearchBoxWidget(self, bg=self['bg'])
        # self.search_box_widget.grid(row=10, column=0, columnspan=10, padx=2, pady=2, sticky="nsew")

        self.tree_view = CheckboxTreeview(self)
        self.tree_view.grid(row=10, column=0, columnspan=10, padx=2, pady=2, sticky="nsew")

        # Pass a reference of search_box_widget to the controller
        # self.controller.search_box_widget = self.search_box_widget
        self.controller.tree_view = self.tree_view
        self.controller.search_main_frame_widget = self

    def on_search_button_click(self):
        search_params = self.get_search_parameters()
        self.controller.perform_animal_search(search_params)

    def on_select_all(self):
        for item in self.tree_view.get_children():
            self.tree_view.item(item, open=True, tags="checked")

    def on_unselect_all(self):
        for item in self.tree_view.get_children():
            self.tree_view.item(item, open=False, tags="checked")

    def on_map(self, event):
        """
        Set focus on the name entry widget when the widget is mapped (shown).
        """
        self.after(200, self.set_focus)  # Slightly increased delay

    def set_focus(self):
        """
        Set focus on the name entry widget and log the focus operation.
        """
        self.entries["flock_prefix"].focus_force()
        logger.info("Focus set on name entry widget")
        
    def configure_grid(self):
        self.grid_columnconfigure(0, weight=1)  # Left padding column
        for column in range(1, 10):
            self.grid_columnconfigure(column, weight=1)  # Main content columns
        self.grid_columnconfigure(10, weight=1)  # Right padding column
        self.grid_rowconfigure(12, weight=1)  # Make the search box widget expandable

    def get_search_parameters(self):
        params = {}
        for field_name, entry in self.entries.items():
            if isinstance(entry, DateEntry) and not entry.get():
                continue  # Skip empty date fields
            params[field_name] = entry.get() if not isinstance(entry, DateEntry) else entry.get_date()
        return params

    def add_label(self, parent, text, row, column, colspan=1):
        label = tk.Label(parent, text=text, bg=self['bg'])
        label.grid(row=row, column=column, columnspan=colspan, padx=2, pady=2, sticky="w")

    def add_entry(self, parent, name, max_length, row, column, width=20):
        validate_cmd = self.register(self.validate_entry)
        entry = tk.Entry(parent, validate="key", validatecommand=(validate_cmd, '%P', max_length, name), width=width)
        entry.grid(row=row, column=column, padx=2, pady=2, sticky="ew")
        self.entries[name] = entry

    def add_date_entry(self, parent, name, row, column, field_name):
        entry = DateEntry(parent, width=10, background='darkblue', foreground='white', borderwidth=2, date_pattern='yyyy-mm-dd')
        entry.grid(row=row, column=column, padx=2, pady=2, sticky="ew")
        entry.delete(0, tk.END)  # Clear the default date
        self.entries[name] = entry
        return entry

    def validate_entry(self, value_if_allowed, max_length, field_name):
        if len(value_if_allowed) > int(max_length):
            self.update_message(f"{field_name} must be at most {max_length} characters.")
            return False
        return True

    def update_message(self, message):
        self.message_label.config(text=message)

    def display_search_results(self, column_headers : list[str], results: list[list[str]]) -> None:
        # Clear existing data in the tree
        for item in self.tree_view.get_children():
            self.tree_view.delete(item)

        # first, set the headers
        self.tree_view.config(columns=column_headers)

        # Configure each column's heading and width
        for header in column_headers:
            self.tree_view.heading(header, text=header)
            self.tree_view.column(header, width=50)

        self.tree_view.column("#0", width=30)  # this makes the column equal in width, it seems

        for result_list in results:
            self.tree_view.insert("", "end", values=result_list)

        return

    def save_csv(self):
        # Open file dialog to select file path for saving the CSV
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )

        if not file_path:  # If the user cancels the file dialog, do nothing
            return

        # Extract data from the tree view
        rows = []
        for item_id in self.tree_view.get_children():
            # Check if the row is checked (this assumes a custom tag 'checked' or similar is used)
            checked = self.tree_view.tag_has('checked', item_id)

            if checked:
                # Get the values from each row that is checked in the treeview
                row_data = self.tree_view.item(item_id)['values']
                rows.append(row_data)

        # Write the data to a CSV file at the selected file path
        with open(file_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            # Get the headers (column names) from the treeview
            headers = [self.tree_view.heading(col)['text'] for col in self.tree_view["columns"]]
            writer.writerow(headers)

            # Write each row of data
            for row in rows:
                writer.writerow(row)

        messagebox.showinfo("File Saved", f"CSV file saved successfully to:\n{file_path}")
        return

    def save_ods(self):
        # Open file dialog to select file path for saving the CSV
        file_path = filedialog.asksaveasfilename(
            defaultextension=".ods",
            filetypes=[("ODS files", "*.ods"), ("All files", "*.*")]
        )

        if not file_path:  # If the user cancels the file dialog, do nothing
            return

        # Extract data from the tree view
        rows = []
        for item_id in self.tree_view.get_children():
            # Check if the row is checked (this assumes a custom tag 'checked' or similar is used)
            checked = self.tree_view.tag_has('checked', item_id)

            if checked:
                # Get the values from each row that is checked in the treeview
                row_data = self.tree_view.item(item_id)['values']
                rows.append(row_data)

        headers = [self.tree_view.heading(col)['text'] for col in self.tree_view["columns"]]

        # write ODS file
        data = OrderedDict()

        sheet_data = [headers]
        for row in rows:
            sheet_data.append(row)

        data.update({"sheet 1": sheet_data})
        save_data(file_path, data)

        messagebox.showinfo("File Saved", f"ODS file saved successfully to:\n{file_path}")
        return
