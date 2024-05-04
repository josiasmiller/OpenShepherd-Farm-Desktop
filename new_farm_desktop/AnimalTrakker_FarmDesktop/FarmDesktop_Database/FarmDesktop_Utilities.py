from AnimalTrakker_FarmDesktop.FarmDesktop_Database.FarmDesktop_Queries import GET_ANIMAL_EVALUATION_HISTORY
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
