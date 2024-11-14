"""
URL configuration for story2test project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from story2test_frontend import views

urlpatterns = [
    path('', views.first_time, name='first_time'),
    path('<int:conversation_id>/', views.input_user_stories, name='input_user_stories'),
    path('api/userstories/', views.UserStoryListCreate.as_view(), name='userstories-list-create'),
    path('api/gemini/<int:conversation_id>/', views.GeminiAIView.as_view(), name='gemini-ai'),
    path('api/conversations/<int:conversation_id>/messages/', views.return_conversation_messages, name='return_conversation_messages')
]
