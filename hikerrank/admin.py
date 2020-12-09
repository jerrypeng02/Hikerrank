from django.contrib import admin
from .models import Profile, Trail, Event, Photo, CheckIn, Review, Follow_UnFollow, Chat, Message

# Register your models here.
admin.site.register(Profile)
admin.site.register(Trail)
admin.site.register(Event)
admin.site.register(Photo)
admin.site.register(CheckIn)
admin.site.register(Review)
admin.site.register(Follow_UnFollow)
admin.site.register(Chat)
admin.site.register(Message)