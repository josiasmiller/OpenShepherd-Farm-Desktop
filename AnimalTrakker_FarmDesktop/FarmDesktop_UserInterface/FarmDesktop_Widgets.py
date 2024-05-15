import tkinter as tk
from tkinter import ttk, messagebox
from AnimalTrakker_Shared.Shared_Logging import get_logger

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
        choice = self.choice_var.get()
        logger.info('Edit default setting button was clicked')
        #self.controller.edit_default_setting(choice)
        
class SettingWidget(tk.Frame):
    """
    A widget that sets general defaults for the application.

    Attributes:
        parent (tk.Widget): The parent widget, which is typically a frame or another Tkinter container.
        style_manager (StyleManager): The style manager instance that provides style configurations.
    """
    
    def __init__(self, parent, style_manager, db_connection, **kwargs):
        """
        Initialize the GeneralDefaultsWidget with a parent and a style manager.

        Args:
            parent (tk.Widget): The parent widget.
            style_manager (StyleManager): The style manager to use for retrieving styles.
            db_connection (DatabaseConnection): The database connection instance.
            **kwargs: Additional keyword arguments for the Frame constructor.
        """
        self.style_manager = style_manager
        self.db_connection = db_connection
        bg_color = self.style_manager.get_bg('main_frame')
        super().__init__(parent, bg=bg_color, **kwargs)

        # Initialize UI components
        self.init_ui()

    def init_ui(self):
        """
        Initializes the user interface components of the GeneralDefaultsWidget.
        """
        # Title Label
        label = tk.Label(self, text="Set General Defaults", bg=self['bg'])
        label.pack(pady=(5, 0))

        # Dropdown Menu for Default Settings
        self.default_settings_var = tk.StringVar(self)
        self.default_settings_combobox = ttk.Combobox(self, textvariable=self.default_settings_var, state="readonly")
        self.default_settings_combobox.pack(pady=10)

        # Fetch Default Settings from Database
        self.fetch_default_settings()

        # Confirm Button
        self.confirm_button = tk.Button(self, text="Confirm", command=self.load_default_setting)
        self.confirm_button.pack(pady=5)

        # Frame for Default Settings Details
        self.settings_frame = tk.Frame(self, bg=self['bg'])
        self.settings_frame.pack(fill='both', expand=True, padx=10, pady=10)

        # Save Button
        self.save_button = tk.Button(self, text="Save Changes", command=self.save_changes)
        self.save_button.pack(pady=5)

    def fetch_default_settings(self):
        """
        Fetches default settings from the database and populates the dropdown menu.
        """
        settings = self.db_connection.fetchall(GET_DEFAULT_SETTINGS_NAMES)
        settings_names = [setting[0] for setting in settings]
        self.default_settings_combobox['values'] = settings_names
        if settings_names:
            self.default_settings_combobox.current(0)
        else:
            messagebox.showerror("Error", "No default settings found in the database.")

    def load_default_setting(self):
        """
        Loads the selected default setting's details and displays them in the settings frame.
        """
        selected_setting = self.default_settings_var.get()
        setting_data = self.db_connection.fetchone(GET_DEFAULT_SETTING_DETAILS, (selected_setting,))
        
        # Clear previous settings
        for widget in self.settings_frame.winfo_children():
            widget.destroy()

        if setting_data:
            self.display_setting_data(setting_data)
        else:
            messagebox.showerror("Error", "Selected setting not found.")

    def display_setting_data(self, data):
        """
        Displays the default setting data in the settings frame.

        Args:
            data (tuple): The data of the default setting.
        """
        columns = ["id_animaltrakkerdefaultsettingsid", "default_settings_name", "owner_id_contactid", "owner_id_companyid",
                   "owner_id_premiseid", "breeder_id_contactid", "breeder_id_companyid", "breeder_id_premiseid", 
                   "vet_id_contactid", "vet_id_premiseid", "lab_id_companyid", "lab_id_premiseid", 
                   "id_registry_id_companyid", "registry_id_premiseid", "id_stateid", "id_countyid", 
                   "id_flockprefixid", "id_speciesid", "id_breedid", "id_sexid", "id_idtypeid_primary", 
                   "id_idtypeid_secondary", "id_idtypeid_tertiary", "id_eid_tag_male_color_female_color_same",
                   "eid_tag_color_male", "eid_tag_color_female", "eid_tag_location", "id_farm_tag_male_color_female_color_same",
                   "farm_tag_based_on_eid_tag", "farm_tag_number_digits_from_eid", "farm_tag_color_male", 
                   "farm_tag_color_female", "farm_tag_location", "id_fed_tag_male_color_female_color_same", 
                   "fed_tag_color_male", "fed_tag_color_female", "fed_tag_location", "id_nues_tag_male_color_female_color_same",
                   "nues_tag_color_male", "nues_tag_color_female", "nues_tag_location", "id_trich_tag_male_color_female_color_same",
                   "trich_tag_color_male", "trich_tag_color_female", "trich_tag_location", "trich_tag_auto_increment", 
                   "trich_tag_next_tag_number", "id_bangs_tag_male_color_female_color_same", "bangs_tag_color_male", 
                   "bangs_tag_color_female", "bangs_tag_location", "id_sale_order_tag_male_color_female_color_same", 
                   "sale_order_tag_color_male", "sale_order_tag_color_female", "sale_order_tag_location", "use_paint_marks",
                   "paint_mark_color", "paint_mark_location", "tattoo_color", "tattoo_location", "freeze_brand_location",
                   "id_idremovereasonid", "id_tissuesampletypeid", "id_tissuetestid", "id_tissuesamplecontainertypeid",
                   "birth_type", "rear_type", "minimum_birth_weight", "maximum_birth_weight", "birth_weight_id_unitsid",
                   "weight_id_unitsid", "sale_price_id_unitsid", "evaluation_update_alert", "death_reason_id_contactid",
                   "death_reason_id_companyid", "id_deathreasonid", "transfer_reason_id_contactid", "transfer_reason_id_companyid",
                   "id_transferreasonid", "user_system_serial_number", "created", "modified"]

        self.setting_vars = {}
        for i, column in enumerate(columns):
            label = tk.Label(self.settings_frame, text=column.replace('_', ' ').title() + ':', bg=self['bg'])
            label.grid(row=i, column=0, sticky='e', padx=5, pady=2)

            var = tk.StringVar(value=str(data[i]))
            entry = tk.Entry(self.settings_frame, textvariable=var)
            entry.grid(row=i, column=1, sticky='ew', padx=5, pady=2)
            self.setting_vars[column] = var

    def save_changes(self):
        """
        Saves the changes made to the default setting back to the database.
        """
        selected_setting = self.default_settings_var.get()

        # Prepare data for update
        update_data = [var.get() for var in self.setting_vars.values()]
        update_data.append(selected_setting)  # Append the setting name for the WHERE clause

        # Update the database
        self.db_connection.connection.execute(UPDATE_DEFAULT_SETTING_DETAILS, update_data)
        self.db_connection.connection.commit()
        messagebox.showinfo("Success", "Changes saved successfully.")
