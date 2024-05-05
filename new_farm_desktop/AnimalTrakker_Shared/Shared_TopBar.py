import tkinter as tk
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class TopBar(tk.Frame):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, **kwargs)
        self.init_ui()

    def init_ui(self):
        self.home_button = tk.Button(self, text="Home", command=self.on_home_click)
        self.home_button.pack(side=tk.LEFT, padx=10, pady=10)

    def on_home_click(self):
        logger.info("Home button clicked")
