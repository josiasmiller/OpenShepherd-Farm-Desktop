from diagrams import Diagram, Cluster
from diagrams.generic.database import SQL
from diagrams.programming.language import Python
from diagrams.onprem.database import PostgreSQL
from diagrams.onprem.client import User
from diagrams.aws.compute import EC2

# Colors for different parts
model_color = "lightgreen"
view_color = "lightyellow"
controller_color = "lightcoral"

with Diagram("AnimalTrakker_FarmDesktop Structure", show=False, direction="LR"):
    user = User("User")
    
    with Cluster("AnimalTrakker_FarmDesktop"):
        with Cluster("Shared", direction="TB"):
            with Cluster("Model", graph_attr={"bgcolor": model_color}):
                shared_db = SQL("SharedDB")

            with Cluster("View", graph_attr={"bgcolor": view_color}):
                base_gui = Python("BaseGUI")
                base_main_frame = Python("BaseMainFrame")
                base_top_bar = Python("BaseTopBar")
                base_bottom_bar = Python("BaseBottomBar")
                base_left_sidebar = Python("BaseLeftSidebar")
                base_style = Python("BaseStyle")

            with Cluster("Controller", graph_attr={"bgcolor": controller_color}):
                base_controller = EC2("BaseController")

        with Cluster("FarmSpecific", direction="TB"):
            with Cluster("Model", graph_attr={"bgcolor": model_color}):
                fd_db_handlers = PostgreSQL("FD_DB_Handlers")
                fd_db_utils = PostgreSQL("FD_DB_Utilities")
                fd_queries = PostgreSQL("FD_Queries")

            with Cluster("View", graph_attr={"bgcolor": view_color}):
                fd_main_frame = Python("FDMainFrame")
                fd_left_sidebar = Python("FDLeftSidebar")
                fd_widgets = Python("FDWidgets")
                fd_gui = Python("FDGUI")

            with Cluster("Controller", graph_attr={"bgcolor": controller_color}):
                fd_controller = EC2("FDController")

    # Relationships
    user >> fd_controller
    fd_controller >> base_controller
    base_controller >> shared_db

    fd_db_handlers >> shared_db
    fd_db_utils >> shared_db
    fd_queries >> shared_db

    fd_main_frame >> base_main_frame
    fd_left_sidebar >> base_left_sidebar
    fd_widgets >> base_gui
    fd_gui >> base_gui
