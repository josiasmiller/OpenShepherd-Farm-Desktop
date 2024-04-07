import tkinter as tk
from tkinter import ttk
from tkinter import filedialog

import customtkinter as ctk

from pathlib import Path
from PIL import Image, ImageTk

from Utilities.GeneralUtilities import *
from Database.DatabaseUtilities import file_picker
from Reports.PDFManager import PedigreePDFManager
from Database.AnimalTrakker_Query_Defs import update_printed_status

from .TopScreenHandlers import handle_print_pedigree
from .TopScreenUtilities import fetch_animal_pedigree_data, fetch_animal_aditional_data

"""Overall naming conventions:
    _method_name - method which is supposed to be only used internally (for creating interface automatically)
    MethodName - methods related to functionality of tkinter
    method_name - methods which are supposed to be used by the user, probably will be put into separated file as utilities in the future
    
    ***Note: right now there are couple of method_names which are tkinter related. Need to work on renaming
"""

ctk.set_appearance_mode("light")

class FarmDesktopAppTopScreen(ctk.CTkFrame):
    def __init__(self, root):
        super().__init__(root)
        self.root = root
        self.root.title("Fram Desktop App")
        self.root.geometry("1024x768")

        self._topscreen_setup()  # Setup the top screen before others
        self._menu_setup()  # Setup the menu
        self._leftsidebar_setup()  # Setup the left sidebar
        self._central_frame_setup()  # Setup the central frame
        self.root.grid_rowconfigure(1, weight=1)
        self.root.grid_columnconfigure(1, weight=1)
        self.output_directory = None
        self.input_pdf_template = None
        self.currentdatabase = file_picker()
        
        self.GoHomeBtn()
    
    def update_current_database(self):
        """Open a dialog to select a database file and update the current database."""
        file_path = file_picker()
        if file_path:
            self.currentdatabase = file_path
            print(f"Database updated to: {self.currentdatabase}")  # For debugging, remove or adjust as needed.
       
    # Selecting pdf file for the input template     
    def select_input_template_file(self):
        """
        Use the existing Tkinter instance to prompt for an input file, avoiding creating new Tk instances.
        """
        input_pdf_path = filedialog.askopenfilename(title="Select Input PDF Template", filetypes=[("PDF files", "*.pdf")])
        if input_pdf_path:
            self.input_pdf_template = input_pdf_path
            print(f"Selected template: {self.input_pdf_template}")
    
    # Select directory where to save created pdfs
    def select_output_dir(self):
        # Open the dialog to choose a directory
        directory = filedialog.askdirectory()
        if directory:  # Make sure the user didn't cancel the dialog
            self.output_directory = directory
            print(f"Selected directory: {self.output_directory}")
    
    # Setting up top screen
    def _topscreen_setup(self):
        """
        Setup the top screen. This frame will be used to place the home button at the top of the window.
        """
        # Using 'height=10' and 'bg' for visual design, might need to adjust based on actual content
        self.topscreen = ctk.CTkFrame(self.root, height=100, fg_color="white")  # Adjusted height here
        self.topscreen.grid(row=0, column=0, columnspan=1, sticky="ew")
        self.topscreen.grid_propagate(False)  # Prevents the frame from resizing to fit its content

        # Adding a Home button to the top screen, aligned to the left
        self.home_button = ctk.CTkButton(self.topscreen, fg_color="#09b1be", text="Home", command=self.GoHomeBtn)
        self.home_button.pack(side='top', padx=10, pady=5)  # Adjust padding as needed
        
    # Setting up menu
    def _menu_setup(self):
        mainmenu = tk.Menu(self.root)
        appMenu = tk.Menu(mainmenu, name='apple')
        mainmenu.add_cascade(menu=appMenu)
        appMenu.add_command(label='About AnimalTrakker', command=aboutanimaltrakker)
        appMenu.add_separator()
        
        fileMenu = tk.Menu(mainmenu)
        mainmenu.add_cascade(label="File", menu=fileMenu)
        fileMenu.add_command(label="Open Database", command=self.update_current_database)
        #fileMenu.add_command(label="New Database", command=DoNothing)
        
        helpMenu = tk.Menu(mainmenu)
        mainmenu.add_cascade(label="Help", menu=helpMenu)
        helpMenu.add_command(label="Help", command=DoNothing)
        helpMenu.add_command(label="Release Notes", command=releasenotes)
        helpMenu.add_command(label="GitLab Source Code", command=DoNothing)
        helpMenu.add_command(label="Contact Us", command=DoNothing)

        self.root.config(menu=mainmenu)  # Use self.root.config to set the menu
        
    # Setting up left sidebar
    def _leftsidebar_setup(self):
        self.leftsidebar = ctk.CTkFrame(self.root, width=200, fg_color="white")
        self.leftsidebar.grid(row=1, column=0, rowspan=8, sticky=("NSEW"))

        self.home_label = ctk.CTkLabel(self.leftsidebar, text="AnimalTrakker Farm Desktop")
        self.home_label.grid(row=0, column=0)
        
        style = ttk.Style(self.leftsidebar)
        style.theme_use("classic")  # or another theme that fits well with ctk
        style.configure("Treeview", background="white",
                        foreground="black")
        style.map('Treeview', background=[('selected', '#09b1be')])
        # Configure more Treeview and Treeview.Item styles if needed
        
        self.leftsidebar_treeview = ttk.Treeview(self.leftsidebar, height=100, show="tree")
        self.leftsidebar_treeview.grid(row=1, rowspan=4, column=0)
        self._populate_leftsidebar_treeview()

    # Setting up central frame
    def _central_frame_setup(self):
        self.central_frame = tk.Frame(self.root, borderwidth=2, bg='white')
        self.central_frame.grid(row=0, column=1, rowspan=8, sticky=("NSEW"))

    def _populate_leftsidebar_treeview(self):
        # Inserting main categories and subcategories
        self.leftsidebar_treeview.insert('', 0, 'animals', text='Setup')
        self.leftsidebar_treeview.insert('animals', 'end', 'animalsearch', text='Animal Search')
        self.leftsidebar_treeview.insert('animals', 'end', 'animaladd', text='Add/Edit Animal')
        self.leftsidebar_treeview.insert('animals', 'end', 'animalwebentry', text='Process Web Entries')
        self.leftsidebar_treeview.insert('animals', 'end', 'animalreports', text='Animal Reports')
        self.leftsidebar_treeview.insert('animals', 'end', 'animaldeaths', text='Animal Deaths')
        self.leftsidebar_treeview.insert('animals', 'end', 'animaltransfers', text='Animal Transfers')

        self.leftsidebar_treeview.insert('', 1, 'members', text='Animal/EID Management')
        self.leftsidebar_treeview.insert('members', 'end', 'membersearch', text='Member Search')
        self.leftsidebar_treeview.insert('members', 'end', 'memberreports', text='Member Reports')
        self.leftsidebar_treeview.insert('members', 'end', 'memberadd', text='Add/Edit Member')

        self.leftsidebar_treeview.insert('', 2, 'registryreports', text='Animal Evaluation')
        self.leftsidebar_treeview.insert('registryreports', 'end', 'printpedigree', text='Print Pedigree Certificate')
        
        self.leftsidebar_treeview.insert('', 3, 'flockherdbook', text='Animal Care/Vet')
        self.leftsidebar_treeview.insert('flockherdbook', 'end', 'printregistrations', text='Print Registrations')
        self.leftsidebar_treeview.insert('flockherdbook', 'end', 'printtransfers', text='Print Transfers')
        self.leftsidebar_treeview.insert('flockherdbook', 'end', 'printmembers', text='Print Members')
        self.leftsidebar_treeview.insert('flockherdbook', 'end', 'printprefix', text='Print Prefixes')

        self.leftsidebar_treeview.insert('', 4, 'populationanalysis', text='Birthing')
        self.leftsidebar_treeview.insert('populationanalysis', 'end', 'definefounders', text='Define Founders')
        self.leftsidebar_treeview.insert('populationanalysis', 'end', 'calculateinbreeding', text='Calculate Inbreeding')
        self.leftsidebar_treeview.insert('populationanalysis', 'end', 'calculatebloodlines', text='Calculate Bloodlines')

        self.leftsidebar_treeview.insert('', 5, 'animalmovements', text='Animal Movements')
        
        self.leftsidebar_treeview.insert('', 6, 'animalhistory', text='Animal History')
        
        self.leftsidebar_treeview.insert('', 7, 'databasemanagement', text='Database Management')
        
        self.leftsidebar_treeview.insert('', 8, 'quit', text='Quit')

        # Bind the double-click event to a handler
        self.leftsidebar_treeview.bind("<Double-1>", self.OnDoubleClickLeftSidebar)

    # Clearing central frame, so I can put in another widget
    def clear_central_frame(self):
        for widget in self.central_frame.winfo_children():
            widget.destroy()

    def setup_central_treeview(self, data, columns):
        self.clear_central_frame()  # Clear the central frame first
        
        # Create and pack the Print Selected button at the top
        print_selected_btn = ttk.Button(self.central_frame, text="Print Selected", command=self.PrintSelectedBtn)
        print_selected_btn.pack(side="top", fill="x")
        
        # Create and pack the Select Template button at the top        
        select_template_btn = ttk.Button(self.central_frame, text="Select Template", command=self.select_input_template_file)
        select_template_btn.pack(side="top", fill="x")
        
        # Create and pack the Select Directory button at the top        
        select_directory_btn = ttk.Button(self.central_frame, text="Select Directory", command=self.select_output_dir)
        select_directory_btn.pack(side="top", fill="x")
        
        # Create a container frame inside central_frame specifically for the treeview and its scrollbar
        treeview_container = ttk.Frame(self.central_frame)
        treeview_container.pack(fill="both", expand=True, side="top")
        
        # Initialize the treeview within the container
        self.treeview = ttk.Treeview(treeview_container, columns=['checkbox'] + columns, show='headings')
        
        # Pack the treeview on the left side, allowing it to fill and expand as needed
        self.treeview.pack(side="left", fill="both", expand=True)

        # Initialize and pack the scrollbar on the right side of the same container
        scrollbar = ttk.Scrollbar(treeview_container, orient="vertical", command=self.treeview.yview)
        scrollbar.pack(side="right", fill="y")
        
        # Link the scrollbar with the treeview
        self.treeview.configure(yscrollcommand=scrollbar.set)

        # Now configure the checkbox column using the identifier, along with other treeview setup
        self.treeview.column('checkbox', anchor=tk.W, width=30)
        self.treeview.heading('checkbox', text='')  # No text for the checkbox column header

        for col in columns:
            self.treeview.column(col, anchor=tk.W, width=120)
            self.treeview.heading(col, text=col, anchor=tk.W)
        for row in data:
            self.treeview.insert('', 'end', values=('☐',) + row)
        
        self.treeview.bind('<Double-1>', self.OnDoubleClickCentralTreeview)
        self.treeview.bind('<Button-1>', self.OnClickCentralTreeview)

    def OnDoubleClickLeftSidebar(self, event):
        item = self.leftsidebar_treeview.selection()[0]
        item_text = self.leftsidebar_treeview.item(item, "text")
        print("you clicked on", item_text)

        if item_text == 'Print Pedigree Certificate':
            pedigree_data = handle_print_pedigree(self.currentdatabase)
            columns = ["ID", "Animal Name", "Printed", "Created", "Modified"]
            self.setup_central_treeview(pedigree_data, columns)
        # Add more conditions for other actions and corresponding widget setups here...
        
    def OnDoubleClickCentralTreeview(self, event):
    # Get the Treeview widget
        tree = event.widget
        
        # Get the selected item
        selected_item = tree.selection()[0]
        
        # Extract the necessary data (e.g., all values of the selected item)
        data = tree.item(selected_item, 'values')
        
        # Implement what you want to do with the data, for example, print it
        print(f"Double-clicked on: {data}")
        print("animal_id", data[1])
        
        # Call the function to create the PDF
        self.create_pdfs(data)
            
    def OnClickCentralTreeview(self, event):
        print("Checkbox clicked")
        # Identify the row and column clicked
        region = event.widget.identify_region(event.x, event.y)
        if region == "cell":
            col = event.widget.identify_column(event.x)
            row_id = event.widget.identify_row(event.y)
            if col == '#1':  # Assuming the checkbox column is the first one
                # Get current value of the checkbox
                current_value = event.widget.item(row_id, 'values')[0]
                # Determine the new value based on current state
                new_value = '☑' if current_value == '☐' else '☐'
                # Update the checkbox value while preserving other column values
                values = list(event.widget.item(row_id, 'values'))
                values[0] = new_value  # Update checkbox state
                event.widget.item(row_id, values=values)
                
    def PrintSelectedBtn(self):
        """
        PrintSelectedBtn method: collects the data from 
        all selected (if ☑ checked) rows and sents them 
        to create_pdfs method, to process it and create the pdfs
        """
        print("'Print Selected' Button was clicked")
        for child in self.treeview.get_children():
            item = self.treeview.item(child)
            # Assuming the checkbox is in the first position of 'values'
            if item['values'][0] == '☑':
                print(item['values'])  # Print or process the row's data
                self.create_pdfs(item['values'])
                
    def GoHomeBtn(self):
        """
        Sets up the home screen within the central frame. This includes displaying a logo,
        and showing current settings for the database, input template, and saving directory.
        """
        # Clear the central frame to prepare for new content
        self.clear_central_frame()

        # Load and display the logo image
        logo_path = Path(__file__).parent / 'logo.jpg'
        initial_size = (759, 375)
        image = Image.open(logo_path).resize(initial_size, Image.LANCZOS)
        self.home_image = ImageTk.PhotoImage(image)
        image_label = tk.Label(self.central_frame, image=self.home_image, border=0)
        image_label.pack(pady=40)

        # Display current configuration settings
        info_text = f"Current DB: {self.currentdatabase}\n" \
                    f"Input Template: {self.input_pdf_template}\n" \
                    f"Saving Directory: {self.output_directory}"
        info_label = tk.Label(self.central_frame, text=info_text, bg='white', font=("Arial", 12), relief="raised", borderwidth=2, padx=10, pady=10)  
        info_label.pack(pady=20)
        
    def create_pdfs(self, animal_data):
        # Check if the input file is set, if not, prompt the user
        if not self.input_pdf_template:
            self.select_input_template_file()  # This will prompt the user to select a file
            
        # Check if the saving directory is set, if not, prompt the user
        if not self.output_directory:
            self.select_output_dir()  # This will prompt the user to select a directory
            
        # Call TopScreenUtilities function fetch_animal data with animal id we got from the click
        pedigree_data = fetch_animal_pedigree_data(self.currentdatabase, animal_data[1])
        animal_additional_info = fetch_animal_aditional_data(self.currentdatabase, animal_data[1])
        
        # Ensure pedigree_data is not empty or invalid before proceeding
        if pedigree_data:
            try:
                pdf_manager = PedigreePDFManager()  # This will only initialize once
                
                # Construct the file name based on pedigree_data
                file_name = f'{pedigree_data.get("flock_prefix", "")} {pedigree_data.get("name", "")}.pdf'
                file_name = file_name.strip().replace(" ", "_")  # Clean up the file name

                # Combine with the chosen directory using Path
                output_pdf_path = Path(self.output_directory) / file_name

                pdf_manager.fill_pedigree_pdf(pedigree_data, self.input_pdf_template,output_pdf_path, animal_additional_info)
                print("PDF saved:", output_pdf_path)
                update_printed_status(self.currentdatabase, pedigree_data.get('id', ''))
                print("Printed status updated")
                # Create or append to the Pedigree_print_report.txt file
                report_file_path = Path(self.output_directory) / "Pedigree_print_report.txt"
                with open(report_file_path, 'a') as report_file:
                    # Construct the information string
                    flock_name = pedigree_data.get("flock_prefix", "")
                    animal_name = pedigree_data.get("name", "")
                    info_line = f'*** {flock_name} {animal_name}\n'  # Animal's flock name and name
                    
                    # Append the print_report from animal_additional_info if available
                    if 'print_report' in animal_additional_info:
                        info_line += animal_additional_info['print_report'] + '\n'
                    
                    # Write the constructed information to the file
                    report_file.write(info_line)
            except ValueError as e:
                messagebox.showerror("Error", str(e))
        else:
            messagebox.showwarning("Warning", "No pedigree data found to generate the PDF.")