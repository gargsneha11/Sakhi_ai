# Sakhi Backend Setup Guide

## Step 1 — Install Python
Download from https://python.org and install it.
Make sure to check "Add Python to PATH" during install.

## Step 2 — Open terminal in the backend folder
```
cd "e:\local disk d\Sakhi\backend"
```

## Step 3 — Install required packages
```
pip install flask flask-cors
```

## Step 4 — Run the Flask server
```
python app.py
```

You should see:
```
✅ Database ready. Starting Flask on http://localhost:5000
```

## Step 5 — Run the React frontend (in a separate terminal)
```
cd "e:\local disk d\Sakhi"
npm run dev
```

## How it works
- Flask runs on http://localhost:5000
- React runs on http://localhost:5173
- React talks to Flask using fetch() calls in src/utils/api.js
- All user data (goals, notes, progress) is saved in backend/sakhi.db (SQLite file)
- Data persists forever — even after closing browser or restarting computer

## What is saved in the database
- sakhi.db → users, goals, progress, notes tables
- This file is created automatically when you run app.py

## Important
- Always start Flask BEFORE opening the React app
- Both terminals must be running at the same time
