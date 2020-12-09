from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from hikerrank.models import (
    Event, Trail, Profile, Follow_UnFollow, CheckIn, Review, Album,
    PendingRequest, ProcessedRequest, BroadcastMessage, Chat, Message,
)
from hikerrank.serializers import (
    SignupSerializer, EventSerializer, ProfileSerializer, UserSerializer,
    FollowUnfollowSerializer, CheckinSerializer, ReviewSerializer, AlbumSerializer,
    PendingRequestSerializer, ProcessedRequestSerializer, BroadcastMessageSerializer,
    TrailSerializer,MessageSerializer,
)

import math


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def create(self, request, *args, **kwargs):
        name = request.data['name']
        description = request.data['description']
        event_time = request.data['event_time']
        headcount = int(request.data['headcount'])
        initiator_id = int(request.data['initiator'])
        initiator = User.objects.get(id=initiator_id)
        trail_id = int(request.data['trail_id'])
        trail = Trail.objects.get(id=trail_id)
        event = Event(name=name, initiator=initiator, description=description,
                      event_time=event_time, trail=trail, headcount=headcount)
        event.save()
        chat = Chat(event=event)
        chat.save()
        return Response({'message': 'success'}, status=200)

    def update(self, request, *args, **kwargs):
        # update in event api
        status = request.data['status']
        event_id = request.data['event_id']
        Event.objects.filter(id=event_id).update(status=status)

        # update in broadcast-message api
        audience = Event.objects.get(id=event_id).participants.all()
        message = "The event \"" + Event.objects.get(id=event_id).name + "\" has been cancelled by the initiator."
        messageType = "cancelevent"
        msg = BroadcastMessage(message=message, messageType=messageType)
        msg.save()
        msg.audience.set(audience)
        return Response({'message': 'success'}, status=200)


class TrailViewSet(viewsets.ModelViewSet):
    queryset = Trail.objects.all()
    serializer_class = TrailSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

# helper functions for calculating distance between two coordinates
def degreesToRadians(degrees):
        return degrees * math.pi / 180.0
    

def distanceBetweenTwoCoordinates(lat1, lon1, lat2, lon2):
    earthRadiusKM = 6371

    dLat = degreesToRadians(lat2-lat1)
    dLon = degreesToRadians(lon2-lon1)

    lat1 = degreesToRadians(lat1)
    lat2 = degreesToRadians(lat2)
    a = math.sin(dLat / 2.0) * math.sin(dLat / 2.0) + math.sin(dLon / 2.0) * math.sin(dLon / 2.0) * math.cos(lat1) * math.cos(lat2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    # return distance in miles
    return earthRadiusKM * c / 1.609344


class TrailList(ListAPIView):
    serializer_class = TrailSerializer

    def get_queryset(self):
        # print('test')
        # print(self.request.query_params)

        # start with name filter
        queryset = Trail.objects.all()
        if 'name' in self.request.query_params and self.request.query_params['name'] != 'null':
            filter_name = self.request.query_params['name']
            queryset = queryset.filter(tname__icontains=filter_name) 

        # difficulty filter
        # Easiest, More Difficult, Most Diffecult, Unknown, not set
        if 'difficulty' in self.request.query_params and self.request.query_params['difficulty'] != 'null':
            filter_diff = self.request.query_params['difficulty']
            queryset = queryset.filter(difficulty=filter_diff)

        # trail type filter
        if 'type' in self.request.query_params and self.request.query_params['type'] != 'null':
            filter_type = self.request.query_params['type']
            if filter_type == 'Backpack':
                queryset = queryset.filter(backpack="Supported")
            if filter_type == 'Bicycle':
                queryset = queryset.filter(bicycle="Supported")
            if filter_type == 'Mountainbike':
                queryset = queryset.filter(mountainbike="Supported")
            if filter_type == 'Ski':
                queryset = queryset.filter(ski="Supported")
        
        # max length filter
        if 'maxlength' in self.request.query_params and self.request.query_params['maxLength'] != 'null':
            filter_mlen = float(self.request.query_params['maxlength'])
            queryset = queryset.filter(length__lte=filter_mlen)

        
        checked_queryset = set()
        for trail_obj in queryset:
            if len(checked_queryset) >= 200:
                break

            coordinates = trail_obj.map_info["data"]["geometry"]["coordinates"][0]
            if type(coordinates[0]) == type([1, 2, 3]):
                # in this case, the trail consists of multiple sub-trails
                coordinates = coordinates[0]
            if type(coordinates[0]) == type(0.123):
                lon_trail = float(coordinates[0])
                lat_trail = float(coordinates[1])
                lon_map = float(self.request.query_params['longtitude'])
                lat_map = float(self.request.query_params['latitude'])

                distance = distanceBetweenTwoCoordinates(lat_trail, lon_trail, lat_map, lon_map)

                if 'dislimit' in self.request.query_params and self.request.query_params['dislimit'] != 'null':
                    dislimit = float(self.request.query_params['dislimit'])
                else:
                    dislimit = 70.0
                
                if distance <= dislimit:
                    checked_queryset.add(trail_obj)
        
        return checked_queryset


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def create(self, request, *args, **kwargs):
        picture = request.data['picture']
        bio = request.data['bio']
        user_id = int(request.data['user'])
        user = User.objects.get(id=user_id)
        profile = Profile(user=user, bio=bio, picture=picture)
        profile.save()
        return Response({'message': 'success'}, status=200)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['POST', 'GET'])
