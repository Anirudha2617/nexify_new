from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClubViewSet, MessageViewSet, EventViewSet, PollViewSet

router = DefaultRouter()
router.register(r'clubs', ClubViewSet, basename="club")

urlpatterns = [
    path('clubs/<int:club_id>/messages/', MessageViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='club-messages'),

    path('clubs/<int:club_id>/events/', EventViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='club-events'),

    # ✅ Poll list & create
    path('clubs/<int:club_id>/polls/', PollViewSet.as_view({
        'get': 'list', 'post': 'create'
    }), name='club-polls'),

    # ✅ Poll detail
    path('clubs/<int:club_id>/polls/<int:pk>/', PollViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='club-poll-detail'),

    # ✅ Poll custom actions
    path('clubs/<int:club_id>/polls/<int:pk>/vote/', PollViewSet.as_view({'post': 'vote'}), name='poll-vote'),
    path('clubs/<int:club_id>/polls/<int:pk>/add_option/', PollViewSet.as_view({'post': 'add_option'}), name='poll-add-option'),

    # Router URLs last
    path('', include(router.urls)),
]
