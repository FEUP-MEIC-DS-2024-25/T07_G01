from datetime import datetime
from django.shortcuts import render, redirect
from rest_framework import generics
from .models import UserStory, Conversation, Message
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
    def post(self, request, conversation_id, *args, **kwargs):
        body = json.loads(request.body)
        user_story = body.get("user_story")

        conversation = Conversation.objects.get(id=conversation_id)
        Message.objects.create(
            conversation=conversation,
            is_user=True,
            text=user_story
        )

        if check_if_user_story_format(user_story):
            gemini_input = f"Given this user story: \"{user_story}\", convert it to Gherkin format and give a quick explanation of the test. Also please try to create at least 5 scenarios for the tests."

            try:
                answer = call_gemini_api(gemini_input)

                result = {
                    "message": answer.text
                }

                # Save the AI's message
                Message.objects.create(
                    conversation=conversation,
                    is_user=False,
                    text=result["message"]
                )

                return JsonResponse(result)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        else:
            answer = "Please provide a valid User Story.\n\nI need a User Story to convert it to Gherkin and generate an acceptance test example.\n\nIf the information is not on the \"User Story\" format, please, repeat your request."

            # Save the AI's message
            Message.objects.create(
                conversation=conversation,
                is_user=False,
                text=answer
            )

            return JsonResponse({
                "message": answer
            })


def first_time(request):
    conversation = Conversation.objects.last()

    if not conversation:
        conversation = Conversation.objects.create(created_at=datetime.now())
        conversation.save()

    return redirect('input_user_stories', conversation_id=conversation.id)


def input_user_stories(request, conversation_id):
    conversation = Conversation.objects.filter(id=conversation_id).first()
    all_chats = Conversation.objects.all().order_by('-id')

    return render(request, 'input_user_stories.html', {'conversation_id': conversation.id, 'chats': all_chats})

def create_new_chat(request):
    conversation = Conversation.objects.last()
    new_id = conversation.id + 1
    Conversation.objects.create(id=new_id, created_at=datetime.now())

    return redirect('input_user_stories', conversation_id=new_id)


def call_gemini_api(user_input):
    genai.configure(api_key="AIzaSyCAhIoSs93i2maxH8A3ESi3LmqCygp2sxY")
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(user_input)

    return response


def check_if_user_story_format(user_story):
    pattern = r"^As an? [a-zA-Z\s']+,? I want to [a-zA-Z\s']+,? so that [a-zA-Z\s']+\.?$"

    if re.match(pattern, user_story, re.IGNORECASE):
        return True
    else:
        return False


def return_conversation_messages(request, conversation_id):
    # Retrieve all messages related to the given conversation_id
    messages = Message.objects.filter(conversation_id=conversation_id)

    # Serialize the messages into a list of dictionaries
    message_list = []
    for message in messages:
        message_list.append({
            'id': message.id,
            'text': message.text,
            'is_user': message.is_user,  # assuming this field indicates whether the message is from the user
            'timestamp': message.timestamp.isoformat()  # assuming you have a timestamp field
        })

    # Return the messages as JSON
    return JsonResponse({'messages': message_list})


def delete_chat(request, current_conversation_id, conversation_id):
    conversation = Conversation.objects.filter(id=conversation_id).first()
    conversation.delete()

    if current_conversation_id == conversation_id:
        return redirect('first_time')

    return redirect('input_user_stories', conversation_id=current_conversation_id)