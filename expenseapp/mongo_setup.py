from pymongo import MongoClient
from pymongo.errors import AutoReconnect

try:
    # Replace 'your_actual_connection_string' with the copied connection string from MongoDB Compass
    client = MongoClient('mongodb://localhost:27017')
    db = client['Expensetracker']
    expenses_collection = db['expenseapp_expense']
except AutoReconnect as e:
    # Handle connection error
    print(f"MongoDB connection error: {str(e)}")
