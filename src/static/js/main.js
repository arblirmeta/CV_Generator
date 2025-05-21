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
        case 'responsibility': // This case seems unused for top-level "Add" buttons
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
        // This might be redundant if initEntryControls handles responsibilities' textareas
        if (!textarea.closest('.responsibilities-container')) { // Avoid double-adding for responsibility textareas
            addFormattingControls(textarea);
        }
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
    
    // AI enhancement buttons (for any textarea directly under this entry, not responsibilities)
    // This is likely not used as AI buttons are specific to responsibility descriptions.
    // Keeping it for safety in case of future direct AI-enhanced fields in main entries.
    const aiButtons = entryElement.querySelectorAll(':scope > .form-group .btn-ai-enhance');
    aiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fieldId = this.dataset.target;
            const fieldElement = document.getElementById(fieldId);
            if (fieldElement) enhanceWithAI(fieldElement, this);
        });
    });
    
    // Add responsibility buttons
    const addResponsibilityBtn = entryElement.querySelector('.btn-add-responsibility');
    if (addResponsibilityBtn) {
        addResponsibilityBtn.addEventListener('click', function() {
            const responsibilitiesContainer = this.closest('.entry-container').querySelector('.responsibilities-container');
            const parentType = responsibilitiesContainer.dataset.parentType;
            const parentIndex = responsibilitiesContainer.dataset.parentIndex;
            
            const responsibilityIndex = responsibilitiesContainer.children.length;
            const responsibilityTemplate = createResponsibilityTemplate(responsibilityIndex, parentType, parentIndex);
            
            const responsibilityElement = document.createElement('div');
            // Add a class for easier targeting if needed, e.g., 'responsibility-item-wrapper'
            // responsibilityElement.className = 'responsibility-item-wrapper'; 
            responsibilityElement.innerHTML = responsibilityTemplate;
            
            responsibilitiesContainer.appendChild(responsibilityElement);
            // Pass the responsibilityElement itself, which is the wrapper div.
            // initResponsibilityControls will then query within this scope.
            initResponsibilityControls(responsibilityElement); 
            
            // Initialize formatting for the new textarea in the responsibility
            responsibilityElement.querySelectorAll('textarea').forEach(textarea => {
                addFormattingControls(textarea);
            });
        });
    }

    // Initialize controls for already existing responsibilities if any (e.g. when loading data)
    entryElement.querySelectorAll('.responsibilities-container > div').forEach(respElement => {
        // Assuming respElement is the div that contains the structure from createResponsibilityTemplate
        initResponsibilityControls(respElement);
    });
}

function initResponsibilityControls(responsibilityContentElement) {
    // Note: responsibilityContentElement is now the wrapper div that was appended to responsibilitiesContainer.
    // It contains the .responsibility-header and the .form-group as direct children.
    
    // Remove button for responsibility
    const removeBtn = responsibilityContentElement.querySelector('.remove-responsibility');
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this responsibility?')) {
                responsibilityContentElement.remove(); // Remove the entire wrapper div
            }
        });
    }
    
    // AI enhancement buttons for responsibility
    const aiButton = responsibilityContentElement.querySelector('.btn-ai-enhance');
    if (aiButton) {
        aiButton.addEventListener('click', function() {
            const fieldId = this.dataset.target;
            // Ensure fieldElement is searched within the current responsibilityContentElement or document
            // getElementById is global, which is fine as IDs are unique.
            const fieldElement = document.getElementById(fieldId); 
            if (fieldElement) {
                enhanceWithAI(fieldElement, this);
            }
        });
    }
}

// Templates for dynamic entries
function createEducationTemplate(index) {
    return `
        <div class="entry-header">
            <div class="entry-title">Education Entry #${index + 1}</div>
            <div class="entry-actions">
                <span class="move-entry move-up" title="Move Up">↑</span>
                <span class="move-entry move-down" title="Move Down">↓</span>
                <span class="remove-entry" title="Remove Entry">×</span>
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
            <h5>Responsibilities, Achievements or Projects</h5>
            <div class="responsibilities-container" id="education-${index}-responsibilities" data-parent-type="education" data-parent-index="${index}">
                <!-- Responsibilities will be added here -->
            </div>
            <button type="button" class="btn btn-sm btn-secondary btn-add-responsibility" style="margin-top:10px;">+ Add Entry</button>
        </div>
    `;
}

