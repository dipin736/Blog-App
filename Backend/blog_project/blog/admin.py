from django.contrib import admin
from .models import Profile, BlogPost

# Register your models here.

# Register the Profile model
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'location', 'birth_date')  # Fields to display in the admin list view
    search_fields = ('user__username', 'bio', 'location')  # Fields to search by
    list_filter = ('location', 'birth_date')  # Add filters to the right side

# Register the BlogPost model
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at')  # Fields to display in the admin list view
    search_fields = ('title', 'content', 'author__username')  # Fields to search by
    list_filter = ('author', 'created_at')  # Add filters to the right side
    ordering = ('-created_at',)  # Default ordering by created_at descending
