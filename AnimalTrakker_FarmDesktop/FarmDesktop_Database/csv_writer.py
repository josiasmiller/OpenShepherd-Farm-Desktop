from tkinter import messagebox
import csv


def write_animal_notes(file_path : str, animal_notes : list) -> None:
    # Write the data to a CSV file at the selected file path
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Get the headers (column names) from the treeview
        headers = ["Animal Name", "Created At", "Note"]
        writer.writerow(headers)

        # Write each row of data
        for row in animal_notes:
            animal_name = row[3]
            note = row[1]
            created_at = row[2]
            row_content = [animal_name, note, created_at]
            writer.writerow(row_content)

    messagebox.showinfo("File Saved", f"CSV file saved successfully to:\n{file_path}")
    return
