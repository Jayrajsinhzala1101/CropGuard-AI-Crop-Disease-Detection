#!/usr/bin/env python
"""
Email service for CropGuard application
Handles welcome emails and password reset emails
"""

import os
import smtplib
import threading
import logging
import re
from email.message import EmailMessage
from django.conf import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------- Configuration ---------------------- #
# Get email credentials from environment variables or Django settings
my_email = os.getenv('EMAIL_HOST_USER', 'cropdiseases.app@gmail.com')
my_password = os.getenv('EMAIL_HOST_PASSWORD', 'oaulnlcbnqymollo')

def validate_email(email):
    """
    Validate if an email address is properly formatted and can receive emails
    Returns: (is_valid, error_message)
    """
    try:
        # Basic email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return False, "Invalid email format. Please enter a valid email address."
        
        # Check if email domain has valid format
        domain = email.split('@')[1]
        if not domain or '.' not in domain:
            return False, "Invalid email domain. Please enter a valid email address."
        
        # Check for common disposable email domains
        disposable_domains = [
            'tempmail.com', 'temp-mail.org', 'guerrillamail.com', 
            '10minutemail.com', 'mailinator.com', 'yopmail.com',
            'throwaway.com', 'fakeinbox.com', 'sharklasers.com'
        ]
        
        if domain.lower() in disposable_domains:
            return False, "Disposable email addresses are not allowed. Please use a valid email address."
        
        # Check for common invalid domains (temporarily disabled for testing)
        # invalid_domains = [
        #     'example.com', 'test.com', 'invalid.com', 'nonexistent.com'
        # ]
        
        # if domain.lower() in invalid_domains:
        #     return False, "Please enter a valid email address that can receive emails."
        
        # Try to connect to the domain's SMTP server to check if it exists
        try:
            import socket
            mx_records = socket.gethostbyname_ex(domain)
            if not mx_records[2]:  # No IP addresses found
                return False, "Email domain does not exist. Please enter a valid email address."
        except socket.gaierror:
            return False, "Email domain does not exist. Please enter a valid email address."
        
        return True, "Email is valid"
        
    except Exception as e:
        logger.error(f"Email validation error for {email}: {str(e)}")
        return False, f"Email validation failed: {str(e)}"

def send_welcome_email(user_name, user_email):
    """
    Send welcome email to new user
    """
    try:
        # Create email message
        msg = EmailMessage()
        msg['Subject'] = f'Welcome to CropGuard, {user_name}! 🌱'
        msg['From'] = my_email
        msg['To'] = user_email
        
        # Email content
        email_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2E7D32; margin-bottom: 10px;">🌱 CropGuard</h1>
                    <p style="color: #666; font-size: 18px;">Your Crop Disease Detection Assistant</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
                    <h2 style="color: #2E7D32; margin-bottom: 15px;">Hi {user_name}, 👋</h2>
                    
                    <p style="font-size: 16px; margin-bottom: 15px;">
                        Welcome to <strong>CropGuard</strong>! 🎉
                    </p>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        We're excited to have you on board. With CropGuard, you can:
                    </p>
                    
                    <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
                        <li>🔍 Detect crop diseases from images</li>
                        <li>📊 Track your detection history</li>
                        <li>💡 Get treatment suggestions</li>
                        <li>📱 Use our mobile-friendly interface</li>
                    </ul>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        Start by uploading or capturing an image of your crop, and we'll help you identify any diseases and provide treatment recommendations.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666; font-size: 14px;">
                        Thank you for choosing CropGuard! 🌾
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Best regards,<br>
                        The CropGuard Team
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.set_content(email_content, subtype='html')
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(my_email, my_password)
            server.send_message(msg)
        
        logger.info(f"✅ Welcome email sent to {user_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send welcome email to {user_email}: {str(e)}")
        raise e

def send_password_reset_email(user_email, reset_link):
    """
    Send password reset email
    """
    try:
        # Create email message
        msg = EmailMessage()
        msg['Subject'] = 'Password Reset Request - CropGuard 🔐'
        msg['From'] = my_email
        msg['To'] = user_email
        
        # Email content
        email_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2E7D32; margin-bottom: 10px;">🔐 CropGuard</h1>
                    <p style="color: #666; font-size: 18px;">Password Reset Request</p>
                </div>
                
                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
                    <h2 style="color: #2E7D32; margin-bottom: 15px;">Password Reset</h2>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        You requested a password reset for your CropGuard account.
                    </p>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        Click the button below to reset your password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background-color: #2E7D32; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        If you didn't request this password reset, please ignore this email.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666; font-size: 14px;">
                        Best regards,<br>
                        The CropGuard Team
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.set_content(email_content, subtype='html')
        
        # Send email
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(my_email, my_password)
            server.send_message(msg)
        
        logger.info(f"✅ Password reset email sent to {user_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to send password reset email to {user_email}: {str(e)}")
        raise e 