function createExperienceTemplate(index) {
    return `
        <div class="entry-header">
            <div class="entry-title">Work Experience Entry #${index + 1}</div>
            <div class="entry-actions">
                <span class="move-entry move-up" title="Move Up">↑</span>
                <span class="move-entry move-down" title="Move Down">↓</span>
                <span class="remove-entry" title="Remove Entry">×</span>
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
            <h5>Responsibilities, Achievements or Projects</h5>
            <div class="responsibilities-container" id="experience-${index}-responsibilities" data-parent-type="experience" data-parent-index="${index}">
                <!-- Responsibilities will be added here -->
            </div>
            <button type="button" class="btn btn-sm btn-secondary btn-add-responsibility" style="margin-top:10px;">+ Add Entry</button>
        </div>
    `;
}

function createActivityTemplate(index) {
    return `
        <div class="entry-header">
            <div class="entry-title">Extracurricular Activity Entry #${index + 1}</div>
            <div class="entry-actions">
                <span class="move-entry move-up" title="Move Up">↑</span>
                <span class="move-entry move-down" title="Move Down">↓</span>
                <span class="remove-entry" title="Remove Entry">×</span>
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
            <h5>Responsibilities, Achievements or Projects</h5>
            <div class="responsibilities-container" id="activity-${index}-responsibilities" data-parent-type="activity" data-parent-index="${index}">
                <!-- Responsibilities will be added here -->
            </div>
            <button type="button" class="btn btn-sm btn-secondary btn-add-responsibility" style="margin-top:10px;">+ Add Entry</button>
        </div>
    `;
}

function createResponsibilityTemplate(index, parentType, parentIndex) {
    const uniqueId = `${parentType}-${parentIndex}-responsibility-description-${index}`;
    // The returned string is the innerHTML for a new div created in addResponsibilityBtn.
    // This structure includes a header and a form-group, both within that new div.
    return `
        <div class="responsibility-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <div class="responsibility-title" style="font-size: 0.95em; color: #555;">Entry #${index + 1}</div>
            <div class="responsibility-actions">
                <span class="remove-responsibility" title="Remove this entry" style="color: var(--danger-color); cursor: pointer; font-size: 1.2em;">×</span>
            </div>
        </div>
        <div class="form-group">
            <label for="${uniqueId}" style="font-size: 0.9em; margin-bottom:3px;">Description</label>
            <textarea id="${uniqueId}" name="${parentType}[${parentIndex}][responsibilities][${index}][description]" rows="3"></textarea>
            <div class="ai-controls" style="margin-top: 5px; display: flex; align-items: center; gap: 10px;">
                <button type="button" class="btn btn-secondary btn-sm btn-ai-enhance" data-target="${uniqueId}">Enhance with AI</button>
                <span id="ai-feedback-${uniqueId}" class="ai-feedback-area" style="display: inline-block; min-height: 24px; font-size: 0.9em;"></span>
            </div>
        </div>
    `;
}

