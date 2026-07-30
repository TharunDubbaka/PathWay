from app.db.db import roadmaps_collection

roadmaps_collection.insert_one({
    "test": "connection successful"
})

print("Inserted successfully!")