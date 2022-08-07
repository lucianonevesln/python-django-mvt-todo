from django.shortcuts import render
from django.http import JsonResponse

# teste
#def frontendTeste(Request):
#    return JsonResponse('frontend teste', safe=False)

def index(request):
    return render(request, 'index.html')