# Blog Project

## Project Overview
The Blog Project is a simple blogging platform built using Django, allowing users to register, log in, and manage blog posts. It uses a MySQL database hosted on AWS RDS for data storage and is easily deployable on an EC2 instance.

## Setup and Installation Steps

### Prerequisites
- Python 3.x
- pip
- MySQL server (local or AWS RDS)
- Docker (optional)
- GitHub for version control and CodePipeline

### Installation
1. Clone the repository:
   git clone <repository-url>
   
   cd blog_project
   
Create a virtual environment and activate it:

python -m venv venv

source venv/bin/activate  # Windows: venv\Scripts\activate

Install required packages:

pip install -r requirements.txt

Configure database settings in blog_project/settings.py:

python

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '3306',
    }
}

Run migrations:

python manage.py migrate

Create a superuser:

python manage.py createsuperuser

Running the Application

Locally

python manage.py runserver

Access at http://127.0.0.1:8000.

With Docker

Build the image:

docker build -t blog:latest .

Run the container:

docker run -p 8000:8000 blog:latest

Access at http://localhost:8000.

## API Documentation (REST Endpoints)
POST /api/register/: User registration.

POST /api/login/: User login.

GET /api/posts/: List all blog posts.

POST /api/posts/: Create a new blog post.

GET /api/posts/{id}/: Retrieve a specific blog post.

PUT /api/posts/{id}/: Update a blog post.

DELETE /api/posts/{id}/: Delete a blog post.

## Deployment Steps
Launch an EC2 instance in AWS.
SSH into the instance and install Docker.
Deploy the application using Docker:
Pull or build the image and run the container.
Connect to RDS by configuring security groups.
Access via the EC2 public IP address.
Continuous Deployment with GitHub CodePipeline
Set up a GitHub repository for your project.
Create a new CodePipeline in the AWS Management Console.
Choose GitHub as the source provider and connect your repository.
Configure build and deployment settings as needed.
Your application will automatically deploy on each commit to the main branch.
