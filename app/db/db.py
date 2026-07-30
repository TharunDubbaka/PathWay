from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
client = MongoClient(os.getenv("MONGODB_URI"))
db=client["pathforge"]
roadmaps_collection=db["roadmaps"]
