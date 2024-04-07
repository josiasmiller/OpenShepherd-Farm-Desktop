import tkinter as tk
from tkinter import messagebox
from tkinter import ttk

def DoNothing():
	tk.messagebox.showinfo(message='This is an info box that Does Nothing')
	print("testing do nothing dialog")


def aboutanimaltrakker():
	# main_screen.wm_attributes("-topmost", 1)
	tk.messagebox.showinfo("About", "AnimalTrakker Version 0.0.1\nJanuary 2022\nCopyright 2020-2022 Weyr Associates, LLC")


def releasenotes():
	tk.messagebox.showinfo("Release Notes", "AnimalTrakker Release notes\n\nFixed\nAdded\nGot main screen working")


def GoHome(root):
	print("you clicked on the top home button")
	#	Add in all the other screens to hide them here
	# AnimalTrakkerUI.animal_search_screen.withdraw()
	# AnimalTrakkerUI.animal_add_edit_screen.withdraw()
	# AnimalTrakkerUI.animal_reports_screen.withdraw()
	# AnimalTrakkerUI.member_search_screen.withdraw()
	# AnimalTrakkerUI.member_add_edit_screen.withdraw()
	# AnimalTrakkerUI.member_reports_screen.withdraw()
	# Bring up the main screen again for further input
	# print("before root deiconify in GoHome")
	root.deiconify()
	root.update()