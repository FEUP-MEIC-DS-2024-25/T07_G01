from django.shortcuts import render
from rest_framework import generics
from .models import UserStory
from .serializers import UserStorySerializer
from django.http import JsonResponse
from django.views import View
import requests
import google.generativeai as genai
import os

# API view to list and create user stories
class UserStoryListCreate(generics.ListCreateAPIView):
    queryset = UserStory.objects.all()
    serializer_class = UserStorySerializer


class GeminiAIView(View):
    def post(self, request, *args, **kwargs):
        import json
        body = json.loads(request.body)
        user_story = body.get("user_story")

        if user_story:
            gemini_input = f"Isto é uma user story, podes-me dizer quem é o sujeito aqui {user_story}?"

            result = call_gemini_api(gemini_input)

            return JsonResponse(result)
        else:
            return JsonResponse({"error": "Input inválido"}, status=400)

def input_user_stories(request):
    if request.method == 'POST':
        user_story = request.POST.get('user_story')
    return render(request, 'input_user_stories.html')

def call_gemini_api(user_input):
    genai.configure(api_key="AIzaSyCAhIoSs93i2maxH8A3ESi3LmqCygp2sxY")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_input)

    return {
        "message": response.text
    }
