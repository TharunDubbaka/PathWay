from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
client = MongoClient(os.getenv("MONGODB_URI"), connect=False)
db=client["pathforge"]
roadmaps_collection=db["roadmaps"]
users_collection=db["users"]
sessions_collection=db["sessions"]
