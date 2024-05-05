import unittest
from unittest.mock import patch, MagicMock
from AnimalTrakker_Shared.Shared_BaseController import BaseController

class TestBaseController(unittest.TestCase):
    @patch('AnimalTrakker_Shared.Shared_BaseController.logger')  # Patch the logger to verify logging calls
    def test_handle_common_click_quit(self, mock_logger):
        """
        Test the handle_common_click method to ensure it properly identifies common actions and triggers
        the correct response, specifically checking if the 'quit_application' method is called when the
        'quitanimaltrakker' item is clicked.
        """
        # Instantiate the controller
        controller = BaseController()

        # Mock the quit_application method to check its invocation later
        controller.quit_application = MagicMock(name='quit_application')

        # The item identifier and its corresponding text
        item_id = 'quitanimaltrakker'
        item_text = 'Quit AnimalTrakker'  # This is a hypothetical text associated with the item

        # Call the method under test with the mock item id and text
        controller.handle_common_click(item_id, item_text)

        # Assert that the logger was correctly called with the expected message
        mock_logger.info.assert_called_once_with(f"Common item clicked: {item_text}")

        # Assert that the quit_application method was called once, as this is the action associated with 'quitanimaltrakker'
        controller.quit_application.assert_called_once()

if __name__ == '__main__':
    unittest.main()
