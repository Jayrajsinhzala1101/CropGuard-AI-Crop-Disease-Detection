# 🌱 CropGuard React Frontend

A modern, beautiful React frontend for the CropGuard crop disease detection system.

## 🚀 Features

- **Modern UI/UX** - Built with React, Tailwind CSS, and Framer Motion
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Camera Integration** - Capture images directly from device camera
- **File Upload** - Drag & drop or click to upload images
- **Real-time Analysis** - Instant disease detection with confidence scores
- **Beautiful Animations** - Smooth transitions and micro-interactions
- **Authentication** - Secure login and registration system
- **Dashboard** - Comprehensive statistics and detection history

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Django backend running on http://127.0.0.1:8000

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## 📱 How to Use

### 1. Authentication
- Register a new account or login with existing credentials
- Secure authentication with Django backend

### 2. Dashboard
- View detection statistics and history
- Monitor healthy plants vs diseases found
- Access recent detection results

### 3. Disease Detection
- **Camera Capture**: Click "Camera Capture" to use your device camera
- **File Upload**: Drag & drop or click to upload images
- **Analysis**: Click "Analyze Image" to detect diseases
- **Results**: View disease name and confidence percentage

## 🎨 Technologies Used

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Beautiful animations
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Webcam** - Camera integration
- **React Dropzone** - File upload functionality

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Project Structure

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.js      # Navigation component
│   │   └── Loading.js     # Loading spinner
│   ├── context/           # React context
│   │   └── AuthContext.js # Authentication context
│   ├── pages/             # Page components
│   │   ├── Login.js       # Login page
│   │   ├── Register.js    # Registration page
│   │   ├── Dashboard.js   # Dashboard page
│   │   └── Detect.js      # Disease detection page
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies
└── tailwind.config.js    # Tailwind configuration
```

## 🎯 Key Features

### Modern Design
- Clean, minimalist interface
- Smooth animations and transitions
- Responsive design for all devices
- Beautiful color scheme and typography

### User Experience
- Intuitive navigation
- Real-time feedback
- Loading states and error handling
- Progressive enhancement

### Camera Integration
- Direct camera access
- Image capture functionality
- Preview before analysis
- Download captured images

### File Upload
- Drag & drop interface
- Multiple file format support
- Image preview
- Upload progress indicators

## 🔗 API Integration

The frontend communicates with the Django backend through REST APIs:

- **Authentication**: `/api/login/`, `/api/register/`, `/api/logout/`
- **Disease Detection**: `/api/detect/`
- **History**: `/api/history/`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the `build` folder to S3
- **Django Static Files**: Copy build files to Django static directory

## 🎨 Customization

### Colors
Modify the color scheme in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#22c55e', // Your brand color
  }
}
```

### Animations
Customize animations in `src/index.css`:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Components
All components are modular and can be easily customized or extended.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies** 