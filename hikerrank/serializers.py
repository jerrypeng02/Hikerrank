from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from hikerrank.models import (
    Event, Trail, Profile, Follow_UnFollow, CheckIn, Review, Album,
    PendingRequest, ProcessedRequest, BroadcastMessage, Message
)


class SignupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        # We check if password and confirm password equals in the front end before sending the data
        # to the back end rest framework API
        user.save()
        return user


class TrailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trail
        fields = '__all__'


class CheckinSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CheckIn
        fields = '__all__'


class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class FollowUnfollowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Follow_UnFollow
        fields = '__all__'

        validators = [
            UniqueTogetherValidator(
                queryset=Follow_UnFollow.objects.all(),
                fields=['user', 'following']
            )
        ]


class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class PendingRequestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PendingRequest
        fields = '__all__'


class ProcessedRequestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProcessedRequest
        fields = '__all__'


class BroadcastMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BroadcastMessage
        fields = '__all__'


class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
