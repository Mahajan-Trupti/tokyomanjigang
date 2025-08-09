import os
import PyPDF2
import re
import json
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()

# load API keys
GOOGLE_API_KEY_MAIN = os.getenv("GOOGLE_API_KEY_MAIN")
GOOGLE_API_KEY_SUMMARY = os.getenv("GOOGLE_API_KEY_SUMMARY")

if not GOOGLE_API_KEY_MAIN:
    raise ValueError("GOOGLE_API_KEY_MAIN must be set in your environment or .env file")
if not GOOGLE_API_KEY_SUMMARY:
    raise ValueError("GOOGLE_API_KEY_SUMMARY must be set in your environment or .env file")

# create LLM instances
llm_main = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest",
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY_MAIN
)

llm_summary = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest",
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY_SUMMARY
)

MAX_CONTEXT_LENGTH = 100000

# --- Prompt Chains ---
topic_prompt = PromptTemplate.from_template("""
You are an intelligent document analyzer.
Your task is to read the provided text and identify the main topics covered.
Provide exactly 9 topics. The topics should be concise and relevant to the content.
Return the topics as a JSON array of strings, for example: ["Topic 1", "Topic 2", "Topic 3"].

=== INPUT START ===
{text} === INPUT END ===
""")
topic_chain = topic_prompt | llm_main | StrOutputParser()

keyword_prompt = PromptTemplate.from_template("""
You are a text analyzer.
Your task is to read the provided text and identify the most important keywords and key phrases.
Provide exactly 10 keywords/phrases. They should be concise and directly relevant to the content.
Return the keywords as a JSON array of strings, for example: ["Keyword 1", "Keyword 2", "Keyword 3"].

=== INPUT START ===
{text} === INPUT END ===
""")
keyword_chain = keyword_prompt | llm_main | StrOutputParser()

summary_prompt = PromptTemplate.from_template("""
You are an expert summarizer.
Your task is to create a concise and accurate summary of the following text.
The summary should be approximately 5-7 sentences long.
It must capture the main ideas and key points without adding new information.

=== INPUT START ===
{text} === INPUT END ===
""")
summary_chain = summary_prompt | llm_summary | StrOutputParser()

mcq_prompt_multiple = """
You are an intelligent and structured MCQ (Multiple Choice Question) generator.

Your task is to read the given educational content and create exactly {num_questions} multiple-choice questions (MCQs) that meet the following guidelines. The questions should have a difficulty level of {difficulty}.

{topics_instruction}

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
{text} === INPUT END ===
"""
prompt = PromptTemplate.from_template(mcq_prompt_multiple)
mcq_chain = prompt | llm_main | StrOutputParser()

# --- pdf text extraction ---
def extract_pdf_text_from_file(pdf_path):
    text = ""
    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None
    return text

# --- parsing the mcqs ---
def parse_mcq_output(text_output):
    mcq_parts = text_output.split('Question:')
    mcq_list = [('Question:' + part).strip() for part in mcq_parts if part.strip()]
    return mcq_list

# --- func for summary ---
def generate_summary_from_file(pdf_path):
    pdf_text = extract_pdf_text_from_file(pdf_path)
    if not pdf_text:
        return None
    trimmed_text = pdf_text[:MAX_CONTEXT_LENGTH]
    try:
        result = summary_chain.invoke({"text": trimmed_text})
        return result
    except Exception as e:
        print(f"Error generating summary: {e}")
        raise e

# --- func for keywords ---
def generate_keywords_from_file(pdf_path):
    pdf_text = extract_pdf_text_from_file(pdf_path)
    if not pdf_text:
        return []
    trimmed_text = pdf_text[:MAX_CONTEXT_LENGTH]
    try:
        result = keyword_chain.invoke({"text": trimmed_text})
        match = re.search(r'\[.*?\]', result, re.DOTALL)
        if match:
            json_string = match.group(0)
            keywords = json.loads(json_string)
            return keywords
        else:
            return []
    except Exception as e:
        print(f"Error generating keywords: {e}")
        raise e

# --- topics ---
def generate_topics_from_file(pdf_path):
    pdf_text = extract_pdf_text_from_file(pdf_path)
    if not pdf_text:
        print("No PDF text extracted.")
        return []
    trimmed_text = pdf_text[:MAX_CONTEXT_LENGTH]
    try:
        result = topic_chain.invoke({"text": trimmed_text})
        match = re.search(r'\[.*?\]', result, re.DOTALL)
        if match:
            json_string = match.group(0)
            topics = json.loads(json_string)
            return topics
        else:
            return []
    except Exception as e:
        print(f"Error generating topics: {e}")
        raise e

# --- func for mcq generation ---
def generate_mcqs_from_file(pdf_path, difficulty, num_questions, topics, max_retries=5, initial_delay=1):
    pdf_text = extract_pdf_text_from_file(pdf_path)
    if not pdf_text:
        return ["No text extracted from the PDF or file not found."]
    trimmed_text = pdf_text[:MAX_CONTEXT_LENGTH]

    topics_instruction = ""
    if topics:
        topics_instruction = f"The questions should be focused on the following topics: {', '.join(topics)}."

    retries = 0
    while retries < max_retries:
        try:
            result = mcq_chain.invoke({
                "text": trimmed_text,
                "difficulty": difficulty.capitalize(),
                "num_questions": num_questions,
                "topics_instruction": topics_instruction
            })
            parsed_mcqs = parse_mcq_output(result)
            return parsed_mcqs
        except Exception as e:
            print(f"Error generating MCQs: {e}")
            if "quota" in str(e).lower() or "rate limit" in str(e).lower():
                delay = initial_delay * (2 ** retries)
                print(f"Rate limit hit. Retrying in {delay} seconds (Retry {retries + 1}/{max_retries})...")
                time.sleep(delay)
                retries += 1
            else:
                raise e

    raise Exception(f"Failed to generate MCQs after {max_retries} retries due to API limits.")