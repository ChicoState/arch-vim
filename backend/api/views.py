from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProgress


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })


@api_view(['GET', 'POST']) #Http requests
@permission_classes([permissions.IsAuthenticated]) #user needs to be signed in
def save_load_levels(request):  # function name, inputs the request as a variable
    progress, _ = UserProgress.objects.get_or_create(user=request.user) # get or create a row on the table matching the user's name (user=request.user)
    if request.method == 'GET':         #If its a get request (frontend wants to get data and load the obj)
        return Response(progress.data)  # sends back all the data
    elif request.method == 'POST':      # If post request (frontend is saving a level)
        progress.data = request.data    # set progress's data blob to the request data blob made by the frontend
        progress.save()                 # saves it to the db
        return Response({'status': 'saved'})    # sends back a "all good g"

# You can probable just add a couple calls like that ^ where you store like
# user = request.user, level = request.level to store data for each level
# like your table has a user column, level column, and a score column or smth idk up to you