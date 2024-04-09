from sys import platform
import os
import os.path
import tkinter as tk
print(tk.__path__)
from tkinter import ttk
from AnimalTrakkerUtilities import config
from AnimalTrakkerDatabase.DatabaseUtilities import file_picker
from AnimalTrakkerUtilities.GeneralUtilities import DoNothing
def current_dir(file_dir=""):
	return os.getcwd().replace("\\", "/") + file_dir

def dictionary_factory(cursor, row):
	config.generaldefaults = {}
	for idx, col in enumerate(cursor.description):
		config.generaldefaults[col[0]] = row[idx]
		print(col[0], row[idx])
	return config.generaldefaults
class FarmDesktopApp(tk.Tk):
	def __init__(self, *args, **kwargs):
		# if platform == 'darwin':
		# 	from Foundation import NSBundle
		# 	from AppKit import NSBundle
		# 	bundle = NSBundle.mainBundle()
		# 	if bundle:
		# 		info = bundle.localizedInfoDictionary() or bundle.infoDictionary()
		# 		if info and info['CFBundleName'] == 'Python':
		# 			info['CFBundleName'] = "AnimalTrakker"
		tk.Tk.__init__(self, *args, **kwargs)
		my_style = ttk.Style()
		my_style.theme_use('default')
		if platform == 'darwin':
			my_style.theme_use('aqua')
		config.currentdatabase = file_picker(config.currentdatabase)
		print(config.currentdatabase)
		config.generaldefaults = {}
		connection = sqlite3.connect(config.currentdatabase)
		defaultscursor = connection.cursor()
		defaultscursor.execute(GET_ALL_GENERAL_DEFAULTS)
		config.generaldefaults = [dict(line) for line in
								  [zip([column[0] for column in defaultscursor.description], row) for row in
								   defaultscursor.fetchall()]][0]
		connection.close()
		# create toolbar
		mainmenu = tk.Menu(self)
		appMenu = tk.Menu(mainmenu, name='apple')
		mainmenu.add_cascade(menu=appMenu)
		#todo Add the screens for the about and menu items
		appMenu.add_command(label='About AnimalTrakker', command=lambda: DoNothing())
		appMenu.add_separator()
		self['menu'] = mainmenu
		helpMenu = tk.Menu(mainmenu)
		mainmenu.add_cascade(label="Help", menu=helpMenu)
		helpMenu.add_command(label="Help", command=lambda: DoNothing())
		helpMenu.add_command(label="Release Notes", command=lambda: DoNothing())
		helpMenu.add_command(label="GitLab Source Code", command=lambda: DoNothing())
		helpMenu.add_command(label="Contact Us", command=lambda: DoNothing())

		self.geometry("1024x768+0+0")
		self.title("AnimalTrakker Bull Test")
		self.grid()

		container = tk.Frame(self)
		container.pack(side="top", fill="both", expand=True)
		container.grid_rowconfigure(0, weight=1)
		container.grid_columnconfigure(0, weight=1)

		self.frames = dict()
		# Add each separate screen here. The name is the class for that screen
		trakker_classes = (BullTestAppTopScreen
						   , BullTestContactSearchScreen, BullTestContactAddScreen
						   , BullTestAnimalSearchScreen, BullTestAnimalAddScreen
						   , BullTestCSVReportScreen, BullTestCOLabSubmissionScreen
						   , BullTestReportDefaultsScreen, BullTestGeneralDefaultsScreen)
		for F in trakker_classes:
			page_name = F.__name__
			frame = F(parent=container, controller=self)
			self.frames[page_name] = frame
			frame.grid(row=0, column=0, sticky="nsew")
			self.show_frame("BullTestAppTopScreen")
		# self.show_frame("BullTestAppTopScreen")

	def show_frame(self, page_name):
		# Show a frame for the given page name
		frame = self.frames[page_name]
		frame.tkraise()


if __name__ == "__main__":
	app = FarmDesktopApp()
	app.mainloop()
