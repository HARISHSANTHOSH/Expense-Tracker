from django.http import JsonResponse,response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from decimal import Decimal
from django.db.models import Sum, F, DecimalField
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView
from decimal import Decimal
import json
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import authenticate, login
from django.contrib.auth import login, authenticate
from django.contrib.auth.hashers import make_password
import json
from django.contrib.auth import update_session_auth_hash
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from pymongo import MongoClient
from bson.decimal128 import Decimal128
from .mongo_setup import expenses_collection 
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Expense
from .serializers import ExpenseSerializer
from django.http import Http404
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from djongo.models.fields import ObjectId
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from .models import Expense
from collections import Counter
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import get_object_or_404
from .models import Expense
from .serializers import ExpenseSerializer
from django.http import Http404
from django.db.models import Sum
import calendar
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.http import JsonResponse
from rest_framework.response import Response
from django.db.models import Count
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Expense 
import re
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from rest_framework.permissions import AllowAny
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse
from .serializers import *
from rest_framework import serializers
import smtplib
from rest_framework import viewsets
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import Util
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Expense
from .serializers import ExpenseSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from datetime import datetime
from zoneinfo import ZoneInfo 

import logging
from rest_framework import generics

from .serializers import UserLoginSerializer
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend                                                                                                                                        
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
import re
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
import base64
from django.core.mail import send_mail

logger = logging.getLogger(__name__)











##User Registration
from rest_framework.authtoken.models import Token

class RegistrationView(APIView):
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        error_messages = []

        # Password validation
        if not re.match(r'^(?=.*[A-Z])', password):
            error_messages.append('Password must contain at least one capital letter.')
        if not re.match(r'^(?=.*\d)', password):
            error_messages.append('Password must contain at least one number.')
        if not re.match(r'^(?=.*[@#$!%*?&])', password):
            error_messages.append('Password must contain at least one special character.')
        if not re.match(r'^[\w\d@#$!%*?&]{8,}$', password):
            error_messages.append('Password must be at least 8 characters long.')

        # Email validation (you can use Django's built-in email validation)
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            error_messages.append('Invalid email format. Please enter a valid email.')

        # Check if the email is unique
        if User.objects.filter(email=email).first():
            return JsonResponse({"error": "Email is already in use"}, status=400)

        if error_messages:
            return JsonResponse({"error": error_messages}, status=400)

        # Create the user account
        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
      


        return JsonResponse({"msg":"done"},status=200)
    


# Creating Email For Custom Authentication Using Emailid

from django.contrib.auth.hashers import make_password
User = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)
            hashed_password_db = user.password 

            if user.check_password(password):
                 print(f"User authentication successful for email: {email}")
                 print(f"Hashed password:{hashed_password_db}")
                 return user
            else:
                print(f"Password mismatch for email: {email}")
                print(f"Password entered: {password}")
                print(f"Hashed Password from DB: {user.password}")
                print(f"Hashed Password from Login Attempt: {make_password(password)}")

        except User.DoesNotExist:
            return None



## User Login


