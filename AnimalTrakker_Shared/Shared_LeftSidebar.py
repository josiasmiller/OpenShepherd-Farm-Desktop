import tkinter as tk
from tkinter import ttk
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class LeftSidebar(tk.Frame):
    """
    A sidebar component that handles displaying a navigational tree structure and handling user interactions
    with these elements.

    Attributes:
        parent (tk.Widget): The parent widget, typically a tk.Frame or tk.Tk instance.
        sidebar_title (str): The title displayed at the top of the sidebar.
        tree_structure (list): A list of dictionaries representing the hierarchical structure of the sidebar items.
        controller (object): The controller object that handles business logic in response to sidebar interactions.
    """
    
    def __init__(self, parent, style_manager, sidebar_title, tree_structure, controller, bg='default', **kwargs):
        """
        Initializes the LeftSidebar with necessary properties and begins the UI setup.

        Args:
            parent (tk.Widget): The parent widget.
            sidebar_title (str): The title to be displayed at the top of the sidebar.
            tree_structure (list): A structured list of items to be displayed in the tree view.
            controller (object): The controller that manages user interactions.
            **kwargs: Additional keyword arguments passed to the tk.Frame superclass.
        """
        super().__init__(parent, bg=bg, **kwargs)
        self.controller = controller
        self.sidebar_title = sidebar_title
        self.tree_structure = tree_structure
        self.style_manager = style_manager
        self.current_widget = None  # Initialize current_widget
        self.init_ui(bg)

    def init_ui(self, bg):
        """
        Sets up the user interface of the sidebar, including the label and treeview components.
        Args:
            bg (str): The background color to use for the UI components in the sidebar.
        """
        # Label at the top of the sidebar, serving as a heading.
        self.home_label = tk.Label(self, text=self.sidebar_title, bg=bg)
        self.home_label.pack(fill='x')
        
        self.content_frame = tk.Frame(self, bg=bg)
        self.content_frame.pack(expand=True, fill='both')

        # Treeview widget for displaying the hierarchical structure of sidebar items.
        self.treeview = ttk.Treeview(self.content_frame, show="tree")
        self.treeview.pack(expand=True, fill='both', padx=0, pady=0)

        # Populate the Treeview with predefined structure.
        self.populate_treeview()

        # Bind the click event on Treeview items to an event handler.
        self.treeview.bind("<ButtonRelease-1>", self.on_click)

    def populate_treeview(self):
        """
        Populates the treeview widget with nodes specified in the tree_structure attribute.
        """
        # Clear existing content
        self.clear_content_frame()

        # Re-initialize the Treeview widget
        self.treeview = ttk.Treeview(self.content_frame, show="tree")
        self.treeview.pack(expand=True, fill='both', padx=0, pady=0)
        self.treeview.bind("<ButtonRelease-1>", self.on_click)

        # Iterate over the structured list to insert each item into the Treeview.
        for node in self.tree_structure:
            self.treeview.insert(node['parent'], node['index'], node['iid'], text=node['text'])
            # Insert children of the current node if any exist.
            if 'children' in node:
                for child in node['children']:
                    self.treeview.insert(node['iid'], 'end', text=child['text'])

    def on_click(self, event):
        """
        Handles click events on the treeview items, passing the item identifier and text to the controller.

        Args:
            event: The event data which includes details of the mouse button release.
        """
        selected_item = self.treeview.selection()
        if selected_item:
            item_id = selected_item[0]
            item_text = self.treeview.item(item_id, "text")
            # Notify the controller about the sidebar click with the item id and text.
            self.controller.handle_sidebar_click(item_id, item_text)
        else:
            # Notify the controller that there was a click but no item was selected.
            self.controller.handle_sidebar_click(None, None)

    def clear_content_frame(self):
        """
        Clears all widgets from the content frame.
        """
        for widget in self.content_frame.winfo_children():
            widget.destroy()
        self.current_widget = None

    def update_treeview(self, new_tree_structure):
        """
        Updates the sidebar with new tree structure data.

        Args:
            new_tree_structure (list): A new list of dictionaries representing the hierarchical structure to update the sidebar.
        """
        self.tree_structure = new_tree_structure  # Update the internal tree structure
        self.populate_treeview()  # Re-populate the treeview with new data
        logger.info("Sidebar updated with new data")
        
    def switch_to_widget(self, widget_class, *args, **kwargs):
        self.clear_content_frame()
        widget = widget_class(self.content_frame, *args, **kwargs)
        widget.pack(expand=True, fill='both')

    def update_content(self, widget_class, *args, **kwargs):
        """
        Updates the content of the LeftSidebar with a new widget.

        Args:
            widget_class (class): The widget class to instantiate and display.
            *args: Positional arguments to pass to the widget class constructor.
            **kwargs: Keyword arguments to pass to the widget class constructor.
        """
        logger.info(f"Updating sidebar content to {widget_class.__name__}")
        self.clear_content_frame()

        try:
            self.current_widget = widget_class(self.content_frame, *args, **kwargs)
            self.current_widget.pack(fill=tk.BOTH, expand=True)
            logger.info(f"Widget {widget_class.__name__} added and packed.")
        except Exception as e:
            logger.error(f"Failed to initialize or pack widget {widget_class.__name__}: {str(e)}")
