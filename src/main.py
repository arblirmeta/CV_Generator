from flask import Flask, render_template, request, jsonify, send_file
import os
# import json # Removed as it's not directly used
import weasyprint
from io import BytesIO
import openai

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

# OpenAI API key - replace with your own key
openai_api_key = os.environ.get("OPENAI_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/preview-cv', methods=['POST'])
def preview_cv():
    # Process form data
    cv_data = process_form_data(request.form)
    
    # Render CV template with data
    html = render_template('cv_template.html', cv=cv_data)
    
    return html

@app.route('/generate-cv', methods=['POST'])
def generate_cv():
    # Process form data
    cv_data = process_form_data(request.form)
    
    # Render CV template with data
    html = render_template('cv_template.html', cv=cv_data)
    
    # Generate PDF
    pdf = BytesIO()
    weasyprint.HTML(string=html).write_pdf(pdf)
    pdf.seek(0)
    
    # Return PDF file
    return send_file(pdf, download_name='CV.pdf', as_attachment=True, mimetype='application/pdf')

@app.route('/api/enhance-text', methods=['POST'])
def enhance_text():
    data = request.json
    text = data.get('text', '')
    field_type = data.get('field_type', 'general')
    
    try:
        # Use OpenAI to enhance the text
        enhanced_text_result, error_message = enhance_with_ai(text, field_type)
        if error_message:
            print(f"Error from enhance_with_ai: {error_message}")
            return jsonify({'enhanced_text': enhanced_text_result, 'error': error_message}), 500 # Or 400/422 if client error
        return jsonify({'enhanced_text': enhanced_text_result})
    except Exception as e:
        # This handles errors in the enhance_text route itself, or re-raised from enhance_with_ai if not caught there
        print(f"Error in /api/enhance-text route: {e}")
        return jsonify({'enhanced_text': text, 'error': str(e)}), 500

def enhance_with_ai(text, field_type):
    # Set OpenAI API key
    if not openai_api_key:
        return text, "OpenAI API key is not configured on the server."
    openai.api_key = openai_api_key
    
    # Create prompt based on field type
    if field_type == 'education':
        prompt = f"Improve the following education description for a professional CV in McKinsey style. Make it concise, impactful, and highlight achievements. Original text: '{text}'"
    elif field_type == 'experience':
        prompt = f"Enhance the following work experience description for a professional CV in McKinsey style. Focus on achievements, quantify results where possible, and use action verbs. Original text: '{text}'"
    elif field_type == 'activity':
        prompt = f"Refine the following extracurricular activity description for a professional CV in McKinsey style. Highlight leadership, skills developed, and impact. Original text: '{text}'"
    elif field_type == 'responsibility':
        prompt = f"Improve the following responsibility or achievement description for a professional CV in McKinsey style. Make it concise, impactful, and use action verbs. Original text: '{text}'"
    else:
        prompt = f"Enhance the following text for a professional CV in McKinsey style. Make it concise and impactful. Original text: '{text}'"
    
    try:
        # Call OpenAI API
        messages = [
            {"role": "system", "content": "You are a helpful assistant that enhances CV text in a McKinsey style."},
            {"role": "user", "content": prompt}
        ]
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        
        # Print the full response for debugging (optional, can be removed in production)
        # print(f"OpenAI API Response: {response}") 
        
        # Extract and return enhanced text
        enhanced_text = response.choices[0].message['content'].strip()
        return enhanced_text, None
    except Exception as e:
        print(f"OpenAI API call failed: {e}")
        # Consider more specific error messages based on type of exception if possible
        return text, f"AI enhancement failed: {str(e)}"

def process_form_data(form):
    # Initialize CV data structure
    cv_data = {
        'personal': {},
        'education': [],
        'experience': [],
        'activity': [],
        'skills': {}
    }
    
    # Process personal information
    if 'personal[full_name]' in form:
        cv_data['personal']['full_name'] = form['personal[full_name]']
    if 'personal[birth_info]' in form:
        cv_data['personal']['birth_info'] = form['personal[birth_info]']
    if 'personal[nationality]' in form:
        cv_data['personal']['nationality'] = form['personal[nationality]']
    if 'personal[phone]' in form:
        cv_data['personal']['phone'] = form['personal[phone]']
    if 'personal[email]' in form:
        cv_data['personal']['email'] = form['personal[email]']
    if 'personal[linkedin]' in form:
        cv_data['personal']['linkedin'] = form['personal[linkedin]']
    
    # Process education entries
    education_count = count_entries(form, 'education')
    for i in range(education_count):
        education_entry = {
            'institution': form.get(f'education[{i}][institution]', ''),
            'location': form.get(f'education[{i}][location]', ''),
            'degree': form.get(f'education[{i}][degree]', ''),
            'start_date': form.get(f'education[{i}][start_date]', ''),
            'end_date': form.get(f'education[{i}][end_date]', ''),
            'gpa': form.get(f'education[{i}][gpa]', ''),
            'responsibilities': []
        }
        
        # Process responsibilities for this education entry
        responsibilities = process_responsibilities(form, 'education', i)
        education_entry['responsibilities'] = responsibilities
        
        cv_data['education'].append(education_entry)
    
    # Process experience entries
    experience_count = count_entries(form, 'experience')
    for i in range(experience_count):
        experience_entry = {
            'company': form.get(f'experience[{i}][company]', ''),
            'location': form.get(f'experience[{i}][location]', ''),
            'position': form.get(f'experience[{i}][position]', ''),
            'start_date': form.get(f'experience[{i}][start_date]', ''),
            'end_date': form.get(f'experience[{i}][end_date]', ''),
            'responsibilities': []
        }
        
        # Process responsibilities for this experience entry
        responsibilities = process_responsibilities(form, 'experience', i)
        experience_entry['responsibilities'] = responsibilities
        
        cv_data['experience'].append(experience_entry)
    
    # Process activity entries
    activity_count = count_entries(form, 'activity')
    for i in range(activity_count):
        activity_entry = {
            'organization': form.get(f'activity[{i}][organization]', ''),
            'location': form.get(f'activity[{i}][location]', ''),
            'role': form.get(f'activity[{i}][role]', ''),
            'start_date': form.get(f'activity[{i}][start_date]', ''),
            'end_date': form.get(f'activity[{i}][end_date]', ''),
            'responsibilities': []
        }
        
        # Process responsibilities for this activity entry
        responsibilities = process_responsibilities(form, 'activity', i)
        activity_entry['responsibilities'] = responsibilities
        
        cv_data['activity'].append(activity_entry)
    
    # Process skills
    if 'skills[languages]' in form:
        cv_data['skills']['languages'] = form['skills[languages]']
    if 'skills[technical]' in form:
        cv_data['skills']['technical'] = form['skills[technical]']
    if 'skills[interests]' in form:
        cv_data['skills']['interests'] = form['skills[interests]']
    
    return cv_data

def count_entries(form, section_name):
    # Count the number of entries in a section by looking for institution/company/organization fields
    count = 0
    field_name = ''
    
    if section_name == 'education':
        field_name = 'institution'
    elif section_name == 'experience':
        field_name = 'company'
    elif section_name == 'activity':
        field_name = 'organization'
    
    while f'{section_name}[{count}][{field_name}]' in form:
        count += 1
    
    return count

def process_responsibilities(form, parent_type, parent_index):
    responsibilities = []
    resp_index = 0
    
    # Look for responsibility entries
    while f'{parent_type}[{parent_index}][responsibilities][{resp_index}][description]' in form:
        resp_description = form[f'{parent_type}[{parent_index}][responsibilities][{resp_index}][description]']
        
        if resp_description.strip():
            responsibilities.append({
                'description': resp_description
            })
        
        resp_index += 1
    
    return responsibilities

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
