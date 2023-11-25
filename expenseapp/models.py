from mongoengine import Document, DecimalField, DateTimeField, StringField, EmbeddedDocumentField, ListField,Decimal128Field
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

from djongo import models as djongo_models
from bson import ObjectId
from mongoengine import Document, fields
from django.db.models import Max


class Expense(models.Model):
    
   
    
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2,max_length=16)
    date = models.DateField()
    category = models.CharField(max_length=100)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    
    

    


    

   
