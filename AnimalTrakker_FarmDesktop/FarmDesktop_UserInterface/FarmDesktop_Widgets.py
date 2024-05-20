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

class LeftSidebarChoiceWidget(tk.Frame):
    def __init__(self, parent, choices, choice_type, controller, style_manager, **kwargs):
        # Get the background color from the style manager
        bg_color = style_manager.get_bg('sidebar')
        super().__init__(parent, bg=bg_color, **kwargs)
        logger.info(f"LeftSidebarChoiceWidget initialized with choices: {choices} and type: {choice_type}")
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

class EditPopup(tk.Toplevel):
    def __init__(self, parent, key, current_id, fetch_function, style_manager):
        """
        Initialize the EditPopup.

        Args:
            parent (tk.Widget): The parent widget.
            key (str): The key of the setting being edited.
            current_id (int): The current ID of the setting.
            fetch_function (callable): The function to fetch options for the setting.
            style_manager (StyleManager): An instance of StyleManager for styling.
        """
        super().__init__(parent)
        self.parent = parent
        self.key = key
        self.current_id = current_id
        self.fetch_function = fetch_function
        self.style_manager = style_manager
        self.build_widget()
        self.center_popup()

    def build_widget(self):
        """
        Build the popup widget.

        This method creates the layout of the popup, including the listbox, scrollbar, and update button.
        """
        self.title(f"Edit {self.key}")
        self.geometry("400x300")
        self.configure(bg=self.style_manager.get_bg('main_frame'))

        label = tk.Label(self, text=self.key, bg=self.style_manager.get_bg('main_frame'))
        label.pack(pady=10)

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

        update_button = tk.Button(self, text="Update", command=self.update_changes)
        update_button.pack(pady=10)

        # Prevent main frame from scrolling when popup is open
        self.bind("<MouseWheel>", self.on_mousewheel)

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
        Update the changes made in the listbox and pass them to the parent widget.
        """
        selected_index = self.listbox.curselection()
        if selected_index:
            selected_id = self.ids[selected_index[0]]
            self.parent.update_data_field(self.key, selected_id)
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
            label = tk.Label(self.internal_frame, text=key, bg=self['bg'])
            label.grid(row=row, column=0, padx=5, pady=5, sticky="w")

            display_value, fetch_function = self.get_display_value_and_function(key, value)
            if fetch_function:
                value_label = tk.Label(self.internal_frame, text=display_value, bg=self['bg'])
                value_label.grid(row=row, column=1, padx=5, pady=5, sticky="w")
                edit_button = tk.Button(self.internal_frame, text="Edit", command=lambda k=key, v=value, f=fetch_function: self.open_edit_popup(k, v, f))
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
        if self.data_type == "setting":
            if key == 'id_speciesid':
                fetch_function = fetch_species_names
            elif key == 'id_breedid':
                fetch_function = fetch_breed_names
            elif key == 'id_stateid':
                fetch_function = fetch_state_names
            elif key == 'id_countyid':
                fetch_function = fetch_county_names
        elif self.data_type == "evaluation":
            pass
            """if key.startswith('trait_name'):
                fetch_function = fetch_trait_names
            elif key.startswith('trait_units'):
                fetch_function = fetch_units_names"""

        display_value = self.get_name_by_id(fetch_function(self.db_connection), value) if fetch_function else value
        return display_value, fetch_function

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

    def open_edit_popup(self, key, value, fetch_function):
        """
        Open the edit popup for a specific data field.

        Args:
            key (str): The key of the data field to edit.
            value (str): The current value of the data field.
            fetch_function (callable): The function to fetch options for the data field.
        """
        popup = EditPopup(self, key, value, fetch_function, self.style_manager)
        popup.grab_set()  # Ensure all events are sent to the popup until it is destroyed

    def update_data_field(self, key, new_value):
        """
        Update the data field value in the main widget.

        Args:
            key (str): The key of the data field to update.
            new_value (int): The new value for the data field.
        """
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
        
class CreateNewSettingWidget(tk.Frame):
    """
    A widget for creating a new setting.

    This widget prompts the user to enter a name for the new setting and confirm the creation.

    Attributes:
        parent (tk.Widget): The parent widget.
        style_manager (StyleManager): An instance of StyleManager for styling.
        controller (object): The controller handling the logic.
    """
    def __init__(self, parent, style_manager, controller, **kwargs):
        """
        Initialize the CreateNewSettingWidget.

        Args:
            parent (tk.Widget): The parent widget.
            style_manager (StyleManager): An instance of StyleManager for styling.
            controller (object): The controller handling the logic.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        super().__init__(parent, bg=style_manager.get_bg('main_frame'), **kwargs)
        self.style_manager = style_manager
        self.controller = controller

        self.build_widget()
        self.bind('<Map>', self.on_map)  # Bind to the <Map> event

    def build_widget(self):
        """
        Build the widget with input field and confirm button.
        """
        # Create a title label
        title_label = tk.Label(self, text="Create New Setting", font=('Helvetica', 16, 'bold'), bg=self['bg'])
        title_label.pack(pady=10)

        # Create input field for setting name
        self.name_var = tk.StringVar()
        name_label = tk.Label(self, text="Enter setting name:", bg=self['bg'])
        name_label.pack(pady=5)
        self.name_entry = tk.Entry(self, textvariable=self.name_var)
        self.name_entry.pack(pady=5)
        self.name_entry.config(state=tk.NORMAL)  # Ensure the entry is in normal state

        # Create confirm button
        confirm_button = tk.Button(self, text="Confirm", command=self.confirm_creation)
        confirm_button.pack(pady=10)
        
        # Create note label
        note_label = tk.Label(self, text="Note: Add function to copy setting from existing setting entry?", bg=self['bg'])
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
        Handle the confirmation of the new setting creation.
        """
        new_setting_name = self.name_var.get()
        logger.info(f'Confirm new setting creation button was clicked with name: {new_setting_name}')
        self.controller.confirm_new_setting_creation(new_setting_name)
