// Main JavaScript for CV Generator

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dynamic sections
    initDynamicSections();
    
    // Initialize OpenAI integration
    initOpenAI();
    
    // Initialize PDF export
    initPDFExport();
    
    // Initialize tabs
    initTabs();
});

// Tabs functionality
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.dataset.target;
            
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Text formatting functionality
function initTextFormatting() {
    // Add formatting controls to all textareas
    document.querySelectorAll('textarea').forEach(textarea => {
        addFormattingControls(textarea);
    });
}

function addFormattingControls(textarea) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'formatting-controls';
    controlsContainer.innerHTML = `
        <button type="button" class="format-btn" data-format="bold" title="Bold"><strong>B</strong></button>
        <button type="button" class="format-btn" data-format="italic" title="Italic"><em>I</em></button>
        <button type="button" class="format-btn" data-format="underline" title="Underline"><u>U</u></button>
    `;
    
    // Insert controls before textarea
    textarea.parentNode.insertBefore(controlsContainer, textarea);
    
    // Add event listeners to formatting buttons
    controlsContainer.querySelectorAll('.format-btn').forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            applyFormatting(textarea, format);
        });
    });
}

function applyFormatting(textarea, format) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';
    
    switch(format) {
        case 'bold':
            replacement = `<strong>${selectedText}</strong>`;
            break;
        case 'italic':
            replacement = `<em>${selectedText}</em>`;
            break;
        case 'underline':
            replacement = `<u>${selectedText}</u>`;
            break;
    }
    
    // Replace selected text with formatted text
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    
    // Set cursor position after the inserted text
    textarea.selectionStart = start + replacement.length;
    textarea.selectionEnd = start + replacement.length;
    
    // Focus back on textarea
    textarea.focus();
}

// Dynamic sections management
function initDynamicSections() {
    // Add event listeners for all "Add" buttons
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', function() {
            const sectionType = this.dataset.section;
            addNewEntry(sectionType);
        });
    });
    
    // Initialize existing entries (for edit mode)
    document.querySelectorAll('.entry-container').forEach(entry => {
        initEntryControls(entry);
    });
}

function addNewEntry(sectionType) {
    const container = document.getElementById(`${sectionType}-entries`);
    const entryIndex = container.children.length;
    
    // Create template based on section type
    let template = '';
    
    switch(sectionType) {
        case 'education':
            template = createEducationTemplate(entryIndex);
            break;
        case 'experience':
            template = createExperienceTemplate(entryIndex);
            break;
        case 'activity':
            template = createActivityTemplate(entryIndex);
            break;
        case 'responsibility':
            const parentId = container.dataset.parent;
            const parentType = container.dataset.parentType;
            const parentIndex = container.dataset.parentIndex;
            template = createResponsibilityTemplate(entryIndex, parentType, parentIndex);
            break;
        default:
            console.error('Unknown section type:', sectionType);
            return;
    }
    
    // Create new entry element
    const entryElement = document.createElement('div');
    entryElement.className = 'entry-container';
    entryElement.innerHTML = template;
    
    // Add to container
    container.appendChild(entryElement);
    
    // Initialize controls
    initEntryControls(entryElement);
    
    // Initialize formatting controls for new textareas
    entryElement.querySelectorAll('textarea').forEach(textarea => {
        addFormattingControls(textarea);
    });
}