@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        serializer = SignupSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            data['response'] = "successfully signed up"
            data['email'] = user.email
            data['username'] = user.username
            token = Token.objects.get(user=user).key
            data['token'] = token
            data['id'] = user.id
            profile = Profile(user=user)
            profile.save()
        else:
            data = serializer.errors
        return Response(data)


class CheckinViewSet(viewsets.ModelViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckinSerializer

    def create(self, request, *args, **kwargs):
        trail_id = int(request.data['trail'])
        user_id = int(request.data['User'])
        trail = Trail.objects.get(id=trail_id)
        user_profile = Profile.objects.get(user_id=user_id)
        checkin = CheckIn(trail=trail, User=user_profile)
        checkin.save()
        return Response({'message': 'success'}, status=200)


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    def create(self, request, *args, **kwargs):
        picture = request.data['picture']
        caption = request.data['caption']
        user_id = int(request.data['user'])
        user = User.objects.get(id=user_id)
        album = Album(user=user, caption=caption, picture=picture)
        album.save()

        return Response({'message': 'success'}, status=200)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):
        rating = request.data['rating']
        review_text = request.data['Review_text']
        trail_id = int(request.data['trail'])
        user_id = int(request.data['poster'])
        trail = Trail.objects.get(id=trail_id)
        poster_profile = Profile.objects.get(user_id=user_id)
        review = Review(rating=rating, Review_text=review_text, trail=trail, poster=poster_profile)
        review.save()
        return Response({'message': 'success'}, status=200)


class AuthTokenView(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
        })


class FollowUnfollowViewSet(viewsets.ModelViewSet):
    queryset = Follow_UnFollow.objects.all()
    serializer_class = FollowUnfollowSerializer

    def create(self, request, *args, **kwargs):
        user_id = int(request.data['user_id'])
        following_id = int(request.data['following_id'])
        user = User.objects.get(id=user_id)
        following = User.objects.get(id=following_id)
        new_follow = Follow_UnFollow(user=user, following=following)
        new_follow.save()
        return Response({'message': 'success'}, status=200)


class PendingRequestViewSet(viewsets.ModelViewSet):
    queryset = PendingRequest.objects.all()
    serializer_class = PendingRequestSerializer

    def create(self, request, *args, **kwargs):
        user_id = int(request.data['user'])
        event_id = int(request.data['event'])
        text = request.data['text']
        user = User.objects.get(id=user_id)
        event = Event.objects.get(id=event_id)
        new_request = PendingRequest(user=user, event=event, text=text)
        new_request.save()
        return Response({'message': 'success'}, status=200)


class BroadcastMessageViewSet(viewsets.ModelViewSet):
    queryset = BroadcastMessage.objects.all()
    serializer_class = BroadcastMessageSerializer


class ProcessedRequestViewSet(viewsets.ModelViewSet):
    queryset = ProcessedRequest.objects.all()
    serializer_class = ProcessedRequestSerializer

    def create(self, request, *args, **kwargs):
        user_id = int(request.data['user_id'])
        event_id = int(request.data['event_id'])
        status = request.data['status']
        user = User.objects.get(id=user_id)
        event = Event.objects.get(id=event_id)
        processed_request = ProcessedRequest(user=user, event=event, status=status)
        processed_request.save()

        if status == "Accepted":
            event.participants.add(user)
        return Response({'message': 'success'}, status=200)
