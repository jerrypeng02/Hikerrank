# Generated by Django 3.1.3 on 2020-12-01 04:55

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import hikerrank.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0014_auto_20201129_0007'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('post_time', models.DateTimeField(auto_now_add=True)),
                ('event_time', models.DateTimeField(default=datetime.datetime.now)),
                ('headcount', models.IntegerField(default=0)),
                ('status', models.CharField(default='normal', max_length=10)),
                ('initiator', models.ForeignKey(default=None, on_delete=django.db.models.deletion.PROTECT, related_name='initiator', to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(blank=True, related_name='participants', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('user', models.OneToOneField(default=None, on_delete=django.db.models.deletion.PROTECT, primary_key=True, serialize=False, to='auth.user')),
                ('bio', models.TextField(blank=True, default='Tell me about yourself...')),
                ('picture', models.FileField(default='default-picture.png', max_length=255, upload_to=hikerrank.models.profile_picture_upload_path)),
            ],
        ),
        migrations.CreateModel(
            name='Trail',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('tname', models.CharField(max_length=200)),
                ('tclass', models.CharField(max_length=100)),
                ('surface', models.CharField(max_length=100)),
                ('length', models.FloatField()),
                ('backpack', models.CharField(max_length=100)),
                ('bicycle', models.CharField(max_length=100)),
                ('mountainbike', models.CharField(max_length=100)),
                ('ski', models.CharField(max_length=100)),
                ('width', models.FloatField(default=0)),
                ('difficulty', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('map_info', models.JSONField(default=dict)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('rating', models.IntegerField(default=5)),
                ('Review_text', models.TextField(blank=True)),
                ('poster', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.profile')),
                ('trail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.trail')),
            ],
        ),
        migrations.CreateModel(
            name='ProcessedRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=10)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.event')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picture', models.FileField(upload_to='')),
                ('content_type', models.CharField(default='image/jpeg', max_length=50)),
                ('Event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.event')),
                ('Trail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.trail')),
            ],
        ),
        migrations.CreateModel(
            name='PendingRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(blank=True)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.event')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='author_messages', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Follow_UnFollow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='this_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='trail',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.trail'),
        ),
        migrations.CreateModel(
            name='CheckIn',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Time', models.DateTimeField(auto_now_add=True)),
                ('User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.profile')),
                ('trail', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hikerrank.trail')),
            ],
        ),
        migrations.CreateModel(
            name='BroadcastMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(blank=True)),
                ('messageType', models.TextField(blank=True)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('audience', models.ManyToManyField(blank=True, related_name='audience', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('picture', models.FileField(default='welcome-image.jpg', max_length=255, upload_to=hikerrank.models.profile_album_upload_path)),
                ('caption', models.TextField(blank=True)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('event', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='hikerrank.event')),
                ('messages', models.ManyToManyField(blank=True, to='hikerrank.Message')),
            ],
        ),
    ]
