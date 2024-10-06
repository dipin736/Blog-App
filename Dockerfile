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
FROM python:3.9

#Set Environment Variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

#Copy Django Project to the container
COPY ./Backend/blog_project  /code/Backend/blog_project/ 

#Install the required packages
RUN pip install -r ./Backend/blog_project/requirements.txt

#Copy the frontend build to the Django project
COPY --from=build-stage ./code/Frontend/my-blog-app/build /code/Backend/blog_project/media/
COPY --from=build-stage ./code/Frontend/my-blog-app/build/media /code/Backend/blog_project/media/

#Run Django Migration Command
RUN python ./Backend/blog_project/manage.py migrate

#Run Django Collectstatic Command
RUN python ./Backend/blog_project/manage.py collectstatic --no-input

#Expose the port
EXPOSE 80

WORKDIR /code/Backend/blog_project

#Run the Django Server
CMD ["gunicorn","blog_project.wsgi:application","--bind","0.0.0.0:8000"]