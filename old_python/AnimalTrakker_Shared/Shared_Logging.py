import logging

def animaltrakker_setup_logging():
    """
    Sets up the logging configuration for the entire application.

    Configures the logging to output to the console with a specific format that includes the time stamp,
    log level, logger name, and the message. This setup is intended to be called at the start of your application
    to ensure all subsequent logging follows this format.
    """
    # Configure the basic logging settings: log level, output format, and date format.
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')

def get_logger(name):
    """
    Retrieves a logger instance with the specified name.

    This function is used to get a logger object for different modules in the application,
    allowing each module to log messages under its own name. Using named loggers helps in
    identifying which part of the application the log entries are coming from.

    Args:
        name (str): The name of the logger. This is typically the __name__ variable passed from the module.

    Returns:
        logging.Logger: A configured logger instance with the specified name.
    """
    # Return a logger instance with the provided name.
    return logging.getLogger(name)
