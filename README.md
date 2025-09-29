# 🌱 CropGuard - Plant Disease Detection System

A full-stack web application for detecting crop diseases using machine learning, built with Django REST API backend and React frontend.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Disease Detection**: Upload images to detect crop diseases using ML model
- **User-Specific Dashboard**: Personalized statistics and detection history
- **Activity Timeline**: Track user activities and detection results
- **Real-time Updates**: Dynamic dashboard with live statistics
- **Email Notifications**: Welcome emails for new registrations

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (can be upgraded to PostgreSQL for production)
- **TensorFlow 2.10.0** - Machine learning model
- **Pillow** - Image processing
- **Django CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 18** - User interface
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Dropzone** - File uploads
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
CropGuard/
├── crop_disease_detection/     # Django project settings
├── detection/                  # Main Django app
│   ├── models.py              # Database models
│   ├── views.py               # API endpoints
│   ├── ml_model.py            # ML model integration
│   └── email_service.py       # Email functionality
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   └── context/          # React context providers
├── models/                    # ML model storage
│   └── crop_disease_model.keras
├── media/                     # Uploaded images
├── templates/                 # Django templates
├── .venv/                     # Python virtual environment
├── db.sqlite3                 # Database file
├── requirements.txt           # Python dependencies
└── manage.py                 # Django management script
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Activate virtual environment
source .venv/Scripts/activate  # Windows
# or
source .venv/bin/activate      # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

## 🌐 API Endpoints

- `POST /api/register/` - User registration
- `POST /api/login/` - User authentication
- `POST /api/logout/` - User logout
- `GET /api/user/` - Get current user info
- `POST /api/detect/` - Disease detection
- `GET /api/history/` - User detection history

## 📊 Database Models

### UserStatistics
- `total_scans` - Total number of detections
- `diseased_plants` - Count of diseased plants detected
- `healthy_plants` - Count of healthy plants detected

### UserActivity
- `activity_type` - Type of activity (login, detection, register)
- `description` - Activity description
- `crop` - Detected crop (for detections)
- `disease` - Detected disease (for detections)
- `confidence` - Prediction confidence

### DiseaseDetection
- `user` - Associated user
- `image` - Uploaded image
- `prediction` - ML model prediction
- `confidence` - Prediction confidence
- `timestamp` - Detection timestamp

## 🔧 Configuration

### Environment Variables
- `EMAIL_HOST_USER` - Gmail address for sending emails
- `EMAIL_HOST_PASSWORD` - Gmail app password

### CORS Settings
Configured for development with localhost origins:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

## 🎯 Features in Detail

### User Authentication
- Email-based registration and login
- Session-based authentication
- Secure password handling
- Email validation and welcome emails

### Disease Detection
- Support for multiple crop types
- Real-time ML model predictions
- Confidence scoring
- Image preprocessing and validation

### Dashboard Features
- User-specific statistics
- Detection history with timestamps
- Activity timeline
- Real-time updates after new detections

## 🚀 Deployment

### Backend Deployment
1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Set `DEBUG = False` in settings
4. Use production WSGI server (Gunicorn)

### Frontend Deployment
1. Build production version: `npm run build`
2. Serve static files with nginx or similar
3. Configure API endpoint URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**CropGuard** - Protecting crops through intelligent disease detection 🌱🔍 