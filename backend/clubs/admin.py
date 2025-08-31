# clubs/admin.py

from django.contrib import admin
from .models import Club, ClubMember, Message, Event, Poll, PollOption


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ("name", "id", "is_public", "created_at", "member_count")
    search_fields = ("name", "description")
    list_filter = ("is_public", "created_at")
    ordering = ("-created_at",)


@admin.register(ClubMember)
class ClubMemberAdmin(admin.ModelAdmin):
    list_display = ("user", "club", "role", "joined_at")
    search_fields = ("user__username", "club__name")
    list_filter = ("role", "joined_at")
    ordering = ("-joined_at",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("user", "club", "type", "timestamp", "short_content")
    search_fields = ("content", "user__username", "club__name")
    list_filter = ("type", "timestamp")
    ordering = ("-timestamp",)

    def short_content(self, obj):
        return (obj.content[:50] + "...") if len(obj.content) > 50 else obj.content
    short_content.short_description = "Content"


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "club", "start_date", "end_date", "created_by")
    search_fields = ("title", "description", "club__name")
    list_filter = ("start_date", "end_date", "club")
    ordering = ("-start_date",)


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ("question", "club", "created_by", "created_at", "ends_at")
    search_fields = ("question", "club__name", "created_by__username")
    list_filter = ("created_at", "ends_at")
    ordering = ("-created_at",)


@admin.register(PollOption)
class PollOptionAdmin(admin.ModelAdmin):
    list_display = ("text", "poll", "votes")
    search_fields = ("text", "poll__question")
    ordering = ("poll", "text")
