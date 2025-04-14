import os
import uuid
from datetime import datetime
from flask import render_template, request, redirect, url_for, flash, jsonify, session
from werkzeug.utils import secure_filename
from flask_login import login_user, logout_user, current_user, login_required
import logging

from app import app, db
from models import User, Detection, Contact
from forms import LoginForm, RegistrationForm, ContactForm
from potato_disease_model import PotatoDiseaseModel

# Initialize the potato disease model
potato_model = PotatoDiseaseModel()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/gallery')
def gallery():
    # If user is logged in, show public detections and their own detections
    # If not logged in, show only public detections
    if current_user.is_authenticated:
        detections = Detection.query.filter(
            (Detection.is_public == True) | (Detection.user_id == current_user.id)
        ).order_by(Detection.timestamp.desc()).all()
    else:
        detections = Detection.query.filter_by(is_public=True).order_by(Detection.timestamp.desc()).all()
    
    return render_template('gallery.html', detections=detections)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    form = ContactForm()
    
    if form.validate_on_submit():
        # Create new contact form submission
        new_contact = Contact(
            name=form.name.data,
            email=form.email.data,
            subject=form.subject.data,
            message=form.message.data
        )
        
        try:
            db.session.add(new_contact)
            db.session.commit()
            flash('Your message has been sent. Thank you!', 'success')
            return redirect(url_for('contact'))
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error saving contact form: {e}")
            flash('An error occurred while sending your message. Please try again.', 'danger')
    
    return render_template('contact.html', form=form)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        flash('No file part', 'danger')
        return redirect(url_for('index'))
    
    file = request.files['file']
    
    if file.filename == '':
        flash('No selected file', 'danger')
        return redirect(url_for('index'))
    
    if file and allowed_file(file.filename):
        # Create a unique filename
        filename = str(uuid.uuid4()) + '_' + secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            # Save the file
            file.save(file_path)
            
            # Predict the disease
            result = potato_model.predict(file_path)
            
            # Save the detection result to the database
            new_detection = Detection(
                filename=filename,
                disease=result['class_name'],
                confidence=result['confidence'],
                description=result['description'],
                treatment=result['treatment'],
                is_public=True  # Default to public
            )
            
            # Associate with the current user if logged in
            if current_user.is_authenticated:
                new_detection.user_id = current_user.id
            
            db.session.add(new_detection)
            db.session.commit()
            
            # Store detection ID in session for redirect
            session['detection_id'] = new_detection.id
            
            return redirect(url_for('result'))
        
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error processing upload: {e}")
            flash('An error occurred while processing your image. Please try again.', 'danger')
            return redirect(url_for('index'))
    
    else:
        flash('Allowed file types are png, jpg, jpeg', 'danger')
        return redirect(url_for('index'))

@app.route('/result')
def result():
    # Get the detection ID from session
    detection_id = session.get('detection_id')
    
    if not detection_id:
        flash('No detection results found. Please upload an image first.', 'warning')
        return redirect(url_for('index'))
    
    # Get the detection from the database
    detection = Detection.query.get_or_404(detection_id)
    
    # Format the data for display
    result_data = {
        'id': detection.id,
        'filename': detection.filename,
        'disease': detection.disease,
        'confidence': detection.confidence,
        'description': detection.description,
        'treatment': detection.treatment,
        'timestamp': detection.timestamp
    }
    
    # Clear the session variable
    session.pop('detection_id', None)
    
    return render_template('result.html', result=result_data)

@app.route('/stats')
def stats():
    # Get disease counts for chart data
    diseases = db.session.query(Detection.disease, db.func.count(Detection.id)).group_by(Detection.disease).all()
    
    # Format data for chart.js
    disease_names = [d[0] for d in diseases]
    disease_counts = [d[1] for d in diseases]
    
    chart_data = {
        'labels': disease_names,
        'counts': disease_counts
    }
    
    return jsonify(chart_data)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid email or password', 'danger')
            return redirect(url_for('login'))
        
        login_user(user, remember=form.remember_me.data)
        flash('You have been logged in!', 'success')
        
        next_page = request.args.get('next')
        if not next_page or not next_page.startswith('/'):
            next_page = url_for('index')
        return redirect(next_page)
    
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        
        try:
            db.session.add(user)
            db.session.commit()
            flash('Your account has been created! You can now log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error registering user: {e}")
            flash('An error occurred during registration. Please try again.', 'danger')
    
    return render_template('register.html', form=form)

@app.route('/logout')
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

@app.route('/delete_detection/<int:detection_id>', methods=['POST'])
@login_required
def delete_detection(detection_id):
    detection = Detection.query.get_or_404(detection_id)
    
    # Check if the current user owns this detection
    if detection.user_id != current_user.id:
        flash('You do not have permission to delete this detection.', 'danger')
        return redirect(url_for('gallery'))
    
    try:
        # Delete the file from storage
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], detection.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Remove from database
        db.session.delete(detection)
        db.session.commit()
        
        flash('Detection deleted successfully.', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error deleting detection: {e}")
        flash('An error occurred while deleting the detection.', 'danger')
    
    # Redirect to profile if coming from profile, otherwise to gallery
    referrer = request.referrer
    if referrer and 'profile' in referrer:
        return redirect(url_for('profile'))
    else:
        return redirect(url_for('gallery'))

@app.route('/toggle_visibility/<int:detection_id>', methods=['POST'])
@login_required
def toggle_visibility(detection_id):
    detection = Detection.query.get_or_404(detection_id)
    
    # Check if the current user owns this detection
    if detection.user_id != current_user.id:
        flash('You do not have permission to modify this detection.', 'danger')
        return redirect(url_for('profile'))
    
    try:
        # Toggle visibility
        detection.is_public = not detection.is_public
        db.session.commit()
        
        status = "public" if detection.is_public else "private"
        flash(f'Detection visibility changed to {status}.', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error toggling visibility: {e}")
        flash('An error occurred while updating the detection visibility.', 'danger')
    
    return redirect(url_for('profile'))

@app.route('/clear_gallery', methods=['POST'])
@login_required
def clear_gallery():
    if not current_user.is_authenticated:
        flash('You must be logged in to clear your gallery.', 'danger')
        return redirect(url_for('login'))
    
    try:
        # Get all user's detections
        user_detections = Detection.query.filter_by(user_id=current_user.id).all()
        
        for detection in user_detections:
            # Delete the file from storage
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], detection.filename)
            if os.path.exists(file_path):
                os.remove(file_path)
            
            # Remove from database
            db.session.delete(detection)
        
        db.session.commit()
        flash('Your gallery has been cleared successfully.', 'success')
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error clearing gallery: {e}")
        flash('An error occurred while clearing your gallery.', 'danger')
    
    return redirect(url_for('profile'))
