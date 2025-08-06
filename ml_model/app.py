import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile # For handling temporary files securely

# Import the MCQ generation functions from the separate file
# Assuming MCQGenerator.py is in the same directory as app.py
from MCQGenerator import generate_mcqs_from_file

app = Flask(__name__)
CORS(app) # Enable CORS for all routes, allowing frontend to connect

# --- Flask Routes ---

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400
    
    pdf_file = request.files['pdf_file']
    difficulty = request.form.get('difficulty', 'medium')
    num_questions = int(request.form.get('numQuestions', 5))

    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if pdf_file and pdf_file.filename.endswith('.pdf'):
        # Use a temporary file to save the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            pdf_file.save(tmp_file.name)
            temp_pdf_path = tmp_file.name

        try:
            # Call the function from MCQGenerator.py
            mcqs = generate_mcqs_from_file(temp_pdf_path, difficulty, num_questions)
            return jsonify({"mcqs": mcqs}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to generate MCQs: {str(e)}"}), 500
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route('/')
def index():
    return "Flask backend is running!"

if __name__ == '__main__':
    # For development, run with debug=True. In production, use a production-ready WSGI server.
    app.run(debug=True, port=5000)
