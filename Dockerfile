#Stage 1:Build Frontend
FROM node:18 as build-stage

WORKDIR /code

COPY ./Frontend/my-blog-app/ /code/Frontend/my-blog-app/

WORKDIR /code/Frontend/my-blog-app/

#Installing packages
RUN npm install

#Building the frontend
RUN npm run build


#Stage 2:Build Backend
FROM python:3.11.0

#Set Environment Variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

#Copy Django Project to the container
COPY ./Backend/blog_project  /code/Backend/blog_project/ 

#Install the required packages
RUN pip install -r ./Backend/blog_project/requirements.txt

#Copy the frontend build to the Django project



#Copy the frontend build to the Django project
COPY --from=build-stage ./code/Frontend/my-blog-app/build /code/Backend/blog_project/static/
COPY --from=build-stage ./code/Frontend/my-blog-app/build/static /code/Backend/blog_project/static/
COPY --from=build-stage ./code/Frontend/my-blog-app/build/index.html /code/Backend/blog_project/blog_project/templates/index.html

# Ensure media directory exists
RUN mkdir -p /code/Backend/blog_project/media

# Set MEDIA_ROOT environment variable
ENV MEDIA_ROOT=/code/Backend/blog_project/media

# Run Django Migration Command
RUN python ./Backend/blog_project/manage.py migrate

#Run Django Collectstatic Command
RUN python ./Backend/blog_project/manage.py collectstatic --no-input

#Expose the port
EXPOSE 80

WORKDIR /code/Backend/blog_project

#Run the Django Server
CMD ["gunicorn","blog_project.wsgi:application","--bind","0.0.0.0:8000"]