from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')), # Include your auth app's URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login (gets access and refresh token)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh access token
]
