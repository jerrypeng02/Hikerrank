"""webapps URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.Home, name='Home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='Home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from django.views.decorators.csrf import csrf_exempt
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static

from hikerrank import views

router = routers.DefaultRouter()

router.register(r'trail', views.TrailViewSet)
router.register(r'event', views.EventViewSet)
router.register(r'profile', views.ProfileViewSet)
router.register(r'user', views.UserViewSet)
router.register(r'follow-unfollow', views.FollowUnfollowViewSet)
router.register(r'checkin', views.CheckinViewSet)
router.register(r'review', views.ReviewViewSet)
router.register(r'album', views.AlbumViewSet)
router.register(r'pending-request', views.PendingRequestViewSet)
router.register(r'processed-request', views.ProcessedRequestViewSet)
router.register(r'broadcast-message', views.BroadcastMessageViewSet)

router.register(r'message', views.MessageViewSet)

# router.register(r'trail-search', views.TrailSearchViewSet)
# router.register(r'^trail-list/(?P<lontitude>.+)/$', views.TrailList)


urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                  path('api/', include(router.urls)),
                  path('trail-list/', views.TrailList.as_view(), name="trail-list"),
                  path('auth/signup', csrf_exempt(views.signup_view), name="signup"),
                  path('auth/login', views.AuthTokenView.as_view(), name="login"),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [url(r'^', TemplateView.as_view(template_name='index.html'))]
