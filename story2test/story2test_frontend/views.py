from django.shortcuts import render
from rest_framework import generics
from .models import UserStory
from .serializers import UserStorySerializer
from django.http import JsonResponse
from django.views import View
import json
import google.generativeai as genai
import re

# API view to list and create user stories
class UserStoryListCreate(generics.ListCreateAPIView):
    queryset = UserStory.objects.all()
    serializer_class = UserStorySerializer

class GeminiAIView(View):
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)
        user_story = body.get("user_story")

        if check_if_user_story_format(user_story):
            gemini_input = f"Given this user story: \"{user_story}\", can you convert it to Gherkin format and generate an acceptance test for it in Java? Answer just the Gherkin format and the code, nothing else but the Gherkin format and code."

            try:
                result = call_gemini_api(gemini_input)
                return JsonResponse(result)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        else:
            return JsonResponse({
                "message": "Please provide a valid User Story.\n\nI need a User Story to convert it to Gherkin and generate an acceptance test example.\n\nIf the information is not on the \"User Story\" format, please, repeat your request."
            })

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

def check_if_user_story_format(user_story):
    pattern = r"^As an? [a-zA-Z\s]+,? I want to [a-zA-Z\s]+,? so that [a-zA-Z\s]+.?$"
    
    if re.match(pattern, user_story, re.IGNORECASE):
        return True
    else:
        return False