function initEntryControls(entryElement) {
    // Remove button
    const removeBtn = entryElement.querySelector('.remove-entry');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this entry?')) {
                entryElement.remove();
            }
        });
    }
    
    // Move up button
    const moveUpBtn = entryElement.querySelector('.move-up');
    if (moveUpBtn) {
        moveUpBtn.addEventListener('click', function() {
            const prevSibling = entryElement.previousElementSibling;
            if (prevSibling && prevSibling.classList.contains('entry-container')) {
                entryElement.parentNode.insertBefore(entryElement, prevSibling);
            }
        });
    }
    
    // Move down button
    const moveDownBtn = entryElement.querySelector('.move-down');
    if (moveDownBtn) {
        moveDownBtn.addEventListener('click', function() {
            const nextSibling = entryElement.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains('entry-container')) {
                entryElement.parentNode.insertBefore(nextSibling, entryElement);
            }
        });
    }
    
    // AI enhancement buttons
    const aiButtons = entryElement.querySelectorAll('.btn-ai-enhance');
    aiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fieldId = this.dataset.target;
            const fieldElement = document.getElementById(fieldId);
            enhanceWithAI(fieldElement);
        });
    });
    
    // Add responsibility buttons
    const addResponsibilityBtn = entryElement.querySelector('.btn-add-responsibility');
    if (addResponsibilityBtn) {
        addResponsibilityBtn.addEventListener('click', function() {
            const responsibilitiesContainer = this.closest('.entry-container').querySelector('.responsibilities-container');
            const parentType = responsibilitiesContainer.dataset.parentType;
            const parentIndex = responsibilitiesContainer.dataset.parentIndex;
            
            // Create new responsibility entry
            const responsibilityIndex = responsibilitiesContainer.children.length;
            const responsibilityTemplate = createResponsibilityTemplate(responsibilityIndex, parentType, parentIndex);
            
            // Create new responsibility element
            const responsibilityElement = document.createElement('div');
            responsibilityElement.className = 'responsibility-container';
            responsibilityElement.innerHTML = responsibilityTemplate;
            
            // Add to container
            responsibilitiesContainer.appendChild(responsibilityElement);
            
            // Initialize responsibility controls
            initResponsibilityControls(responsibilityElement);
            
            // Initialize formatting controls for new textareas
            responsibilityElement.querySelectorAll('textarea').forEach(textarea => {
                addFormattingControls(textarea);
            });
        });
    }
}

function initResponsibilityControls(responsibilityElement) {
    // Remove button
    const removeBtn = responsibilityElement.querySelector('.remove-responsibility');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this responsibility?')) {
                responsibilityElement.remove();
            }
        });
    }
    
    // AI enhancement buttons
    const aiButtons = responsibilityElement.querySelectorAll('.btn-ai-enhance');
    aiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fieldId = this.dataset.target;
            const fieldElement = document.getElementById(fieldId);
            enhanceWithAI(fieldElement);
        });
    });
}

// Templates for dynamic entries
function createEducationTemplate(index) {
    return `
        <div class="entry-header">
            <div class="entry-title">Education Entry #${index + 1}</div>
            <div class="entry-actions">
                <span class="move-entry move-up">↑</span>
                <span class="move-entry move-down">↓</span>
                <span class="remove-entry">×</span>
            </div>
        </div>
        <div class="form-group">
            <label for="education-institution-${index}">Institution</label>
            <input type="text" id="education-institution-${index}" name="education[${index}][institution]" required>
        </div>
        <div class="form-group">
            <label for="education-location-${index}">Location</label>
            <input type="text" id="education-location-${index}" name="education[${index}][location]">
        </div>
        <div class="form-group">
            <label for="education-degree-${index}">Degree</label>
            <input type="text" id="education-degree-${index}" name="education[${index}][degree]">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="education-start-${index}">Start Date</label>
                <input type="text" id="education-start-${index}" name="education[${index}][start_date]" placeholder="MM/YYYY">
            </div>
            <div class="form-group">
                <label for="education-end-${index}">End Date</label>
                <input type="text" id="education-end-${index}" name="education[${index}][end_date]" placeholder="MM/YYYY or Present">
            </div>
        </div>
        <div class="form-group">
            <label for="education-gpa-${index}">GPA/Grade</label>
            <input type="text" id="education-gpa-${index}" name="education[${index}][gpa]">
        </div>
        
        <div class="responsibilities-section">
            <h4>Responsibilities, Achievements or Projects</h4>
            <div class="responsibilities-container" id="education-${index}-responsibilities" data-parent-type="education" data-parent-index="${index}">
                <!-- Responsibilities will be added here -->
            </div>
            <button type="button" class="btn btn-secondary btn-add-responsibility">Add Entry</button>
        </div>
    `;
}

