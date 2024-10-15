from django.shortcuts import render

def input_user_stories(request):
    if request.method == 'POST':
        user_story = request.POST.get('user_story')
    return render(request, 'input_user_stories.html')
