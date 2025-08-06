import os
import PyPDF2
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Enter API Key Here
# IMPORTANT: In a production environment, never hardcode API keys.
# Use environment variables or a secure configuration management system.
os.environ["GOOGLE_API_KEY"] = "AIzaSyBquj6MpHZ8n-zvtpUM6t7aHSKT0aFwh9k" # Replace with your actual API key

# extract pdf func
def extract_pdf_text_from_file(pdf_path):
    """
    Extracts text from a single PDF file, handling potential errors.
    """
    text = ""
    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                else:
                    print(f"Warning: Page {page_num + 1} has no extractable text.")
    except FileNotFoundError:
        print(f"Error: The file at {pdf_path} was not found.")
        return None
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None
    return text

# gemini setup
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0.3)
MAX_CONTEXT_LENGTH = 100000

# Modified prompt to generate multiple questions in one go
mcq_prompt_multiple = """
You are an intelligent and structured MCQ (Multiple Choice Question) generator.

Your task is to read the given educational content and create exactly {num_questions} multiple-choice questions (MCQs) that meet the following guidelines. The questions should have a difficulty level of {difficulty}.

1. Format:
Question: <your question>
Options:
A. <option A>
B. <option B>
C. <option C>
D. <option D>
Answer: <Correct Option Letter>
Explanation: <Short explanation of the correct answer>
Difficulty: <Easy / Medium / Hard>
Topic: <Main concept or subject>

Repeat this format for each of the {num_questions} questions.

2. Guidelines:
- Use only information from the provided content.
- Avoid vague or trivial questions.
- Distractors must be plausible but incorrect.
- The output should be plain text. Do not use any markdown formatting.

=== INPUT START ===
{text}
=== INPUT END ===
"""

prompt = PromptTemplate.from_template(mcq_prompt_multiple)
#chain
chain = prompt | llm | StrOutputParser()

# New function to parse the single output string into a list of questions
def parse_mcq_output(text_output):
    """
    Parses a single string containing multiple MCQs into a list of strings,
    where each string is one full MCQ.
    """
    # Split the text by "Question:"
    mcq_parts = text_output.split('Question:')
    
    # The first part is likely empty or a preamble. We process the rest.
    mcq_list = [('Question:' + part).strip() for part in mcq_parts if part.strip()]

    return mcq_list

# Updated generate mcq func with parameterized input
def generate_mcqs_from_file(pdf_path, difficulty, num_questions):
    """
    Generates multiple-choice questions from a PDF file using the Gemini API in a single call.
    """
    pdf_text = extract_pdf_text_from_file(pdf_path)
    if not pdf_text:
        return ["No text extracted from the PDF or file not found."]
    
    trimmed_text = pdf_text[:MAX_CONTEXT_LENGTH]

    print(f"\n--- Generating {num_questions} {difficulty} MCQs in a single API call... ---")

    try:
        result = chain.invoke({
            "text": trimmed_text, 
            "difficulty": difficulty.capitalize(), 
            "num_questions": num_questions
        })
        
        # Parse the single string result into a list of individual MCQs
        parsed_mcqs = parse_mcq_output(result)
        
        return parsed_mcqs
    except Exception as e:
        print(f"Error generating MCQs: {e}")
        return [f"Error generating MCQs: {e}"]
