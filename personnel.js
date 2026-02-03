        document.addEventListener('DOMContentLoaded', function() {
            // Add click event listeners to filter buttons for visual feedback
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Get the group this button belongs to (rank or specialty)
                    const isRankFilter = this.getAttribute('for') === 'show-all' || 
                                        this.getAttribute('for') === 'filter-officer' ||
                                        this.getAttribute('for') === 'filter-nco' ||
                                        this.getAttribute('for') === 'filter-enlisted';
                    
                    const isSpecialtyFilter = this.getAttribute('for') === 'filter-pilot' ||
                                             this.getAttribute('for') === 'filter-support' ||
                                             this.getAttribute('for') === 'filter-intel' ||
                                             this.getAttribute('for') === 'filter-maintenance';
                    
                    // Remove active class from all buttons in the same group
                    if (isRankFilter) {
                        document.querySelectorAll('.filter-btn[for="show-all"], .filter-btn[for^="filter-"]').forEach(btn => {
                            const btnFor = btn.getAttribute('for');
                            if (btnFor === 'show-all' || btnFor === 'filter-officer' || 
                                btnFor === 'filter-nco' || btnFor === 'filter-enlisted') {
                                btn.classList.remove('active');
                            }
                        });
                    } else if (isSpecialtyFilter) {
                        document.querySelectorAll('.filter-btn[for="show-all"], .filter-btn[for^="filter-"]').forEach(btn => {
                            const btnFor = btn.getAttribute('for');
                            if (btnFor === 'show-all' || btnFor === 'filter-pilot' || 
                                btnFor === 'filter-support' || btnFor === 'filter-intel' || 
                                btnFor === 'filter-maintenance') {
                                btn.classList.remove('active');
                            }
                        });
                    }
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // If a specialty filter is clicked, ensure "All Ranks" is active
                    if (isSpecialtyFilter && this.getAttribute('for') !== 'show-all') {
                        document.querySelector('.filter-btn[for="show-all"]').classList.add('active');
                        document.querySelectorAll('.filter-btn[for="filter-officer"], .filter-btn[for="filter-nco"], .filter-btn[for="filter-enlisted"]').forEach(btn => {
                            btn.classList.remove('active');
                        });
                    }
                    
                    // If a rank filter is clicked, ensure "All Specialties" is active
                    if (isRankFilter && this.getAttribute('for') !== 'show-all') {
                        document.querySelector('.filter-btn[for="show-all"]').classList.add('active');
                        document.querySelectorAll('.filter-btn[for="filter-pilot"], .filter-btn[for="filter-support"], .filter-btn[for="filter-intel"], .filter-btn[for="filter-maintenance"]').forEach(btn => {
                            btn.classList.remove('active');
                        });
                    }
                });
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            // Step navigation and validation
            const steps = document.querySelectorAll('.step');
            const formSteps = document.querySelectorAll('.form-step');
            const nextButtons = document.querySelectorAll('.next-step');
            const prevButtons = document.querySelectorAll('.prev-step');
            const submitButton = document.getElementById('submit-application');
            const confirmationModal = document.getElementById('confirmationModal');
            const closeModalButton = document.getElementById('close-modal');
            const termsCheckbox = document.getElementById('agreeTerms');
            const termsError = document.getElementById('terms-error');
            
            // Current step tracking
            let currentStep = 1;
            
            // Update step indicator
            function updateStepIndicator(stepNumber) {
                steps.forEach(step => {
                    const stepData = parseInt(step.getAttribute('data-step'));
                    
                    if (stepData === stepNumber) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else if (stepData < stepNumber) {
                        step.classList.remove('active');
                        step.classList.add('completed');
                    } else {
                        step.classList.remove('active');
                        step.classList.remove('completed');
                    }
                });
            }
            
            // Show specific step
            function showStep(stepNumber) {
                formSteps.forEach(step => {
                    if (parseInt(step.getAttribute('data-step')) === stepNumber) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
                
                updateStepIndicator(stepNumber);
                currentStep = stepNumber;
            }
            
            // Validate current step
            function validateStep(stepNumber) {
                let isValid = true;
                
                if (stepNumber === 4) {
                    // For review step, just check the terms agreement
                    if (!termsCheckbox.checked) {
                        termsError.style.display = 'block';
                        isValid = false;
                    } else {
                        termsError.style.display = 'none';
                    }
                    return isValid;
                }
                
                // Get the form for the current step
                const currentForm = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
                const requiredFields = currentForm.querySelectorAll('[required]');
                
                // Reset all validation errors
                currentForm.querySelectorAll('.validation-error').forEach(error => {
                    error.style.display = 'none';
                });
                
                // Check each required field
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        const errorElement = field.nextElementSibling;
                        if (errorElement && errorElement.classList.contains('validation-error')) {
                            errorElement.style.display = 'block';
                        }
                    } else if (field.type === 'email') {
                        // Email validation
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(field.value)) {
                            isValid = false;
                            const errorElement = field.nextElementSibling;
                            if (errorElement && errorElement.classList.contains('validation-error')) {
                                errorElement.textContent = 'Please enter a valid email address';
                                errorElement.style.display = 'block';
                            }
                        }
                    } else if (field.id === 'phone') {
                        // Basic phone validation (at least 10 digits)
                        const phonePattern = /^[\d\s\-\(\)\+]{10,}$/;
                        if (!phonePattern.test(field.value)) {
                            isValid = false;
                            const errorElement = field.nextElementSibling;
                            if (errorElement && errorElement.classList.contains('validation-error')) {
                                errorElement.textContent = 'Please enter a valid phone number';
                                errorElement.style.display = 'block';
                            }
                        }
                    }
                });
                
                // Check radio buttons for step 3
                if (stepNumber === 3) {
                    const employmentRadios = document.querySelectorAll('input[name="employmentType"]');
                    let radioChecked = false;
                    
                    employmentRadios.forEach(radio => {
                        if (radio.checked) radioChecked = true;
                    });
                    
                    if (!radioChecked) {
                        isValid = false;
                        const errorElement = document.querySelector('input[name="employmentType"]').closest('.mb-3').querySelector('.validation-error');
                        if (errorElement) {
                            errorElement.style.display = 'block';
                        }
                    }
                }
                
                return isValid;
            }
            
            // Update review section with form data
            function updateReviewSection() {
                // Personal Information
                const firstName = document.getElementById('firstName').value || 'Not provided';
                const lastName = document.getElementById('lastName').value || 'Not provided';
                document.getElementById('review-name').textContent = `${firstName} ${lastName}`;
                
                document.getElementById('review-email').textContent = document.getElementById('email').value || 'Not provided';
                document.getElementById('review-phone').textContent = document.getElementById('phone').value || 'Not provided';
                
                const city = document.getElementById('city').value || '';
                const state = document.getElementById('state').value || '';
                const zip = document.getElementById('zip').value || '';
                document.getElementById('review-location').textContent = `${city}${city && state ? ', ' : ''}${state} ${zip}`.trim() || 'Not provided';
                
                // Qualifications
                const educationSelect = document.getElementById('education');
                const educationText = educationSelect.options[educationSelect.selectedIndex].text;
                document.getElementById('review-education').textContent = educationText !== 'Select your education level' ? educationText : 'Not provided';
                
                document.getElementById('review-field').textContent = document.getElementById('field').value || 'Not provided';
                
                const experienceSelect = document.getElementById('experience');
                const experienceText = experienceSelect.options[experienceSelect.selectedIndex].text;
                document.getElementById('review-experience').textContent = experienceText !== 'Select your experience level' ? experienceText : 'Not provided';
                
                document.getElementById('review-skills').textContent = document.getElementById('skills').value || 'Not provided';
                
                // Career Preferences
                const positionSelect = document.getElementById('position');
                const positionText = positionSelect.options[positionSelect.selectedIndex].text;
                document.getElementById('review-position').textContent = positionText !== 'Select a position' ? positionText : 'Not provided';
                
                const employmentType = document.querySelector('input[name="employmentType"]:checked');
                document.getElementById('review-employment').textContent = employmentType ? employmentType.nextElementSibling.textContent : 'Not provided';
                
                const salarySelect = document.getElementById('salary');
                const salaryText = salarySelect.options[salarySelect.selectedIndex].text;
                document.getElementById('review-salary').textContent = salaryText !== 'Select a range' ? salaryText : 'Not provided';
                
                const availabilitySelect = document.getElementById('availability');
                const availabilityText = availabilitySelect.options[availabilitySelect.selectedIndex].text;
                document.getElementById('review-availability').textContent = availabilityText !== 'Select availability' ? availabilityText : 'Not provided';
                
                // Update confirmation email
                document.getElementById('confirm-email').textContent = document.getElementById('email').value || 'your email';
            }
            
            // Next button click handler
            nextButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const nextStep = parseInt(this.getAttribute('data-next'));
                    
                    if (validateStep(currentStep)) {
                        if (nextStep === 4) {
                            updateReviewSection();
                        }
                        showStep(nextStep);
                    }
                });
            });
            
            // Previous button click handler
            prevButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const prevStep = parseInt(this.getAttribute('data-prev'));
                    showStep(prevStep);
                });
            });
            
            // Step indicator click handler (for navigation)
            steps.forEach(step => {
                step.addEventListener('click', function() {
                    const stepNumber = parseInt(this.getAttribute('data-step'));
                    
                    // Only allow navigating to previous steps
                    if (stepNumber < currentStep) {
                        showStep(stepNumber);
                    }
                });
            });
            
            // Submit application handler
            submitButton.addEventListener('click', function() {
                if (validateStep(4)) {
                    // In a real application, you would send data to a server here
                    // For demo, we'll just show the confirmation modal
                    confirmationModal.style.display = 'flex';
                }
            });
            
            // Close modal handler
            closeModalButton.addEventListener('click', function() {
                confirmationModal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === confirmationModal) {
                    confirmationModal.style.display = 'none';
                }
            });
            
            // Real-time validation for required fields
            const requiredFields = document.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.addEventListener('blur', function() {
                    if (!this.value.trim()) {
                        const errorElement = this.nextElementSibling;
                        if (errorElement && errorElement.classList.contains('validation-error')) {
                            errorElement.style.display = 'block';
                        }
                    }
                });
                
                field.addEventListener('input', function() {
                    if (this.value.trim()) {
                        const errorElement = this.nextElementSibling;
                        if (errorElement && errorElement.classList.contains('validation-error')) {
                            errorElement.style.display = 'none';
                        }
                    }
                });
            });
            
            // Terms checkbox validation
            termsCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    termsError.style.display = 'none';
                }
            });
            
            // Initialize the form
            showStep(1);
        });