function createExperienceTemplate(index) {
    return `
        <div class="entry-header">
            <div class="entry-title">Work Experience Entry #${index + 1}</div>
            <div class="entry-actions">
                <span class="move-entry move-up">↑</span>
                <span class="move-entry move-down">↓</span>
                <span class="remove-entry">×</span>
            </div>
        </div>
        <div class="form-group">
            <label for="experience-company-${index}">Company/Organization</label>
            <input type="text" id="experience-company-${index}" name="experience[${index}][company]" required>
        </div>
        <div class="form-group">
            <label for="experience-location-${index}">Location</label>
            <input type="text" id="experience-location-${index}" name="experience[${index}][location]">
        </div>
        <div class="form-group">
            <label for="experience-position-${index}">Position</label>
            <input type="text" id="experience-position-${index}" name="experience[${index}][position]">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="experience-start-${index}">Start Date</label>
                <input type="text" id="experience-start-${index}" name="experience[${index}][start_date]" placeholder="MM/YYYY">
            </div>
            <div class="form-group">
                <label for="experience-end-${index}">End Date</label>
                <input type="text" id="experience-end-${index}" name="experience[${index}][end_date]" placeholder="MM/YYYY or Present">
            </div>
        </div>
        
        <div class="responsibilities-section">
            <h4>Responsibilities, Achievements or Projects</h4>
            <div class="responsibilities-container" id="experience-${index}-responsibilities" data-parent-type="experience" data-parent-index="${index}">
                <!-- Responsibilities will be added here -->
            </div>
            <button type="button" class="btn btn-secondary btn-add-responsibility">Add Entry</button>
        </div>
    `;
}

function createActivityTemplate(index) {
    return `
        <div class="entry-header">
            <div class="entry-title">Extracurricular Activity Entry #${index + 1}</div>
            <div class="entry-actions">
                <span class="move-entry move-up">↑</span>
                <span class="move-entry move-down">↓</span>
                <span class="remove-entry">×</span>
            </div>
        </div>
        <div class="form-group">
            <label for="activity-organization-${index}">Organization</label>
            <input type="text" id="activity-organization-${index}" name="activity[${index}][organization]" required>
        </div>
        <div class="form-group">
            <label for="activity-location-${index}">Location</label>
            <input type="text" id="activity-location-${index}" name="activity[${index}][location]">
        </div>
        <div class="form-group">
            <label for="activity-role-${index}">Role</label>
            <input type="text" id="activity-role-${index}" name="activity[${index}][role]">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="activity-start-${index}">Start Date</label>
                <input type="text" id="activity-start-${index}" name="activity[${index}][start_date]" placeholder="MM/YYYY">
            </div>
            <div class="form-group">
                <label for="activity-end-${index}">End Date</label>
                <input type="text" id="activity-end-${index}" name="activity[${index}][end_date]" placeholder="MM/YYYY or Present">
            </div>
        </div>
        
        <div class="responsibilities-section">
            <h4>Responsibilities, Achievements or Projects</h4>
            <div class="responsibilities-container" id="activity-${index}-responsibilities" data-parent-type="activity" data-parent-index="${index}">
                <!-- Responsibilities will be added here -->
            </div>
            <button type="button" class="btn btn-secondary btn-add-responsibility">Add Entry</button>
        </div>
    `;
}

function createResponsibilityTemplate(index, parentType, parentIndex) {
    return `
        <div class="responsibility-header">
            <div class="responsibility-title">Entry #${index + 1}</div>
            <div class="responsibility-actions">
                <span class="remove-responsibility">×</span>
            </div>
        </div>
        <div class="form-group">
            <label for="${parentType}-${parentIndex}-responsibility-description-${index}">Description</label>
            <textarea id="${parentType}-${parentIndex}-responsibility-description-${index}" name="${parentType}[${parentIndex}][responsibilities][${index}][description]"></textarea>
            <button type="button" class="btn btn-secondary btn-ai-enhance" data-target="${parentType}-${parentIndex}-responsibility-description-${index}">Enhance with AI</button>
        </div>
    `;
}

