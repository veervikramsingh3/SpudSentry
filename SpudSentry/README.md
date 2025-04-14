# SpudSentry - Potato Disease Detection System

A web-based machine learning application for detecting potato plant diseases, created by Ritika Chaudhary (2022000850) and Veer Vikram Singh (2022007952) from the Computer Science Department, Sharda University.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation Instructions](#installation-instructions)
- [Deployment to GitHub](#deployment-to-github)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Contact Information](#contact-information)

## Features
- Detect 11 different potato plant diseases using image analysis
- User authentication system with registration and login
- Personal detection history management
- Public/private detection visibility control
- Interactive statistics dashboard
- Responsive design for all devices
- Detailed disease information and treatment recommendations

## Technologies Used
- **Backend**: Python, Flask, Flask-Login, Flask-WTF
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Database**: PostgreSQL with SQLAlchemy ORM
- **ML & Image Processing**: TensorFlow, OpenCV
- **Data Visualization**: Chart.js

## Installation Instructions

### Prerequisites
- Python 3.8 or higher
- PostgreSQL database
- Git

### Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/spudsentry.git
cd spudsentry
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install the required dependencies:
```bash
pip install -r deployment_requirements.txt
```

## Database Setup

1. Create a PostgreSQL database for the application

2. Create a `.env` file in the project root with the following content:
```
DATABASE_URL=postgresql://username:password@localhost:5432/databasename
FLASK_SECRET_KEY=your_secret_key_here
```

## Running the Application

1. Make sure your database is running and properly configured

2. Run the Flask application:
```bash
# Development server
python main.py

# Production server
gunicorn --bind 0.0.0.0:5000 main:app
```

3. Access the application at http://localhost:5000

## Deployment to GitHub

1. Create a GitHub account if you don't have one at [GitHub](https://github.com/)

2. Install Git on your local machine if not already installed

3. Create a new repository on GitHub:
   - Click the "+" icon in the top right corner
   - Select "New repository"
   - Name your repository (e.g., "spudsentry")
   - Choose public or private visibility
   - Click "Create repository"

4. Initialize your local directory as a Git repository:
```bash
git init
```

5. Add your files to the repository:
```bash
git add .
```

6. Commit your changes:
```bash
git commit -m "Initial commit"
```

7. Add the remote GitHub repository URL:
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
```

8. Push your code to GitHub:
```bash
git push -u origin main
```

### Deploying to GitHub Pages (Static Content Only)

For static content hosting:

1. Create a new branch named `gh-pages`:
```bash
git checkout -b gh-pages
```

2. Push this branch to GitHub:
```bash
git push origin gh-pages
```

3. Go to your GitHub repository's "Settings" tab, then navigate to "Pages"

4. Select the `gh-pages` branch as the source and click "Save"

### For Full Stack Deployment

For the complete application with backend functionality, consider using:

- [Heroku](https://www.heroku.com/)
- [PythonAnywhere](https://www.pythonanywhere.com/)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [Google Cloud Platform](https://cloud.google.com/)

## Contact Information

- **Veer Vikram Singh**: 
  - Email: 2022007952.veer@ug.sharda.ac.in 
  - Roll Number: 2022007952

- **Ritika Chaudhary**: 
  - Email: 2022000850.ritika@ug.sharda.ac.in
  - Roll Number: 2022000850

- **Department**: Computer Science Department, Sharda University, Greater Noida, Uttar Pradesh