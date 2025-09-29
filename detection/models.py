from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth import get_user_model

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    """Custom user model that uses email as the primary identifier"""
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = CustomUserManager()
    
    def __str__(self):
        return self.email

class DiseaseDetection(models.Model):
    """Model to store disease detection history"""
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    image = models.ImageField(upload_to='detections/')
    prediction = models.CharField(max_length=100)
    confidence = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.email} - {self.prediction} ({self.timestamp})"

class UserStatistics(models.Model):
    """Model to store user-specific statistics"""
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    total_scans = models.IntegerField(default=0)
    diseased_plants = models.IntegerField(default=0)
    healthy_plants = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "User Statistics"
    
    def __str__(self):
        return f"{self.user.email} - Stats (Total: {self.total_scans}, Diseased: {self.diseased_plants}, Healthy: {self.healthy_plants})"
    
    def update_statistics(self, detection_result):
        """Update statistics based on a new detection"""
        self.total_scans += 1
        
        # Check if the detection indicates a healthy plant
        is_healthy = 'healthy' in detection_result.get('disease', '').lower()
        
        if is_healthy:
            self.healthy_plants += 1
        else:
            self.diseased_plants += 1
        
        self.save()
    
    def reset_statistics(self):
        """Reset all statistics to zero"""
        self.total_scans = 0
        self.diseased_plants = 0
        self.healthy_plants = 0
        self.save()

class UserActivity(models.Model):
    """Model to store user activity timeline"""
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50)  # 'detection', 'login', 'register', etc.
    description = models.CharField(max_length=200)
    crop = models.CharField(max_length=100, blank=True, null=True)
    disease = models.CharField(max_length=100, blank=True, null=True)
    confidence = models.FloatField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "User Activities"
    
    def __str__(self):
        return f"{self.user.email} - {self.activity_type} ({self.timestamp})" 