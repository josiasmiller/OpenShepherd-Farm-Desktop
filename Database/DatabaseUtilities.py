import tkinter as tk
from tkinter import filedialog
import os

def file_picker():
	database_file = tk.filedialog.askopenfilename(title="Open Database",
                                               filetypes=[("SQLite files", "*.sqlite"), ("Database Files", "*.db"), ("All Files", "*.*")])
	print("The database file is " + database_file)
	return database_file

def current_dir(file_dir: str = "") -> str:
    """Return the current working directory with an optional subdirectory.

    Args:
    file_dir (str): The subdirectory to append to the current working directory.

    Returns:
    str: The absolute path of the current directory joined with 'file_dir'.
    """
    return str(Path.cwd() / file_dir)