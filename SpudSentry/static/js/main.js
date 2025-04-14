/**
 * PotatoPathFinder - Main JavaScript
 * Created by: Ritika Chaudhary and Veer Vikram Singh
 */

document.addEventListener('DOMContentLoaded', function() {
    // Image upload preview
    const fileInput = document.getElementById('file-input');
    const uploadContainer = document.getElementById('upload-container');
    const previewImage = document.getElementById('preview-image');
    const uploadForm = document.getElementById('upload-form');
    const uploadButton = document.getElementById('upload-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (uploadContainer) {
        uploadContainer.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    uploadButton.disabled = false;
                };
                
                reader.readAsDataURL(fileInput.files[0]);
            }
        });
        
        if (uploadForm) {
            uploadForm.addEventListener('submit', function() {
                if (fileInput.files.length > 0) {
                    uploadButton.disabled = true;
                    loadingIndicator.style.display = 'block';
                }
            });
        }
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Flash message auto-close
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(function(flash) {
        setTimeout(function() {
            const closeButton = flash.querySelector('.btn-close');
            if (closeButton) {
                closeButton.click();
            } else {
                flash.style.opacity = '0';
                setTimeout(function() {
                    flash.style.display = 'none';
                }, 300);
            }
        }, 5000);
    });
    
    // Gallery image filter
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryFilters.length > 0) {
        galleryFilters.forEach(function(filter) {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all filters
                galleryFilters.forEach(function(f) {
                    f.classList.remove('active');
                });
                
                // Add active class to clicked filter
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide gallery items based on filter
                galleryItems.forEach(function(item) {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                    } else if (item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            let isValid = true;
            
            // Simple validation
            if (!nameInput.value.trim()) {
                document.getElementById('name-error').textContent = 'Please enter your name';
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('name-error').textContent = '';
                nameInput.classList.remove('is-invalid');
            }
            
            if (!emailInput.value.trim()) {
                document.getElementById('email-error').textContent = 'Please enter your email';
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email address';
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('email-error').textContent = '';
                emailInput.classList.remove('is-invalid');
            }
            
            if (!subjectInput.value.trim()) {
                document.getElementById('subject-error').textContent = 'Please enter a subject';
                subjectInput.classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('subject-error').textContent = '';
                subjectInput.classList.remove('is-invalid');
            }
            
            if (!messageInput.value.trim()) {
                document.getElementById('message-error').textContent = 'Please enter your message';
                messageInput.classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('message-error').textContent = '';
                messageInput.classList.remove('is-invalid');
            }
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Load gallery stats chart if on the gallery page
    const statsChart = document.getElementById('disease-stats-chart');
    if (statsChart) {
        fetch('/stats')
            .then(response => response.json())
            .then(data => {
                renderChart(data.labels, data.counts);
            })
            .catch(error => console.error('Error fetching stats:', error));
    }
});
