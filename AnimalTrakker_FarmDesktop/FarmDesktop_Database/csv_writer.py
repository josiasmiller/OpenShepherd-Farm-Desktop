from tkinter import messagebox
import csv


def write_animal_notes(file_path : str, animal_notes : list) -> None:
    # Write the data to a CSV file at the selected file path
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Get the headers (column names) from the treeview
        headers = ["Date", "Time", "Animal Name", "Note"]
        writer.writerow(headers)

        # Write each row of data
        for row in animal_notes:
            note_date = row[0]
            note_time = row[1]
            animal_name = row[2]
            note = row[3]
            row_content = [note_date, note_time, animal_name, note]
            writer.writerow(row_content)

    messagebox.showinfo("File Saved", f"CSV file saved successfully to:\n{file_path}")
    return


def write_id_history(file_path : str, id_history_content : list) -> None:
    # Write the data to a CSV file at the selected file path
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Get the headers (column names) from the treeview
        headers = ["Animal Name", "ID Type", "ID Number", "ID Color", "ID Location" , "ID Date On", "ID Date Off"]
        writer.writerow(headers)

        # Write each row of data
        for row in id_history_content:
            # flock_prefix = row[1]
            # animal_fn = row[2]
            # animal_name = f"{flock_prefix} {animal_fn}"
            #
            # id_type = row[4]
            # id_number = row[5]
            # id_color = row[6]
            # id_location = row[7]
            # date_on = row[8]
            # date_off = row[9]
            #
            # row_content = [animal_name, id_type, id_number, id_color, id_location, date_on, date_off]
            writer.writerow(row)

    messagebox.showinfo("File Saved", f"CSV file saved successfully to:\n{file_path}")
    return
