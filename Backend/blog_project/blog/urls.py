from django.urls import path
from .views import RegisterAPIView, LoginAPIView, BlogPostListCreateAPIView, BlogPostDetailAPIView, ProfileAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path('posts/', BlogPostListCreateAPIView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', BlogPostDetailAPIView.as_view(), name='post-detail'),
]
