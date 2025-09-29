import numpy as np
import cv2
from PIL import Image
import os
from django.conf import settings
import logging
import tensorflow as tf
from tensorflow import keras

logger = logging.getLogger(__name__)

class CropDiseasePredictor:
    """
    Machine Learning Model Handler for Crop Disease Detection
    Designed to work with Keras model files
    """
    
    def __init__(self, model_path=None):
        """
        Initialize the ML model predictor
        
        Args:
            model_path (str): Path to the .keras model file
        """
        self.model = None
        self.model_path = model_path or os.path.join(settings.BASE_DIR, 'models', 'crop_disease_model.keras')
        self.class_names = [
            'Apple___Apple_scab',
            'Apple___Black_rot',
            'Apple___Cedar_apple_rust',
            'Apple___healthy',
            'Cherry___healthy',
            'Cherry___Powdery_mildew',
            'Corn___Cercospora_leaf_spot Gray_leaf_spot',
            'Corn___Common_rust',
            'Corn___healthy',
            'Corn___Northern_Leaf_Blight',
            'Grape___Black_rot',
            'Grape___Esca_(Black_Measles)',
            'Grape___healthy',
            'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
            'Peach___Bacterial_spot',
            'Peach___healthy',
            'Pepper,_bell___Bacterial_spot',
            'Pepper,_bell___healthy',
            'Potato___Early_blight',
            'Potato___healthy',
            'Potato___Late_blight',
            'Strawberry___healthy',
            'Strawberry___Leaf_scorch',
            'Tomato___Bacterial_spot',
            'Tomato___Early_blight',
            'Tomato___healthy',
            'Tomato___Late_blight',
            'Tomato___Leaf_Mold',
            'Tomato___Septoria_leaf_spot',
            'Tomato___Spider_mites Two-spotted_spider_mite',
            'Tomato___Target_Spot',
            'Tomato___Tomato_mosaic_virus',
            'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
        ]
        self.load_model()
    
    def load_model(self):
        """
        Load the ML model from .keras file
        """
        try:
            if os.path.exists(self.model_path):
                # Load the Keras model
                self.model = keras.models.load_model(self.model_path)
                logger.info(f"Keras model loaded successfully from {self.model_path}")
            else:
                logger.warning(f"Model file not found at {self.model_path}")
                # For now, we'll use a dummy model until you upload the real one
                self.model = self._create_dummy_model()
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.model = self._create_dummy_model()
    
    def _create_dummy_model(self):
        """
        Create a dummy model for testing until real model is uploaded
        """
        class DummyModel:
            def predict(self, X):
                # Return random predictions for testing
                return np.random.choice([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], size=X.shape[0])
            
            def predict_proba(self, X):
                # Return random probabilities for testing
                probas = np.random.rand(X.shape[0], 38)
                return probas / probas.sum(axis=1, keepdims=True)
        
        return DummyModel()
    
    def preprocess_image(self, image):
        """
        Preprocess image for model prediction
        
        Args:
            image: PIL Image or numpy array
            
        Returns:
            numpy array: Preprocessed image
        """
        try:
            # Convert to PIL Image if it's not already
            if isinstance(image, np.ndarray):
                image = Image.fromarray(image)
            
            # Resize image to standard size (128x128 as expected by the model)
            image = image.resize((128, 128))
            
            # Convert to numpy array
            image_array = np.array(image)
            
            # Normalize pixel values (0-255 to 0-1)
            image_array = image_array.astype('float32') / 255.0
            
            # Add batch dimension if needed
            if len(image_array.shape) == 3:
                image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise
    
    def predict(self, image):
        """
        Predict crop disease from image
        
        Args:
            image: PIL Image or numpy array
            
        Returns:
            dict: Prediction results with class, confidence, and treatment
        """
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image)
            
            # Make prediction with Keras model
            predictions = self.model.predict(processed_image, verbose=0)
            
            # Get predicted class
            predicted_class = int(np.argmax(predictions[0]))
            confidence = float(predictions[0][predicted_class])
            
            # Get class name
            class_name = self.class_names[predicted_class]
            
            # Parse crop and disease from class name
            if '___' in class_name:
                crop, disease = class_name.split('___', 1)
            else:
                crop = "Unknown"
                disease = class_name
            
            # Determine if healthy or diseased
            is_healthy = 'healthy' in disease.lower()
            
            # Get treatment suggestions
            treatment = self._get_treatment_suggestion(crop, disease, is_healthy)
            
            return {
                'crop': crop,
                'disease': disease,
                'confidence': confidence,
                'is_healthy': is_healthy,
                'treatment': treatment,
                'class_id': predicted_class
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            return {
                'crop': 'Unknown',
                'disease': 'Detection Failed',
                'confidence': 0.0,
                'is_healthy': False,
                'treatment': 'Please try uploading a clearer image.',
                'class_id': -1
            }
    
    def _get_treatment_suggestion(self, crop, disease, is_healthy):
        """
        Get treatment suggestions based on crop and disease
        
        Args:
            crop (str): Crop name
            disease (str): Disease name
            is_healthy (bool): Whether the plant is healthy
            
        Returns:
            str: Treatment suggestion
        """
        if is_healthy:
            return f"Your {crop} plant appears to be healthy! Continue with regular care and monitoring."
        
        treatments = {
            'Apple': {
                'Apple_scab': 'Apply fungicides containing captan or myclobutanil. Remove infected leaves and maintain good air circulation.',
                'Black_rot': 'Prune infected branches and apply fungicides. Remove fallen leaves and fruit.',
                'Cedar_apple_rust': 'Remove cedar trees within 2 miles if possible. Apply fungicides during spring.',
                'default': 'Apply appropriate fungicides and maintain good orchard hygiene.'
            },
            'Corn': {
                'Cercospora_leaf_spot': 'Apply fungicides containing azoxystrobin or pyraclostrobin. Rotate crops.',
                'Common_rust': 'Apply fungicides and plant resistant varieties. Remove crop debris.',
                'Northern_Leaf_Blight': 'Apply fungicides and use resistant hybrids. Rotate crops.',
                'default': 'Apply appropriate fungicides and maintain field hygiene.'
            },
            'Grape': {
                'Black_rot': 'Apply fungicides and remove infected berries. Maintain good air circulation.',
                'Esca': 'Prune infected vines and apply fungicides. Maintain vineyard hygiene.',
                'Leaf_blight': 'Apply fungicides and remove infected leaves. Maintain good air flow.',
                'default': 'Apply appropriate fungicides and maintain vineyard hygiene.'
            },
            'Potato': {
                'Early_blight': 'Apply fungicides containing chlorothalonil. Rotate crops and remove infected leaves.',
                'Late_blight': 'Apply fungicides immediately. Remove infected plants and avoid overhead irrigation.',
                'default': 'Apply appropriate fungicides and maintain field hygiene.'
            },
            'Tomato': {
                'Bacterial_spot': 'Apply copper-based bactericides. Remove infected plants and avoid overhead irrigation.',
                'Early_blight': 'Apply fungicides and remove infected leaves. Maintain good air circulation.',
                'Late_blight': 'Apply fungicides immediately. Remove infected plants and avoid overhead irrigation.',
                'Leaf_Mold': 'Apply fungicides and maintain good air circulation. Avoid overhead irrigation.',
                'Septoria_leaf_spot': 'Apply fungicides and remove infected leaves. Maintain good air circulation.',
                'Spider_mites': 'Apply miticides and maintain proper humidity. Remove heavily infested plants.',
                'Target_Spot': 'Apply fungicides and remove infected leaves. Maintain good air circulation.',
                'Tomato_mosaic_virus': 'Remove infected plants. Control aphids and use virus-free seeds.',
                'Tomato_Yellow_Leaf_Curl_Virus': 'Control whiteflies and remove infected plants. Use resistant varieties.',
                'default': 'Apply appropriate fungicides and maintain good plant hygiene.'
            },
            'Peach': {
                'Bacterial_spot': 'Apply copper-based bactericides. Prune infected branches and maintain orchard hygiene.',
                'default': 'Apply appropriate bactericides and maintain orchard hygiene.'
            },
            'Pepper': {
                'Bacterial_spot': 'Apply copper-based bactericides. Remove infected plants and avoid overhead irrigation.',
                'default': 'Apply appropriate bactericides and maintain field hygiene.'
            },
            'Cherry': {
                'Powdery_mildew': 'Apply fungicides containing myclobutanil. Prune infected branches and maintain good air circulation.',
                'default': 'Apply appropriate fungicides and maintain orchard hygiene.'
            },
            'Strawberry': {
                'Leaf_scorch': 'Apply fungicides and remove infected leaves. Maintain good air circulation.',
                'default': 'Apply appropriate fungicides and maintain field hygiene.'
            }
        }
        
        # Get treatment for specific crop and disease
        if crop in treatments:
            crop_treatments = treatments[crop]
            if disease in crop_treatments:
                return crop_treatments[disease]
            else:
                return crop_treatments.get('default', f'Apply appropriate fungicides for {crop} {disease}.')
        else:
            return f'Apply appropriate fungicides for {crop} {disease}. Consult with a local agricultural expert.'

# Global instance for easy access
predictor = CropDiseasePredictor() 