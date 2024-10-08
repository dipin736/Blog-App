#!/bin/bash

# Start Nginx in the background
service nginx start

# Start Gunicorn
exec gunicorn blog_project.wsgi:application --bind 0.0.0.0:8000
