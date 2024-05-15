import tkinter as tk
from AnimalTrakker_FarmDesktop.FarmDesktop_UserInterface.FarmDesktop_Widgets import SearchWidget
from AnimalTrakker_Shared.Shared_MainFrame import MainFrame

class FarmDesktopMainFrame(MainFrame):
    def __init__(self, parent, style_manager, **kwargs):
        super().__init__(parent, style_manager, **kwargs)

    def show_search_widget(self):
        """
        Displays the SearchWidget in the main content area.
        """
        self.update_content(SearchWidget)
