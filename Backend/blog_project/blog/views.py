from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Profile, BlogPost
from .serializers import UserSerializer, ProfileSerializer, BlogPostSerializer

class RegisterAPIView(APIView): 
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Create the user

            # Create the profile
            profile_data = {
                'bio': request.data.get('bio', ''),
                'location': request.data.get('location', ''),
                'birth_date': request.data.get('birth_date'),
                'profile_picture': request.FILES.get('profile_picture')
            }
            profile = Profile.objects.create(user=user, **profile_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)  # Allow partial updates

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions  # Make sure to import permissions
from .models import BlogPost  # Import your BlogPost model
from .serializers import BlogPostSerializer  # Import your serializer

class BlogPostListCreateAPIView(APIView):
    # Set permission_classes to allow unrestricted access
    permission_classes = [permissions.AllowAny]  # Allow any user to access this view

    def get(self, request):
        # Fetch all posts
        posts = BlogPost.objects.all()
        serializer = BlogPostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Author is set to the currently authenticated user
        request.data['author'] = request.user.id  # Set the author to the logged-in user
        serializer = BlogPostSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogPostDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        serializer = BlogPostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        if post.author != request.user:
            return Response({'detail': 'You do not have permission to edit this post.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BlogPostSerializer(post, data=request.data)

        if serializer.is_valid():
            serializer.save(author=request.user)  # Set author to current user
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        post = get_object_or_404(BlogPost, pk=pk)
        if post.author != request.user:
            return Response({'detail': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