// OpenAI integration
function initOpenAI() {
    // Set up global AI enhancement functionality
    window.enhanceWithAI = function(textElement) {
        const originalText = textElement.value.trim();
        
        if (!originalText) {
            alert('Please enter some text to enhance.');
            return;
        }
        
        // Show loading indicator
        const parentElement = textElement.parentElement;
        const loadingElement = document.createElement('div');
        loadingElement.className = 'ai-container';
        loadingElement.innerHTML = '<div>Enhancing with AI... <span class="loading"></span></div>';
        parentElement.appendChild(loadingElement);
        
        // Send to server for AI enhancement
        fetch('/api/enhance-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: originalText,
                field_type: textElement.name.split('[')[0] // education, experience, activity, or responsibility
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading indicator
            loadingElement.innerHTML = `
                <div>AI Suggestion:</div>
                <div class="ai-suggestion">${data.enhanced_text}</div>
                <button class="btn btn-sm btn-success" id="accept-suggestion-${textElement.id}">Accept</button>
                <button class="btn btn-sm btn-secondary" id="dismiss-suggestion-${textElement.id}">Dismiss</button>
            `;
            
            // Add event listeners for accept/dismiss buttons
            document.getElementById(`accept-suggestion-${textElement.id}`).addEventListener('click', function() {
                textElement.value = data.enhanced_text;
                parentElement.removeChild(loadingElement);
            });
            
            document.getElementById(`dismiss-suggestion-${textElement.id}`).addEventListener('click', function() {
                parentElement.removeChild(loadingElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            loadingElement.innerHTML = `<div class="text-danger">Error: ${error.message}</div>`;
            
            // Add dismiss button
            const dismissButton = document.createElement('button');
            dismissButton.className = 'btn btn-sm btn-secondary';
            dismissButton.textContent = 'Dismiss';
            dismissButton.addEventListener('click', function() {
                parentElement.removeChild(loadingElement);
            });
            
            loadingElement.appendChild(dismissButton);
        });
    };
}

// PDF Export functionality
function initPDFExport() {
    const exportButton = document.getElementById('export-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // Validate form first
            if (!validateForm()) {
                alert('Please fill in all required fields before exporting.');
                return;
            }
            
            // Show loading indicator
            const loadingElement = document.createElement('div');
            loadingElement.className = 'ai-container';
            loadingElement.innerHTML = '<div>Generating PDF... <span class="loading"></span></div>';
            document.querySelector('.form-container').appendChild(loadingElement);
            
            // Submit form with export flag
            const formData = new FormData(document.getElementById('cv-form'));
            formData.append('export_pdf', 'true');
            
            fetch('/generate-cv', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('PDF generation failed');
            })
            .then(blob => {
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'CV.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                
                // Remove loading indicator
                document.querySelector('.form-container').removeChild(loadingElement);
            })
            .catch(error => {
                console.error('Error:', error);
                loadingElement.innerHTML = `<div class="text-danger">Error: ${error.message}</div>`;
                
                // Add dismiss button
                const dismissButton = document.createElement('button');
                dismissButton.className = 'btn btn-sm btn-secondary';
                dismissButton.textContent = 'Dismiss';
                dismissButton.addEventListener('click', function() {
                    document.querySelector('.form-container').removeChild(loadingElement);
                });
                
                loadingElement.appendChild(dismissButton);
            });
        });
    }
}

// Form validation
function validateForm() {
    const requiredFields = document.querySelectorAll('#cv-form [required]');
    let valid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            valid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return valid;
}

// Preview CV
function updatePreview() {
    const formData = new FormData(document.getElementById('cv-form'));
    
    fetch('/preview-cv', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(html => {
        document.getElementById('cv-preview-content').innerHTML = html;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('cv-preview-content').innerHTML = `<div class="text-danger">Error generating preview: ${error.message}</div>`;
    });
}

// Initialize preview button
document.addEventListener('DOMContentLoaded', function() {
    const previewButton = document.getElementById('preview-cv');
    if (previewButton) {
        previewButton.addEventListener('click', updatePreview);
    }
});
