import pdfrw
import tkinter as tk
from tkinter import filedialog

from datetime import datetime

from pathlib import Path


# Location of pdf form in template in the same directory
input_pdf_path = Path(__file__).parent / 'ABWMSA_registration_template_V2.pdf'


class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]

class PedigreePDFManager(metaclass=SingletonMeta):
    def __init__(self):
        if not hasattr(self, 'initialized'):  # Prevent reinitialization
            self.initialized = True
            self.setup_pdf_properties()

    def setup_pdf_properties(self):
        self.ANNOT_KEY = '/Annots'
        self.ANNOT_FIELD_KEY = '/T'
        self.ANNOT_VAL_KEY = '/V'
        self.ANNOT_FORM_type = '/FT'
        self.WIDGET_SUBTYPE_KEY = '/Widget'

    # For now this method is not used, but it can be used in the future
    def get_input_file_path(self):
        """
        Use the existing Tkinter instance to prompt for an input file, avoiding creating new Tk instances.
        """
        input_pdf_path = filedialog.askopenfilename(title="Select Input PDF Template", filetypes=[("PDF files", "*.pdf")])
        return input_pdf_path

    # Keeping it for now, but now this method is not used
    def get_output_file_path(self):
        """
        Prompts the user to select an output file location using the existing Tkinter application.
        """
        output_pdf_path = filedialog.asksaveasfilename(title="Save Filled PDF", defaultextension=".pdf")
        return output_pdf_path

    def fill_pedigree_pdf(self, pedigree_data, input_pdf_template, output_pdf_path, animal_additional_info):
        """
        Fills a PDF with pedigree data.

        :param pedigree_data: The structured pedigree data to be filled into the PDF.
        :param input_pdf_template: Path where the pdf template is located.
        :param animal_additional_info: The structured aditional pedigree data to be filled into the PDF.
        :param output_pdf_path: Path where the filled PDF will be saved.
        """
        # Load the PDF template
        template_pdf = pdfrw.PdfReader(input_pdf_template)
        
        # Logic to parse and fill pedigree data into the PDF
        data_dict = self._parse_pedigree_data(pedigree_data, animal_additional_info)
        
        # Fill the PDF with the data dictionary
        self._fill_pdf_with_data(template_pdf, data_dict, output_pdf_path)

    def _parse_pedigree_data(self, pedigree_data, animal_additional_info):
        """
        Transforms structured pedigree data into a flat dictionary suitable for filling a PDF,
        including both subject animal details and ancestors' formatted information.
        """
        # Mapping 'sex_id' to human-readable format
        sex_map = {1: 'Male', 2: 'Female'}
        gender = sex_map.get(pedigree_data.get('sex_id'), 'Unknown')
        animal_id = pedigree_data.get('id')
        
        def split_string_at_comma(s, first_line_max=76, second_line_min=15):
            if not s:
                print("Info is missing")
                return [s, '']
            # If the string is within the first_line_max, return it as is with an empty second line.
            if len(s) <= first_line_max:
                return [s, '']
            
            # Initialize the split point to None
            split_point = None

            # Look for commas within the first_line_max that also allow for a second line of at least second_line_min
            for i in range(first_line_max, 0, -1):
                if s[i] == ',':
                    if len(s) - i - 1 >= second_line_min:
                        split_point = i
                        break

            # If no suitable comma is found within the constraints, find the closest comma without the second_line_min constraint
            if split_point is None:
                for i in range(first_line_max, -1, -1):
                    if s[i] == ',':
                        split_point = i
                        break
                # If still no comma is found, use first_line_max as the split point
                if split_point is None:
                    split_point = first_line_max

            # Include the comma in the first line if split_point is not at the end
            first_line = s[:split_point+1].rstrip()  # Keep the comma at the end if it's there
            second_line = s[split_point+1:].strip() if split_point < len(s) else ''

            return [first_line, second_line]

        breeder_info = split_string_at_comma(animal_additional_info.get('breeder_info'))
        owner_info = split_string_at_comma(animal_additional_info.get('owner_info'))
        # Get the current date
        today = datetime.now()
        # Format the date as mm/dd/yyyy
        print_date = today.strftime('%m/%d/%Y')
        # Start with the subject animal's detailed attributes
        flat_data = {
            'Name': f'{pedigree_data.get("flock_prefix", "")} {pedigree_data.get("name", "")}',
            'Sex': gender.upper(),
            'BirthYear': datetime.strptime(pedigree_data.get('birth_date', ''), '%Y-%m-%d').strftime('%b %d %Y'), # Getting date to the right format in one line
            'BirthType': pedigree_data.get('birth_type', ''),
            'FlockPrefix': pedigree_data.get('flock_prefix', ''),
            'RegNo': pedigree_data.get('reg_num'),
            'FarmID': animal_additional_info.get('farm_id'),
            'OfficialEarTag': animal_additional_info.get('federal_id'),
            'Inbreeding': str(animal_additional_info.get('inbreed_coef')) if animal_additional_info.get('inbreed_coef') is not None else '',
            'BreederInfo': breeder_info[0],
            'BreederMailingAddress': breeder_info[1],
            'BTelNo': animal_additional_info.get('breeder_phone'),
            'BreederFlockID': animal_additional_info.get('breeder_flock_number'),
            'BreederScrapieID': animal_additional_info.get('breeder_scrapie_id'),
            'OwnerInfo': owner_info[0],
            'OwnerMailingAddress': owner_info[1],
            'OTelNo': animal_additional_info.get('owner_phone'),
            'OwnerFlockID': animal_additional_info.get('owner_flock_number'),
            'OwnerScrapieID': animal_additional_info.get('owner_scrapie_id'),
            'PrintDate': print_date,
            'WgtBirth': f'{animal_additional_info.get("birth_weight", "")} lb' if animal_additional_info.get("birth_weight") not in [None, '', 0] else '',
            'Wgt2nd': f'{animal_additional_info.get("weight_50days", "")} lb' if animal_additional_info.get("weight_50days") is not None else '',
            "Codon171": animal_additional_info.get('codon_171'),
            "CODON136": animal_additional_info.get('codon_136'),
        }

        # Format Sire and Dam information with detailed attributes
        if 'parents' in pedigree_data:
            for role, key in [('sire', 'SireSpecial'), ('dam', 'DamSpecial')]:
                if role in pedigree_data['parents']:
                    parent_info = pedigree_data['parents'][role]
                    flat_data[key] = self._format_ancestor_info(parent_info)
                    
                    # Process further lineage
                    if isinstance(parent_info, dict):
                        flat_data.update(self._process_lineage(parent_info.get('parents', {}), 's' if role == 'sire' else 'd'))

        # Keeping it just in case of future debugging
        # print("Parse pedigree data:", flat_data)
        return flat_data
    
    def _format_ancestor_info(self, ancestor_data):
        """
        Formats ancestor information as "Flock Prefix Name.RegNo.Sex.Birth Date.Birth Type".
        
        If no ancestor_data (if ancestor_data is not a dictionary), returns an empty string.
        """
        if not isinstance(ancestor_data, dict):
            return ''
        
        sex = 'Ram' if ancestor_data.get('sex_id') == 1 else 'Ewe'
        formatted_birth_date = self._format_date(ancestor_data.get('birth_date', ''))
        # Compose the formatted string
        ancestor_info = f"{ancestor_data.get('flock_prefix', '')} {ancestor_data.get('name', '')}.{ancestor_data.get('reg_num', '')}.{sex}.{formatted_birth_date}.{ancestor_data.get('birth_type', '')}"
        return ancestor_info.strip()

    def _format_date(self, date_str):
        """
        Formats a date string from 'YYYY-MM-DD' to 'DD Mon YYYY'.
        """
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            return date_obj.strftime('%d %b %Y')
        except ValueError:
            return 'Unknown Date'

    def _process_lineage(self, data, prefix):
        """
        Recursively processes lineage data to match PDF field naming conventions,
        formatting all ancestor information uniformly.
        """
        flat_data = {}
        for role in ['sire', 'dam']:
            key_prefix = prefix + ('s' if role == 'sire' else 'd')
            if role in data and isinstance(data[role], dict):
                # Utilize the _format_ancestor_info method for uniform formatting
                ancestor_info = self._format_ancestor_info(data[role])
                flat_data[f'{key_prefix}Special'] = ancestor_info

                # Recurse if there are further ancestors
                if 'parents' in data[role]:
                    flat_data.update(self._process_lineage(data[role]['parents'], key_prefix))
        return flat_data

    def _fill_pdf_with_data(self, template_pdf, data_dict, output_pdf_path):
        """
        Fills the PDF template with data from a dictionary.
        """
        for page in template_pdf.pages:
            annotations = page.get('/Annots')
            if annotations:
                for annotation in annotations:
                    field_name = annotation.get('/T')
                    if field_name and field_name[1:-1] in data_dict:  # Removing parentheses from field name
                        annotation.update(pdfrw.PdfDict(V=data_dict[field_name[1:-1]]))
        
        # Mark the form as needing appearances to be generated
        if '/AcroForm' in template_pdf.Root:
            template_pdf.Root.AcroForm.update(pdfrw.PdfDict(NeedAppearances=pdfrw.PdfObject('true')))
        # Save the filled PDF
        pdfrw.PdfWriter().write(output_pdf_path, template_pdf)
        



