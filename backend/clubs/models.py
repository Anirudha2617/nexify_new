# Assuming this code is in a Django app named 'clubs'

# --- models.py ---
# This file defines the database schema for the application.

from django.db import models
from django.conf import settings # Use settings.AUTH_USER_MODEL for user model

# Reusing the provided interface names as Django models
class Club(models.Model):
    """
    Represents a club with members, and properties like public/private.
    """
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    logo = models.URLField(blank=True, null=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='clubs')

    def member_count(self):
        return self.members.count()
    
    def __str__(self):
        return self.name

class ClubMember(models.Model):
    """
    Represents a member's relationship to a club, including their role.
    """
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='club_memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='club_memberships')
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('moderator', 'Moderator'), ('member', 'Member')])
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'club',)

    def __str__(self):
        return f"{self.user.username} in club {self.club.name}"

class Message(models.Model):
    """
    Represents a chat message within a club.
    """
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, choices=[('text', 'Text'), ('image', 'Image'), ('file', 'File')], default='text')

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Message from {self.user.username} in club {self.club.name}"

class Event(models.Model):
    """
    Represents an event associated with a club.
    """
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='attending_events')
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title

class Poll(models.Model):
    """
    Represents a poll for a club.
    """
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='polls')
    question = models.CharField(max_length=255)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_polls')
    created_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField()

    def __str__(self):
        return self.question

class PollOption(models.Model):
    """
    Represents a single option within a poll.
    """
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    voters = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='voted_options')

    @property
    def votes(self):
        return self.voters.count()

    def __str__(self):
        return self.text