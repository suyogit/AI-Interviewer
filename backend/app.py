
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import T5Tokenizer, T5ForConditionalGeneration
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
import os

# Set the NLTK data path to ensure FastAPI can find the resources
nltk_data_path = "/home/yogesharyal/nltk_data"
os.environ['NLTK_DATA'] = nltk_data_path
nltk.data.path.append(nltk_data_path)

# Initialize FastAPI app
app = FastAPI()

# Load the T5 model and tokenizer from the specified model path
model_path = "./model"
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)

# Define subcategories for each category
subcategories = {
    'HTML': ['Semantic HTML', 'Forms', 'HTML5 features', 'Accessibility', 'SEO'],
    'CSS': ['Flexbox', 'Grid', 'Responsive design', 'Animations', 'Selectors'],
    'JavaScript': ['DOM manipulation', 'ES6+ features', 'Async programming', 'Event handling', 'Closures'],
    'MongoDB': ['CRUD operations', 'Indexing', 'Aggregation', 'Replication', 'Sharding'],
    'Node.js': ['Event loop', 'Modules', 'File system', 'HTTP', 'Express.js'],
    'MySQL': ['SQL basics', 'Joins', 'Indexes', 'Stored procedures', 'Transactions'],
    'API': ['REST', 'GraphQL', 'Authentication', 'Rate limiting', 'Versioning']
}

# Request model


class PromptRequest(BaseModel):
    category: str
    difficulty: str
    subcategory: str
    last_answer: str = None  # Optional previous answer to consider


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


@app.post("/generate_question/")
def generate_question(request: PromptRequest):
    if request.category not in subcategories:
        raise HTTPException(
            status_code=400, detail="Invalid category. Supported categories: " + ", ".join(subcategories.keys()))

    if request.subcategory not in subcategories[request.category]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid subcategory for {request.category}. Supported subcategories: {
                ', '.join(subcategories[request.category])}"
        )

    # Extract keywords from the last answer
    def extract_keywords(answer, num_keywords=3):
        stop_words = set(stopwords.words('english'))
        word_tokens = word_tokenize(answer.lower())
        keywords = [word for word in word_tokens if word.isalnum()
                    and word not in stop_words]
        return list(set(keywords))[:num_keywords]

    # Generate the question
    keywords = extract_keywords(
        request.last_answer) if request.last_answer else []
    input_text = f"generate {request.difficulty} {
        request.category} question about {request.subcategory}"
    if keywords:
        input_text += f" that relates to {', '.join(
            keywords)} from the previous answer, but explores a different aspect of {request.category}"

    # Limit input length to avoid excessive computation
    input_text = input_text[:512]

    input_ids = tokenizer.encode(input_text, return_tensors="pt")
    output = model.generate(input_ids, max_length=100,
                            num_return_sequences=1, temperature=0.6, do_sample=True)
    question = tokenizer.decode(output[0], skip_special_tokens=True)

    return {
        "category": request.category,
        "difficulty": request.difficulty,
        "subcategory": request.subcategory,
        "question": question
    }
