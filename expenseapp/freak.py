import pymongo
from pymongo import MongoClient

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client['Expensetracker']
collection = db['auth_user']  # Corrected collection name

result = collection.find()
for document in result:
    print(document)
