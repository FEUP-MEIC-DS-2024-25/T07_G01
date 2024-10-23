from django.shortcuts import render
from rest_framework import generics
from .models import UserStory
from .serializers import UserStorySerializer
from django.http import JsonResponse
from django.views import View
import json
import google.generativeai as genai

# API view to list and create user stories
class UserStoryListCreate(generics.ListCreateAPIView):
    queryset = UserStory.objects.all()
    serializer_class = UserStorySerializer

class GeminiAIView(View):
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        user_story = body.get("user_story")

        if user_story:
            gemini_input = f"Dada esta user story: {user_story}, podes-me converter para o formato Gherkin e gerar um esboço para um acceptance test? Se não estiver em formato \"User Story\" apenas pede para repetir."

            try:
                result = call_gemini_api(gemini_input)
                return JsonResponse(result)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
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