class CustomTokenObtainPairView(APIView):
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get("email")
            password = serializer.validated_data.get("password")
            request.session['email'] = email

            # Check if email is specified
            if not email:
                return Response({"msg": "Email is not specified."}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, email=email, password=password, backend='django.contrib.auth.backends.ModelBackend')

            if user is not None:
                # Log the hashed password from the database
                logger.info("Hashed Password from DB: %s", user.password)

                # Log in the user
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')

                # Generate JWT token
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                # Log the user's successful login
                logger.info("User logged in: %s", user.username)

                return Response({"access_token": access_token, "email": email, "msg": "Login successful"}, status=status.HTTP_200_OK)
            else:
                try:
                  User.objects.get(email=email)
                except User.DoesNotExist:
                   return JsonResponse({"msg": "Email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
               
                return JsonResponse({"msg": "Password is incorrect."}, status=status.HTTP_401_UNAUTHORIZED)
                # If the user is None, authentication failed
                # return Response({"msg": "Authentication failed."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            logger.error("Invalid serializer data: %s", serializer.errors)  # Log serializer validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



### Total Expense


class TotalExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_month = timezone.now().month
        current_year = timezone.now().year

        start_date = timezone.datetime(current_year, current_month, 1)
        end_date = start_date + relativedelta(months=1, days=-1)

        expenses = Expense.objects.filter(
            user=request.user.id,
            date__gte=start_date,
            date__lte=end_date
        )

        total = sum(Decimal(str(expense.amount)) for expense in expenses)
        total_float = float(total)
        print(total_float)

        return Response({"total_expense": total_float}, status=status.HTTP_200_OK)



##ADD Expense

class AddExpenseView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        data=request.data
        data['user']=request.user.id
        # Check if a date is provided, if not, use the current date and time
        if 'date' not in data:
            data['date'] = timezone.now().date()
        serializer = ExpenseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Expense added successfully'}, status=status.HTTP_201_CREATED)
    
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




## Pie Chart


class UserExpenseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_id = request.user.id
        try:
            current_month = timezone.now().month
            current_year = timezone.now().year

            start_of_month = timezone.datetime(current_year, current_month, 1)
            end_of_month = timezone.datetime(current_year, current_month + 1, 1) - timezone.timedelta(seconds=1)

            # Equivalent MongoDB query using Django ORM
            expenses_data = Expense.objects.filter(
                user_id=user_id,
                date__gte=start_of_month,
                date__lte=end_of_month
            )

            # Perform aggregation using Django ORM
            expenses_by_category = expenses_data.values('category').annotate(count=Count('category'))

            data = [{'category': item['category'], 'count': item['count']} for item in expenses_by_category]

            print(f"Filtering Criteria: User: {request.user}, Month: {current_month}, Year: {current_year}")
            print(request.user.id)
            print("Filtered Data:", data)

            return Response(data, status=200)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "An error occurred"}, status=500)




## Latest Transaction


class RecentTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        expenses = Expense.objects.filter(user=user_id).order_by('-date')[:5]

        response_data = []
        for expense in expenses:
            response_data.append({
                'id': expense.id,
                'name': expense.name,
                'amount': str(expense.amount),
                'date': expense.date.strftime('%Y-%m-%d'),  # Format as 'YYYY-MM-DD'
                'category': expense.category,
                'user_id': str(expense.user),
            })

        return Response(response_data, status=status.HTTP_200_OK)



## Edit Transcation


class EditTransactionView(APIView):
    def get(self, request, id):
        # Retrieve the transaction based on the 'id' field
        transaction = get_object_or_404(Expense, id=id)
        serializer = ExpenseSerializer(transaction)
        data = serializer.data

        # Check if the date field is empty and set a default value
        if not data['date']:
            data['date'] = transaction.date.strftime('%Y-%m-%d') if transaction.date else None

        return Response(data)

    def put(self, request, id):
        try:
            # Retrieve the transaction based on the 'id' field
            transaction = Expense.objects.get(id=id)
        except Expense.DoesNotExist:
            raise Http404(f'Expense with id {id} does not exist')

        # Get the new date from the request data
        new_date = request.data.get('date')

        if new_date is not None:  # Check for None instead of truthiness
            transaction.date = new_date

        # Update other fields as needed
        serializer = ExpenseSerializer(instance=transaction, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Transaction updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        transaction = Expense.objects.get(id=id)
        transaction.delete()
        return Response({"msg": "Deleted successfully"})




## History Expense

class HistoryTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        page = int(request.GET.get('page', 1))
        items_per_page = 10
        start_index = (page - 1) * items_per_page
        end_index = page * items_per_page

        # Retrieve all expenses for the user without any filtering.
        expenses = Expense.objects.filter(user=user_id).order_by('-date')

        # Apply date filtering if start_date and end_date are provided.
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        if start_date and end_date:
            # Parse the start_date and end_date strings into datetime objects
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")

            start_date = timezone.make_aware(start_date)
            end_date = timezone.make_aware(end_date)
            server_timezone = timezone.get_current_timezone()
            start_of_day = start_date.replace(hour=0, minute=0, second=0, microsecond=0).astimezone(server_timezone)
            end_of_day = end_date.replace(hour=23, minute=59, second=59, microsecond=999).astimezone(server_timezone)

            expenses = expenses.filter(date__range=[start_of_day, end_of_day])

            
        # Apply category filtering if category_filter is provided.
        category_filter = request.GET.get('category_filter')
        if category_filter:
            expenses = expenses.filter(category=category_filter)

        # Apply search term filtering if search_term is provided.
        search_term = request.GET.get('search_term')
        if search_term:
            expenses = expenses.filter(name__icontains=search_term)

        # Slice the expenses QuerySet to get the desired page.
        expenses = expenses[start_index:end_index]

        # Prepare the response data.
        response_data = []
        for expense in expenses:
            response_data.append({
                'id': expense.id,
                'name': expense.name,
                'amount': str(expense.amount),
                'date': expense.date,
                'category': expense.category,
                'user_id': str(expense.user_id),
            })

        return Response(response_data, status=status.HTTP_200_OK)


# User Category Fetching For Filter

class UserCategoriesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):        
        user_id = request.user.id
        user_categories = Expense.objects.filter(user=user_id).values('category').distinct()
        categories = [category['category'] for category in user_categories]
        print(categories)
        return Response(categories)


