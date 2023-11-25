from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views
from .views import *
from django.contrib.auth.views import PasswordResetView, PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
   
    path('api/register/', views.RegistrationView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/login/',views.CustomTokenObtainPairView.as_view(),name='login'),
    path('api/expense/add/',views.AddExpenseView.as_view(), name='addexpense'),
    path('api/totalexpense/',views.TotalExpenseView.as_view(),name='totalexpense'),
    path('logout/',LogoutView.as_view(), name='logout'),
    path('api/expensechart/', views.UserExpenseListView.as_view(), name='expensechart'),
    path('api/fetchlatest/',views.RecentTransactionView.as_view(),name='fetchlatest'),
    path('api/edit-transaction/<int:id>/', EditTransactionView.as_view(), name='edit_transaction'),
    path('api/historytransaction/', HistoryTransactionView.as_view(), name='historytransaction'),
     path('api/user-categories/', UserCategoriesView.as_view(), name='user-categories'),
      path('api/total-expenses-by-category/', TotalExpensesByCategoryView.as_view(), name='total_expenses_by_category'),
    path('api/reports/', views.ReportView.as_view(), name='reports'),
    path('api/check-expenses/', CheckExpensesView.as_view(), name='check_expenses'),
      #  path('api/update-password-notification/', update_password_notification, name='update_password_notification'),
         path('api/get-csrf-token/', get_csrf_token, name='get-csrf-token'),

 
      path('api/forgot-password/', forgot_password, name='forgot-password'),
    path('api/reset-password/<str:uidb64>/<str:token>/', reset_password, name='reset-password'),
    
    
   
   
    
    
    
   

    
    
    
    
]

