class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class DefaultSettings(metaclass=SingletonMeta):
    def __init__(self):
        self.species_id = None
        # Add other fields as needed
        # self.new_field_name = None


def update_default_settings(settings_dict : dict):
    default_settings.species_id = settings_dict['id_speciesid']
    # default_settings.new_field_name = settings_dict['my_field_name_in_dictionary']
    return

# Create the Singleton instance
default_settings = DefaultSettings()
