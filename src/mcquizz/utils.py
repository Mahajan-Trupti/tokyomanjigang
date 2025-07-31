from PyPDF2 import PdfReader
import io

def extract_text_from_pdf(uploaded_file):
    """
    THIS will extract text content from the uploaded PDF file

    arguements:
        uploaded_file -> a file-like object provided by streamlit's: st.file_uploader.

    returns:
        str: the extracted text content from the PDF 
        OR an empty string if extraction fails.
    """
    try:
        # PyPDF2 can directly read from a file-like object
        pdf_reader = PdfReader(uploaded_file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n"
        return text_content
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

# You can add other general utility functions here later, e.g., for text cleaning.
