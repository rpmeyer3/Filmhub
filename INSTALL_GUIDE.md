# Installation Guide for Movie App

## Current Status
Python virtual environment is set up  
Django dependencies are installed  
Node.js and npm are not installed (needed for React frontend)

## What You Need to Install

### 1. Install Node.js (Required for Frontend)

Download and Install:
1. Go to https://nodejs.org/
2. Download the LTS version (currently Node.js 18.x or 20.x)
3. Run the installer (.msi file for Windows)
4. During installation, make sure "Add to PATH" is checked
5. Restart your command prompt/terminal after installation

Verify Installation:
```cmd
node --version
npm --version
```
You should see version numbers for both commands.

### 2. Backend Setup (Already Done!)
Your Python environment is already configured with these packages:
- Django==4.2.5
- djangorestframework==3.14.0
- django-cors-headers==4.2.0
- python-dotenv==1.0.0
- requests==2.31.0
- sendgrid==6.10.0
- python-http-client==3.3.7

## Next Steps After Installing Node.js

### 1. Install Frontend Dependencies
```cmd
cd Frontend
npm install
```

### 2. Set Up Environment Variables
```cmd
cd Backend
copy .env.example .env
```
Then edit the `.env` file with your API keys:
- Get OMDB API key from: https://www.omdbapi.com/
- Get SendGrid API key from: https://sendgrid.com/

### 3. Initialize Database
```cmd
cd Backend
python manage.py migrate
python manage.py createsuperuser
```

### 4. Start Development Servers
Terminal 1 (Backend):
```cmd
cd Backend
python manage.py runserver
```

Terminal 2 (Frontend):
```cmd
cd Frontend
npm start
```

## Troubleshooting

If you get "npm is not recognized":
- Node.js is not installed or not in your PATH
- Install Node.js from nodejs.org and restart your terminal

If you get Python errors:
- Make sure your virtual environment is activated: `venv\Scripts\activate`
- Your current environment should show `(venv)` in the prompt

If Django commands fail:
- Ensure you're in the Backend directory
- Ensure virtual environment is activated
- All Django packages are already installed

## File Structure After Setup
```
Software-Engineering/
├── Frontend/
│   ├── node_modules/     # Created after npm install
│   ├── package.json      Ready
│   └── src/             Ready
├── Backend/
│   ├── venv/            Already set up
│   ├── db.sqlite3       # Created after migrate
│   ├── manage.py        Ready
│   └── requirements.txt Installed
└── Database/            Ready
```
