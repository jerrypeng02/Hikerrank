from django.db import models

from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
User._meta.get_field('email')._unique = True
from datetime import datetime


def profile_picture_upload_path(instance, filename):
    return '/'.join([str(instance.user.username), filename])


def profile_album_upload_path(instance, filename):
    return '/'.join([str(instance.user.username), filename])


def json_default():
    return {'foo': 'bar'}


# id link to user id
class Profile(models.Model):
    user = models.OneToOneField(User, primary_key=True, default=None, on_delete=models.PROTECT)
    bio = models.TextField(default="Tell me about yourself...", blank=True)
    picture = models.FileField(default="default-picture.png", max_length=255, upload_to=profile_picture_upload_path)


class Trail(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    tname = models.CharField(max_length=200)
    tclass = models.CharField(max_length=100)
    surface = models.CharField(max_length=100)
    length = models.FloatField()
    backpack = models.CharField(max_length=100)
    bicycle = models.CharField(max_length=100)
    mountainbike = models.CharField(max_length=100)
    ski = models.CharField(max_length=100)
    width = models.FloatField(default=0)
    difficulty = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    map_info = models.JSONField(default=dict)


class Event(models.Model):
    initiator = models.ForeignKey(User, default=None, on_delete=models.PROTECT, related_name="initiator")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    post_time = models.DateTimeField(auto_now_add=True)
    event_time = models.DateTimeField(default=datetime.now)
    trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    headcount = models.IntegerField(default=0)
    participants = models.ManyToManyField(User, related_name="participants", blank=True)
    status = models.CharField(max_length=10, default="normal")  # accept denied


class Message(models.Model):
    author = models.ForeignKey(User, related_name='author_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Chat(models.Model):
    event = models.OneToOneField(Event, primary_key=True, default=None, on_delete=models.CASCADE)
    messages = models.ManyToManyField(Message, blank=True)


class Photo(models.Model):
    picture = models.FileField(upload_to='')
    content_type = models.CharField(max_length=50, default='image/jpeg')
    Trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    Event = models.ForeignKey(Event, on_delete=models.CASCADE)


class Album(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    picture = models.FileField(default="welcome-image.jpg", max_length=255, upload_to=profile_album_upload_path)
    caption = models.TextField(blank=True)
    time = models.DateTimeField(auto_now_add=True)


class CheckIn(models.Model):
    trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    User = models.ForeignKey(Profile, on_delete=models.CASCADE)
    Time = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    poster = models.ForeignKey(Profile, on_delete=models.CASCADE)
    trail = models.ForeignKey(Trail, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=5)
    Review_text = models.TextField(blank=True)


class Follow_UnFollow(models.Model):
    time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="this_user")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")


class PendingRequest(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(blank=True)
    time = models.DateTimeField(auto_now_add=True)


class ProcessedRequest(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10)  # accept denied
    time = models.DateTimeField(auto_now_add=True)


class BroadcastMessage(models.Model):
    audience = models.ManyToManyField(User, related_name="audience", blank=True)
    message = models.TextField(blank=True)
    messageType = models.TextField(blank=True)  # cancelevent, acceptrequest, declinerequest
    time = models.DateTimeField(auto_now_add=True)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
