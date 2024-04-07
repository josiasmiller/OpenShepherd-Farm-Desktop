import tkinter as tk
from tkinter import messagebox


def DoNothing():
	tk.messagebox.showinfo(message='This is an info box that Does Nothing')
	print("testing do nothing dialog")


def aboutanimaltrakker():
	# main_screen.wm_attributes("-topmost", 1)
	tk.messagebox.showinfo("About", "AnimalTrakker Farm Desktop Version 0.1.1\nJanuary 2024\nCopyright 2020-2024 Weyr Associates, LLC")


def releasenotes():
	tk.messagebox.showinfo("Release Notes", "AnimalTrakker Release notes\n\nFixed\nAdded\nInitial release")


def GoHome(root):
	print("you clicked on the top home button")
	root.deiconify()
	root.update()