## Report Page

class ReportView(APIView):
    def get(self, request):
        user_id = request.user.id

        report_type = request.query_params.get('report_type')
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        print(f"Received request for {report_type} report for year {year} and month {month}")

        if report_type not in ['monthly', 'yearly', 'monthly_total_by_month']:
            return Response({'error': 'Invalid report type'}, status=400)

        total_by_category = {}
        monthly_expenses = []

        try:
            if report_type == 'monthly':
                if not year or not month:
                    return Response({'error': 'Year and month are required for monthly report'}, status=400)

                start_date = timezone.make_aware(datetime(int(year), int(month), 1, 0, 0, 0))
                last_day = calendar.monthrange(int(year), int(month))[1]
                end_date = timezone.make_aware(datetime(int(year), int(month), last_day, 23, 59, 59))
                print(f"Query Date Range: {start_date} to {end_date}")
                expenses_data = expenses_collection.find(
                    {'user_id': user_id, 'date': {'$gte': start_date, '$lte': end_date}}
                )
                print(expenses_data)

                total_expense_for_month = sum(
                    float(Decimal(str(expense['amount']))) for expense in expenses_data
                )

                print("Monthly Total Expense:", total_expense_for_month)
                monthly_expenses.append({'month': start_date.strftime('%B'), 'total': total_expense_for_month})

            elif report_type == 'yearly':
                if not year:
                    return Response({'error': 'Year is required for yearly report'}, status=400)

                start_date = timezone.make_aware(datetime(int(year), 1, 1, 0, 0, 0))
                end_date = timezone.make_aware(datetime(int(year), 12, 31, 23, 59, 59))

                expenses_data = expenses_collection.find(
                    {'user_id': user_id, 'date': {'$gte': start_date, '$lte': end_date}}
                )

                total_expense_by_category = expenses_collection.aggregate([
                    {'$match': {'user_id': user_id, 'date': {'$gte': start_date, '$lte': end_date}}},
                    {'$group': {'_id': '$category', 'total': {'$sum': '$amount'}}}
                ])

                for expense in total_expense_by_category:
                    category = expense['_id']
                    total = Decimal(str(expense['total']))
                    total_by_category[category] = float(total)
                    print(f"Category: {category}, Total: {total}")

            elif report_type == 'monthly_total_by_month':
                # Fetch total expenses for each month
                monthly_totals = []
                for month in range(1, 13):  # Loop through each month
                    start_date = timezone.make_aware(datetime(int(year), month, 1, 0, 0, 0))
                    last_day = calendar.monthrange(int(year), month)[1]
                    end_date = timezone.make_aware(datetime(int(year), month, last_day, 23, 59, 59))

                    expenses_data = expenses_collection.find(
                        {'user_id': user_id, 'date': {'$gte': start_date, '$lte': end_date}}
                    )

                    total_expense_for_month = sum(
                        float(Decimal(str(expense['amount']))) for expense in expenses_data
                    )

                    monthly_totals.append({'month': start_date.strftime('%B'), 'total': total_expense_for_month})

                monthly_expenses = monthly_totals

            total_expense_for_year = sum(Decimal(str(value)) for value in total_by_category.values())
            print("Total Expense for Year:", total_expense_for_year)

            response_data = {
                'total': float(total_expense_for_year),
                'total_by_category': total_by_category,
                'bar_graph_data': monthly_expenses
            }

            print("Sending response data:", response_data)
            return JsonResponse(response_data)

        except Exception as e:
            error_message = f'An error occurred: {str(e)}'
            print(error_message)
            return JsonResponse({'error': error_message}, status=500)

