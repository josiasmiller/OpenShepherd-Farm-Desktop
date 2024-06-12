import tkinter as tk
from tkinter import filedialog, ttk
import sqlite3
from threading import Lock
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

class DatabaseConnection:
    """
    A thread-safe singleton class for managing a persistent SQLite database connection.
    Ensures that only one connection instance is created and reused throughout the application.
    """
    _instance = None
    _lock = Lock()

    def __new__(cls, db_path):
        """
        Creates a new instance of DatabaseConnection as a singleton or returns the existing instance.
        This method ensures that only one instance of the database connection exists within the application.

        Args:
            db_path (str): The file path to the SQLite database.

        Returns:
            DatabaseConnection: The singleton instance of the database connection.
        """
        with cls._lock:
            # Check if an instance already exists
            if cls._instance is None:
                # Create a new instance since one doesn't exist
                cls._instance = super(DatabaseConnection, cls).__new__(cls)
                cls._instance.db_path = db_path  # Initialize db_path for the new instance
                cls._initialize_connection(db_path)  # Establish the database connection
            return cls._instance


    @staticmethod
    def _initialize_connection(db_path):
        """
        Initializes the database connection for the singleton instance.
        This method is responsible for setting up or updating the connection to the SQLite database.

        Args:
            db_path (str): The file path to the SQLite database to connect to.

        Raises:
            sqlite3.Error: If the connection to the database fails.
        """
        try:
            # Close the existing connection if it exists to ensure a clean setup
            if hasattr(DatabaseConnection._instance, 'connection'):
                DatabaseConnection._instance.close()
            # Establish a new connection to the specified database path
            DatabaseConnection._instance.connection = sqlite3.connect(db_path, check_same_thread=False)
            logger.info(f"Database connection successfully established at {db_path}.")
        except sqlite3.Error as e:
            logger.error(f"Failed to establish a database connection at {db_path}: {e}")
            raise  # Re-raise the exception to signal failure to the caller


    def update_connection(self, new_db_path):
        """
        Updates the database path and the connection if the new path is different from the current one.

        Args:
            new_db_path (str): The new database file path to which the connection should be updated.

        Raises:
            sqlite3.Error: If updating the database connection fails.
        """
        if self.db_path != new_db_path:
            self.db_path = new_db_path  # Update the internal record of the database path
            self._initialize_connection(new_db_path)  # Re-initialize the connection with the new path

    def fetchall(self, query, params=None):
        """
        Executes a query and fetches all rows of a query result, returning a list of tuples.
        
        Args:
            query (str): SQL query to execute.
            params (tuple, optional): Parameters to substitute into the query.

        Returns:
            list of tuple: Rows returned by the query.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params or ())
            rows = cursor.fetchall()
            cursor.close()
            #logger.info(f"Query executed successfully: {query}, fetched {len(rows)} rows")
            return rows
        except sqlite3.Error as e:
            logger.error(f"Error executing query '{query}': {e}")
            return []

    def fetchall_with_column_names(self, query, params=None):
        """
        Executes a query and fetches all rows, returning a list of dictionaries with column names.
        
        Args:
            query (str): SQL query to execute.
            params (tuple, optional): Parameters to substitute into the query.

        Returns:
            list of dict: Rows returned by the query with column names as keys.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params or ())
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()
            cursor.close()
            result = [dict(zip(columns, row)) for row in rows]
            return result
        except sqlite3.Error as e:
            logger.error(f"Error executing query '{query}': {e}")
            return []
        
    def fetchone(self, query, params=None):
        """
        Executes a query and fetches the first row of the result.

        Args:
            query (str): SQL query to execute.
            params (tuple, optional): Parameters to substitute into the query.

        Returns:
            tuple: The first row of the result.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params or ())
            row = cursor.fetchone()
            cursor.close()
            #logger.info(f"Query executed successfully: {query}, fetched 1 row: {row}")
            return row
        except sqlite3.Error as e:
            logger.error(f"Error executing query '{query}': {e}")
            return None

    def fetchmany(self, query, size, params=None):
        """
        Executes a query and fetches a limited set of rows of the result.

        Args:
            query (str): SQL query to execute.
            size (int): Number of rows to fetch.
            params (tuple, optional): Parameters to substitute into the query.

        Returns:
            list of tuple: The rows of the result.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params or ())
            rows = cursor.fetchmany(size)
            cursor.close()
            #logger.info(f"Query executed successfully: {query}")
            return rows
        except sqlite3.Error as e:
            logger.error(f"Error executing query '{query}': {e}")
            return []

    def save(self, query, params=None):
        """
        Executes an update or insert query with provided parameters.

        Args:
            query (str): SQL query to execute.
            params (tuple, optional): Parameters to substitute into the query.

        Returns:
            int: The number of rows affected by the query.
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params or ())
            self.connection.commit()
            rows_affected = cursor.rowcount
            cursor.close()
            #logger.info(f"Query executed successfully: {query}, Rows affected: {rows_affected}")
            return rows_affected
        except sqlite3.Error as e:
            logger.error(f"Error executing query '{query}': {e}")
            return 0
        
    def close(self):
        """
        Closes the database connection.
        """
        try:
            if self.connection:
                self.connection.close()
                logger.info("Database connection closed successfully.")
        except sqlite3.Error as e:
            logger.error(f"Failed to close the database connection: {e}")


def file_picker():
    """
    Opens a file dialog for the user to select a SQLite database file.

    This function uses a Tkinter file dialog to ask the user to open a file
    with specific extensions suitable for database files. It handles the case
    where a user might cancel the operation.

    Returns:
        str: The path to the selected database file, or an empty string if no file is selected.
    """
    # Configure the options for the file dialog
    filetypes = [
        ("SQLite files", "*.sqlite"),
        ("Database Files", "*.db"),
        ("All Files", "*.*")
    ]
    title = "Open Database"

    # Show the open file dialog and store the result
    database_file = filedialog.askopenfilename(title=title, filetypes=filetypes)

    if not database_file:
        # No file was selected (user cancelled the dialog)
        logger.info("No database file selected.")
        return ""

    # File was selected; log and return the path
    logger.info(f"The database file is {database_file}")
    return database_file

def report_picker():
    """
    Opens a file dialog for the user to select an Excel file (.xls or .xlsx) and returns the file path.

    This function uses a Tkinter file dialog to ask the user to open a file
    with specific extensions suitable for Excel files. It handles the case
    where a user might cancel the operation.

    Returns:
        str: The path to the selected Excel file, or an empty string if no file is selected.
    """
    # Configure the options for the file dialog
    filetypes = [
        ("Excel files", "*.xls *.xlsx"),
        ("All Files", "*.*")
    ]
    title = "Open Report File"

    # Show the open file dialog and store the result
    report_file = filedialog.askopenfilename(title=title, filetypes=filetypes)

    if not report_file:
        # No file was selected (user cancelled the dialog)
        logger.info("No report file selected.")
        return ""

    # File was selected; log and return the path
    logger.info(f"The report file is {report_file}")
    return report_file


## MITCH DEBUG

class InitialPage(tk.Tk):
    def __init__(self, run_main):
        super().__init__()

        self._run_main = run_main

        self.title("Initial Page")
        self.geometry("500x300")

        self.create_widgets()

        self.current_database = ""



    def create_widgets(self):
        button1 = ttk.Button(self, text="Select Database", command=self.select_database)
        button1.pack(pady=10)

        ##TODO: make it so the user can choose the default settings from the database selected

        button3 = ttk.Button(self, text="Open Main App", command=self.open_main_app)
        button3.pack(pady=10)

        self.database_label = ttk.Label(self, text="No database selected")
        self.database_label.pack(pady=10)

    def select_database(self):
        self.current_database = file_picker()
        self.database_label.config(text=f"Selected Database: {self.current_database}")


    def open_main_app(self):
        self.destroy()
        self._run_main(self.current_database)
