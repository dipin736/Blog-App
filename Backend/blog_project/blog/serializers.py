from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BlogPost, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'bio', 'location', 'birth_date', 'profile_picture']

    def update(self, instance, validated_data):
        instance.bio = validated_data.get('bio', instance.bio)
        instance.location = validated_data.get('location', instance.location)
        instance.birth_date = validated_data.get(
            'birth_date', instance.birth_date)
        instance.profile_picture = validated_data.get(
            'profile_picture', instance.profile_picture)
        instance.save()
        return instance


class BlogPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'
