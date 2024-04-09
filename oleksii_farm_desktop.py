import tkinter as tk
from UserInterface.FarmDesktopAppTopScreen import FarmDesktopAppTopScreen


class FarmDesktopApp(tk.Tk):
    """Main application class for FarmDesktopApp."""

    def __init__(self):

        super().__init__()
        self.tw = FarmDesktopAppTopScreen(self)

def main():
    """Entry point of the application."""
    app = FarmDesktopApp()
    app.mainloop()

if __name__ == "__main__":
    main()
