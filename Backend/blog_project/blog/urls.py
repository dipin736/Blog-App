from django.urls import path, re_path
from .views import RegisterAPIView, LoginAPIView, BlogPostListCreateAPIView, BlogPostDetailAPIView, ProfileAPIView, index

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path('posts/', BlogPostListCreateAPIView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', BlogPostDetailAPIView.as_view(), name='post-detail'),
    re_path(r'^(?:.*)/?$', index, name='index'),  
]
