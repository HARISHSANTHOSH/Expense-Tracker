from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, DjangoUnicodeDecodeError

from django.urls import reverse


from django.db.models import Sum
from django.db import models
class RegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
class UserLoginSerializer(serializers.Serializer):
    # username=serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True)




from rest_framework import serializers
from .models import Expense

from rest_framework import serializers

class ExpenseSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = Expense
        fields = '__all__'

        
