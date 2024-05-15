from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import *
from AnimalTrakker_Shared.Shared_Logging import get_logger

logger = get_logger(__name__)

def fetch_evaluation_history(db_connection):
    """
    Fetches evaluation history data from the database using a secure and efficient connection handling provided by a DatabaseConnection instance.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list of dict: List containing dictionaries of evaluation history, formatted for display. Each dictionary contains the text from the second column of the fetched rows.
    """
    try:
        # Execute the predefined query to fetch evaluation history.
        rows = db_connection.fetchall(GET_ANIMAL_EVALUATION_HISTORY)
        logger.info(f"Evaluation history on database open fetched successfully, retrieved {len(rows)} records.")
        
        # Process the fetched rows into a list of dictionaries for display.
        return [{'text': str(row[1])} for row in rows]
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch evaluation history: {e}")
        return []  # Return an empty list or raise an exception depending on your error handling strategy

def fetch_evaluation_data(db_connection, evaluation_id, evaluation_name):
    """Fetches evaluation data from the database for a given evaluation ID."""
    
    try:
        row = db_connection.fetchone(GET_EVALUATION_TRAITS, (evaluation_name,))
        logger.info(f"Evaluation data {row} for {evaluation_name} with id {evaluation_id} fetched successfully.")
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch evaluation data for {evaluation_name}: {e}")
    
    return row

def fetch_default_settings(db_connection):
    """
    Fetches default settings data from the database using a secure and efficient connection handling provided by a DatabaseConnection instance.

    Args:
        db_connection (DatabaseConnection): The database connection instance through which all database interactions are made.

    Returns:
        list: List containing names of default settings.
    """
    try:
        # Execute the predefined query to fetch default settings.
        rows = db_connection.fetchall(GET_DEFAULT_SETTINGS_NAMES)
        logger.info(f"Default settings fetched successfully, retrieved {len(rows)} records.")
        
        # Log the raw data fetched from the database
        logger.info(f"Fetched rows: {rows}")
        
        # Process the fetched rows into a list of setting names.
        settings = [str(row[0]) for row in rows]  # Ensure only the setting name is returned
        logger.info(f"Processed settings: {settings}")
        return settings
    except Exception as e:
        # Log any errors that occur during the fetch process.
        logger.error(f"Failed to fetch default settings: {e}")
        return []  # Return an empty list or raise an exception depending on your requirements.
