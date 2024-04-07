import tkinter as tk
from UserInterface.RegistryAppTopScreen import RegistryAppTopScreen


class RegistryApp(tk.Tk):
    """Main application class for RegistryApp."""

    def __init__(self):

        super().__init__()
        self.tw = RegistryAppTopScreen(self)

def main():
    """Entry point of the application."""
    app = RegistryApp()
    app.mainloop()

if __name__ == "__main__":
    main()
