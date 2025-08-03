from langchain.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional
import getpass
import os

# --- Step 1: Set your Gemini API Key ---
if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = getpass.getpass("AIzaSyCO93G4HVTCb085BcFTFDopHfM28EtGtN0")

# --- Step 2: Load and split the PDF using the new path ---
pdf_path = r"C:\Users\hp\Downloads\Curve-tracing.pdf"
loader = PyMuPDFLoader(pdf_path)
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = splitter.split_documents(documents)

# --- Step 3: Define MCQ Output Schema ---
class McqExtractor(BaseModel):
    EasyMcqs: Optional[str] = Field(default=None, description="Any 1 easy-level MCQs from the PDF.")
    MediumMcqs: Optional[str] = Field(default=None, description="Any 1 medium-level MCQs from the PDF.")
    HardMcqs: Optional[str] = Field(default=None, description="Any 1 hard-level MCQs from the PDF.")
    MixedMcqs: Optional[str] = Field(default=None, description="Mixed difficulty-level MCQs from the PDF.Print any 2")

# --- Step 4: Define the tool ---
@tool
def extract_mcq(text: str) -> McqExtractor:
    """Generate MCQs based on difficulty levels (easy, medium, hard, mixed) from the given text."""
    pass  # Tool registration only

# --- Step 5: Configure Gemini Pro LLM ---
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.environ["GOOGLE_API_KEY"]
)

# --- Step 6: Bind LLM with the MCQ extraction tool ---
llm_tool = llm.bind_tools([extract_mcq])

# --- Step 7: Loop through PDF chunks and get MCQs ---
for i, doc in enumerate(docs):
    chunk_text = doc.page_content

    prompt = f"""
    You are an MCQ generator. Read the following content and return 10 MCQs 
    in easy, medium, hard, and mixed formats using the extract_mcq tool.

    Content:
    {chunk_text}
    """

    response = llm_tool.invoke(prompt)

    print(f"\n--- MCQ Set {i+1} ---")

    if response.tool_calls:
        print(response.tool_calls[0]["args"])
    else:
        print("❌ No MCQs generated for this chunk.")