// OpenAI integration
function initOpenAI() {
    window.enhanceWithAI = function(textElement, buttonElement) {
        const originalText = textElement.value.trim();
        const feedbackElementId = `ai-feedback-${textElement.id}`;
        const feedbackArea = document.getElementById(feedbackElementId);

        if (feedbackArea) {
            feedbackArea.textContent = ''; 
            feedbackArea.style.color = 'var(--text-color)';
        }

        if (!originalText) {
            if (feedbackArea) {
                feedbackArea.textContent = 'Please enter some text.';
                feedbackArea.style.color = 'var(--danger-color)';
                setTimeout(() => {
                    if (feedbackArea && feedbackArea.textContent === 'Please enter some text.') feedbackArea.textContent = '';
                }, 3000);
            } else {
                alert('Please enter some text to enhance.');
            }
            return;
        }

        if (buttonElement) buttonElement.disabled = true;
        if (feedbackArea) {
            feedbackArea.innerHTML = '<span class="loading" style="width:1em; height:1em; border-width:0.15em; vertical-align: middle; margin-right: 5px;"></span>Enhancing...';
        }
        
        fetch('/api/enhance-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: originalText,
                field_type: textElement.name.includes('responsibilities') ? 'responsibility' : textElement.name.split('[')[0]
            }),
        })
        .then(response => {
            if (buttonElement) buttonElement.disabled = false;
            if (feedbackArea) feedbackArea.innerHTML = ''; 
            
            if (!response.ok) {
                return response.json()
                    .catch(() => { // Handle cases where response is not valid JSON
                        throw new Error(`HTTP error ${response.status} - ${response.statusText || "Server error"}`);
                    })
                    .then(errData => {
                        throw new Error(errData?.error || `HTTP error ${response.status}`);
                    });
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                if (feedbackArea) {
                    feedbackArea.textContent = `Error: ${data.error}`;
                    feedbackArea.style.color = 'var(--danger-color)';
                } else {
                    alert(`Error: ${data.error}`);
                }
            } else if (data.enhanced_text) {
                textElement.value = data.enhanced_text;
                if (feedbackArea) {
                    feedbackArea.textContent = '✓ Enhanced!';
                    feedbackArea.style.color = 'var(--success-color)';
                    setTimeout(() => {
                        if (feedbackArea && feedbackArea.textContent === '✓ Enhanced!') feedbackArea.textContent = '';
                    }, 3000);
                }
            } else {
                if (feedbackArea) {
                    feedbackArea.textContent = 'Unexpected response. Please try again.';
                    feedbackArea.style.color = 'var(--danger-color)';
                }
            }
        })
        .catch(error => {
            if (buttonElement) buttonElement.disabled = false;
            if (feedbackArea) {
                feedbackArea.innerHTML = ''; 
                feedbackArea.textContent = `Failed: ${error.message}`;
                feedbackArea.style.color = 'var(--danger-color)';
            } else {
                console.error('AI Enhancement Error:', error);
                alert(`AI enhancement failed: ${error.message}`);
            }
        });
    };
}

// PDF Export functionality
function initPDFExport() {
    const exportButton = document.getElementById('export-pdf');
    const form = document.getElementById('cv-form');
    const previewButton = document.getElementById('preview-cv');


    if (exportButton && form) {
        exportButton.addEventListener('click', function() {
            if (!validateForm(form)) {
                alert('Please fill in all required fields before exporting.');
                return;
            }
            
            const originalButtonText = exportButton.innerHTML;
            exportButton.disabled = true;
            exportButton.innerHTML = '<span class="loading" style="width:1em; height:1em; border-width:0.15em; vertical-align: middle; margin-right: 5px;"></span>Generating PDF...';
            if(previewButton) previewButton.disabled = true;


            const formData = new FormData(form);
            // formData.append('export_pdf', 'true'); // This flag seems unused in backend based on current logic
            
            fetch('/generate-cv', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                return response.text().then(text => { throw new Error(text || 'PDF generation failed on server')});
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'CV.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('PDF Export Error:', error);
                alert(`PDF Export Failed: ${error.message}`);
            })
            .finally(() => {
                exportButton.disabled = false;
                exportButton.innerHTML = originalButtonText;
                if(previewButton) previewButton.disabled = false;
            });
        });
    }
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid'); // Consider adding .is-invalid styles in CSS
            valid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return valid;
}

// Preview CV
function updatePreview() {
    const form = document.getElementById('cv-form');
    const previewButton = document.getElementById('preview-cv');
    const exportButton = document.getElementById('export-pdf');

    if (!form) return;

    const originalButtonText = previewButton.innerHTML;
    previewButton.disabled = true;
    previewButton.innerHTML = '<span class="loading" style="width:1em; height:1em; border-width:0.15em; vertical-align: middle; margin-right: 5px;"></span>Loading Preview...';
    if(exportButton) exportButton.disabled = true;

    const formData = new FormData(form);
    
    fetch('/preview-cv', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || 'Preview generation failed')});
        }
        return response.text();
    })
    .then(html => {
        document.getElementById('cv-preview-content').innerHTML = html;
    })
    .catch(error => {
        console.error('Preview Error:', error);
        document.getElementById('cv-preview-content').innerHTML = `<div class="text-danger" style="padding:20px;">Error generating preview: ${error.message}</div>`;
    })
    .finally(() => {
        previewButton.disabled = false;
        previewButton.innerHTML = originalButtonText;
        if(exportButton) exportButton.disabled = false;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const previewButton = document.getElementById('preview-cv');
    if (previewButton) {
        previewButton.addEventListener('click', updatePreview);
    }
    // Initial preview load if needed, or on tab switch for relevant sections
    // updatePreview(); // Optionally load preview on page load
});
