# authentication/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Allows unauthenticated users to create a new account.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Allow anyone to register
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve the authenticated user's profile.
    Requires authentication.
    """
    permission_classes = (IsAuthenticated,) # Only authenticated users can access
    serializer_class = UserSerializer

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user

class LogoutView(APIView):
    """
    API endpoint for user logout.
    Blacklists the refresh token to invalidate it.
    """
    permission_classes = (IsAuthenticated,) # Only authenticated users can logout

    def post(self, request):
        try:
            # Get the refresh token from the request data
            # In a real app, the frontend would send the refresh token to be blacklisted
            # For simple_jwt, blacklisting is usually done on the refresh token
            # The access token is short-lived and doesn't need explicit invalidation server-side
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist() # Blacklist the refresh token

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': str(e)})

