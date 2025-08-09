import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import json
from MCQGenerator import (
    generate_mcqs_from_file,
    generate_topics_from_file,
    generate_summary_from_file,
    generate_keywords_from_file
)

app = Flask(__name__)
CORS(app)

def save_temp_pdf(pdf_file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        pdf_file.save(tmp_file.name)
        return tmp_file.name

@app.route('/extract_topics', methods=['POST'])
def extract_topics():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf_file']
    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if pdf_file and pdf_file.filename.endswith('.pdf'):
        temp_pdf_path = save_temp_pdf(pdf_file)
        try:
            topics = generate_topics_from_file(temp_pdf_path)
            return jsonify({"topics": topics}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to extract topics: {str(e)}"}), 500
        finally:
            os.remove(temp_pdf_path)
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route('/extract_summary', methods=['POST'])
def extract_summary():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf_file']
    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if pdf_file and pdf_file.filename.endswith('.pdf'):
        temp_pdf_path = save_temp_pdf(pdf_file)
        try:
            summary = generate_summary_from_file(temp_pdf_path)
            return jsonify({"summary": summary}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500
        finally:
            os.remove(temp_pdf_path)
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route('/extract_topics_and_summary', methods=['POST'])
def extract_topics_and_summary():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf_file']
    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if pdf_file and pdf_file.filename.endswith('.pdf'):
        temp_pdf_path = save_temp_pdf(pdf_file)
        try:
            topics = generate_topics_from_file(temp_pdf_path)
            summary = generate_summary_from_file(temp_pdf_path)
            keywords = generate_keywords_from_file(temp_pdf_path)
            return jsonify({
                "topics": topics,
                "summary": summary,
                "keywords": keywords
            }), 200
        except Exception as e:
            return jsonify({"error": f"Failed to extract data: {str(e)}"}), 500
        finally:
            os.remove(temp_pdf_path)
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    if 'pdf_file' not in request.files:
        return jsonify({"error": "No PDF file provided"}), 400

    pdf_file = request.files['pdf_file']
    difficulty = request.form.get('difficulty', 'medium')
    num_questions = int(request.form.get('numQuestions', 5))
    topics_json = request.form.get('topics', '[]')
    topics = json.loads(topics_json)

    if pdf_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if pdf_file and pdf_file.filename.endswith('.pdf'):
        temp_pdf_path = save_temp_pdf(pdf_file)
        try:
            mcqs = generate_mcqs_from_file(temp_pdf_path, difficulty, num_questions, topics)
            return jsonify({"mcqs": mcqs}), 200
        except Exception as e:
            return jsonify({"error": f"Failed to generate MCQs: {str(e)}"}), 500
        finally:
            os.remove(temp_pdf_path)
    else:
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

@app.route('/')
def index():
    return "Flask backend is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)

