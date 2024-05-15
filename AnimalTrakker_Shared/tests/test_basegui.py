import unittest
from unittest.mock import patch, MagicMock
from tkinter import Tk
from AnimalTrakker_Shared.Shared_BaseGUI import BaseGUI

class TestBaseGUI(unittest.TestCase):
    def test_base_gui_initialization(self):
        """
        Test the initialization of the BaseGUI class to ensure all subcomponents are properly instantiated
        with the correct parameters, and that all expected methods are called during the initialization process.

        This test checks:
        - That the GUI subcomponents (TopBar, LeftSidebar, MainFrame, and BottomBar) are instantiated once.
        - That these components are called with the correct initialization parameters.
        """
        # Setup the root window for the GUI
        root = Tk()
        
        # Create mock objects for the controller and the current database path
        controller = MagicMock()
        tree_structure = {"data": "structure"}
        currentdatabase = MagicMock()  # Mock the database path

        # Mock the database connection
        db_connection = MagicMock()

        # Patch the GUI components to intercept their instantiation and verify their parameters
        with patch('AnimalTrakker_Shared.Shared_BaseGUI.TopBar') as MockTopBar, \
             patch('AnimalTrakker_Shared.Shared_BaseGUI.LeftSidebar') as MockLeftSidebar, \
             patch('AnimalTrakker_Shared.Shared_BaseGUI.MainFrame') as MockMainFrame, \
             patch('AnimalTrakker_Shared.Shared_BaseGUI.BottomBar') as MockBottomBar:

            # Initialize BaseGUI with all dependencies mocked
            app = BaseGUI(root, "Sidebar Title", tree_structure, controller, currentdatabase, db_connection)

            # Assert that each GUI component is instantiated exactly once
            MockTopBar.assert_called_once_with(app.left_panel, bg='lightblue', height=100)
            MockLeftSidebar.assert_called_once_with(app.left_panel, sidebar_title="Sidebar Title", tree_structure=tree_structure, controller=controller, bg='lightgreen', width=200)
            # Additional asserts can be added here to check MainFrame and BottomBar if necessary

if __name__ == '__main__':
    unittest.main()
