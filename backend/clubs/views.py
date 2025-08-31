from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Club, Message, Event, Poll, PollOption
from .serializers import (
    ClubSerializer, MessageSerializer,
    EventSerializer, PollSerializer, PollOptionSerializer
)

class ClubViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows clubs to be viewed, created, joined, or left.
    """
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def join(self, request, *args, **kwargs):
        """Allows a user to join a club."""
        club = self.get_object()
        user = request.user

        if club.members.filter(id=user.id).exists():
            return Response({'detail': 'Already a member.'}, status=status.HTTP_400_BAD_REQUEST)

        club.members.add(user)
        return Response({'detail': 'Successfully joined.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def leave(self, request, *args, **kwargs):
        """Allows a user to leave a club."""
        club = self.get_object()
        user = request.user

        if not club.members.filter(id=user.id).exists():
            return Response({'detail': 'Not a member.'}, status=status.HTTP_400_BAD_REQUEST)

        club.members.remove(user)
        return Response({'detail': 'Successfully left.'}, status=status.HTTP_204_NO_CONTENT)


class MessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for messages inside a club.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        club_id = self.kwargs["club_id"]
        return Message.objects.filter(club_id=club_id).order_by("-timestamp")

    def perform_create(self, serializer):
        club_id = self.kwargs["club_id"]
        club = Club.objects.get(id=club_id)

        # 👀 check the validated data
        print("validated_data:", serializer.validated_data)

        # If you also want the raw incoming data
        print("initial_data:", serializer.initial_data)

        # save after debugging
        serializer.save(club=club, user=self.request.user)



class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing events within a club.
    """
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return Event.objects.filter(club_id=club_id).order_by("start_date")

    def perform_create(self, serializer):
        club_id = self.kwargs['club_id']
        club = Club.objects.get(id=club_id)
        serializer.save(created_by=self.request.user, club=club)

    @action(detail=True, methods=['post'])
    def join(self, request, *args, **kwargs):
        """Allows a user to join an event."""
        event = self.get_object()
        user = request.user

        if event.attendees.filter(id=user.id).exists():
            return Response({'detail': 'Already joined this event.'}, status=status.HTTP_400_BAD_REQUEST)

        event.attendees.add(user)
        return Response({'detail': 'Successfully joined event.'}, status=status.HTTP_204_NO_CONTENT)


class PollViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing polls within a club.
    """
    serializer_class = PollSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return Poll.objects.filter(club_id=club_id).order_by("-created_at")
    
    def perform_create(self, serializer):
        club_id = self.kwargs['club_id']
        club = Club.objects.get(id=club_id)
        serializer.save(created_by=self.request.user, club=club)

    @action(detail=True, methods=['post'])
    def vote(self, request, *args, **kwargs):
        """Allows a user to vote on a poll option."""
        poll = self.get_object()
        option_id = request.data.get('optionId')

        if not option_id:
            return Response({'detail': 'optionId is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            option = PollOption.objects.get(id=option_id, poll=poll)
        except PollOption.DoesNotExist:
            return Response({'detail': 'Invalid poll option.'}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent double-voting
        if option.voters.filter(id=request.user.id).exists():
            return Response({'detail': 'You already voted for this option.'}, status=status.HTTP_400_BAD_REQUEST)

        option.voters.add(request.user)
        return Response({'detail': 'Vote recorded.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def add_option(self, request, *args, **kwargs):
        """Allows adding options to a poll."""
        poll = self.get_object()
        serializer = PollOptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(poll=poll)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