# TotalExpensesByCategoryView 

@method_decorator(csrf_exempt, name='dispatch')
class TotalExpensesByCategoryView(APIView):
    def get(self, request):
        user_id = request.user.id
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        try:
            if not year:
                return Response({'error': 'Year is required'}, status=400)

            if month:
                start_date = timezone.make_aware(datetime(int(year), int(month), 1, 0, 0, 0))
                last_day = calendar.monthrange(int(year), int(month))[1]
                end_date = timezone.make_aware(datetime(int(year), int(month), last_day, 23, 59, 59))
            else:
                start_date = timezone.make_aware(datetime(int(year), 1, 1, 0, 0, 0))
                end_date = timezone.make_aware(datetime(int(year), 12, 31, 23, 59, 59))

            expenses_by_category = expenses_collection.aggregate([
                {'$match': {'user_id': user_id, 'date': {'$gte': start_date, '$lte': end_date}}},
                {'$group': {'_id': '$category', 'total': {'$sum': '$amount'}}}
            ])

            total_expenses_by_category = {
                item['_id']: float(Decimal(str(item['total']))) for item in expenses_by_category
            }

            response_data = {
                'bar_graph_data': total_expenses_by_category,
            }

            return JsonResponse(response_data)

        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)




## Csrf Token

from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    # Get the CSRF token
    csrf_token = get_token(request)
    print(csrf_token)
    return JsonResponse({'csrfToken': csrf_token})






# Password reset

@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        try:
           # Decode JSON data from the request body
            data = json.loads(request.body)
            email = data.get('email')
            print("email",email)
            user = User.objects.filter(email=email).first()

            if user:
                # Generate token for password reset
                token = default_token_generator.make_token(user)

                # Construct reset password link
                uid = urlsafe_base64_encode(str(user.pk).encode())
                reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

                # Send email with reset link
                send_mail(
                    'Password Reset',
                    f'Click the following link to reset your password: {reset_link}',
                    'hkc3392@gmail.com',
                    [email],
                    fail_silently=False,
                )

                return JsonResponse({'success': True, 'message': 'Password reset email sent.'})
            else:
                return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data in the request.'}, status=400)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)






@csrf_exempt
def reset_password(request, uidb64, token):
    if request.method == 'POST':
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if default_token_generator.check_token(user, token):
                # Reset the user's password
                body_unicode = request.body.decode('utf-8')
                body = json.loads(body_unicode)
                new_password = body.get('new_password')

                  # Password complexity criteria
                if len(new_password) < 8:
                    return JsonResponse({'success': False, 'message': 'Password must be at least 8 characters long.'}, status=400)

                if not any(char.isdigit() for char in new_password):
                    return JsonResponse({'success': False, 'message': 'Password must contain at least one digit.'}, status=400)

                if not any(char.isupper() for char in new_password):
                    return JsonResponse({'success': False, 'message': 'Password must contain at least one uppercase letter.'}, status=400)

                

                user.set_password(new_password)
                user.save()
                updated_user = User.objects.get(pk=uid)
                updated_password = updated_user.password
                print(f"Hashed Password After Save: {updated_password}")
                update_session_auth_hash(request, user)  

                # Set authentication backend
                user.backend = 'django.contrib.auth.backends.ModelBackend'

                # Log the user in with the new password
                login(request, user)

                return JsonResponse({'success': True, 'message': 'Password reset successfully.'})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid token.'}, status=400)

        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)





## Check the User Has Expenses


class CheckExpensesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # Check if the user has any expenses
            user_expense_count = Expense.objects.filter(user=request.user.id).count()

            # Serialize the result using a serializer
            serialized_data = {'hasExpenses': user_expense_count > 0, 'expenseCount': user_expense_count}
            return JsonResponse(serialized_data, status=200)
        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            print(error_message)  # Print the error to the console for debugging
            return JsonResponse({'error': error_message}, status=500)
