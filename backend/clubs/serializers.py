from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Club, ClubMember, Message, Event, Poll, PollOption

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """A serializer for the User model, showing basic information."""
    class Meta:
        model = User
        fields = ('id', 'username')


class ClubSerializer(serializers.ModelSerializer):
    memberCount = serializers.IntegerField(source='member_count', read_only=True)
    members = UserSerializer(many=True, read_only=True)
    isPublic = serializers.BooleanField(source='is_public', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Club
        fields = (
            'id', 'name', 'description', 'logo',
            'memberCount', 'isPublic', 'createdAt', 'members'
        )
        read_only_fields = ('createdAt', 'id')


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    clubId = serializers.UUIDField(source='club.id', read_only=True)
    userId = serializers.UUIDField(source='user.id', read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'content', 'clubId', 'userId', 'timestamp', 'user', 'type')
        read_only_fields = ('id', 'timestamp', 'user', 'clubId', 'userId')


class EventSerializer(serializers.ModelSerializer):
    clubId = serializers.UUIDField(source='club.id', read_only=True)
    createdBy = serializers.UUIDField(source='created_by.id', read_only=True)
    startDate = serializers.DateTimeField(source='start_date', read_only=True)
    endDate = serializers.DateTimeField(source='end_date', read_only=True)
    attendees = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'description', 'startDate', 'endDate',
            'clubId', 'createdBy', 'attendees', 'location'
        )
        read_only_fields = ('id', 'createdBy', 'attendees', 'clubId')


class PollOptionSerializer(serializers.ModelSerializer):
    votes = serializers.IntegerField(read_only=True)
    voters = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = PollOption
        fields = ('id', 'text', 'votes', 'voters')
        read_only_fields = ('id', 'votes', 'voters')


class PollSerializer(serializers.ModelSerializer):
    clubId = serializers.UUIDField(source='club.id', read_only=True)
    createdBy = serializers.UUIDField(source='created_by.id', read_only=True)
    options = PollOptionSerializer(many=True, required=False)  # ✅ remove read_only
    totalVotes = serializers.IntegerField(source='total_votes', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    endsAt = serializers.DateTimeField(source='ends_at')  # writable

    class Meta:
        model = Poll
        fields = (
            'id', 'question', 'options', 'clubId',
            'createdBy', 'createdAt', 'endsAt', 'totalVotes'
        )
        read_only_fields = (
            'id', 'createdBy', 'clubId',
            'createdAt', 'totalVotes'
        )

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        poll = Poll.objects.create(**validated_data)
        for option_data in options_data:
            PollOption.objects.create(poll=poll, **option_data)
        return poll
