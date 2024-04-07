import tkinter as tk
from tkinter import filedialog
import os

def file_picker(currentdatabase):
	database_file = tk.filedialog.askopenfilename(filetypes=[("SQLite files", "*.sqlite")])
	print("The database file is " + database_file)
	return database_file


def current_dir(file_dir=""):
    return