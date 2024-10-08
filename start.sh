#!/bin/bash

# Start Nginx
service nginx start

# Start Gunicorn using the correct path to wsgi
exec gunicorn blog_project.blog_project.wsgi:application --bind 0.0.0.0:8000
