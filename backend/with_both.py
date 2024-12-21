import time
import random
import nltk
import speech_recognition as sr
import pyttsx3  # Import pyttsx3 for text-to-speech
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from transformers import T5Tokenizer, T5ForConditionalGeneration
import warnings
from transformers import logging

# Setup NLTK and Transformers
warnings.filterwarnings("ignore")
logging.set_verbosity_error()

nltk.data.path.append('/home/yogesharyal/.conda/envs/mlproj/bin/nltk')

# Load the T5 model and tokenizer from the specified path
model_path = "./backend_question_generator_model_context"
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)

# Define categories and their respective time limits
categories = {
    'HTML': 300,     # 5 minutes
    'CSS': 180,      # 3 minutes
    'JavaScript': 420,  # 7 minutes
    'MongoDB': 300,  # 5 minutes
    'Node.js': 900,  # 15 minutes
    'MySQL': 300,    # 5 minutes
    'API': 300       # 5 minutes
}

# Define difficulty levels and their corresponding scores
difficulty_scores = {
    'Easy': 1,
    'Medium': 2,
    'Hard': 3
}

# Keep track of asked questions
asked_questions = set()

# Define subcategories for each main category
subcategories = {
    'HTML': ['Semantic HTML', 'Forms', 'HTML5 features', 'Accessibility', 'SEO'],
    'CSS': ['Flexbox', 'Grid', 'Responsive design', 'Animations', 'Selectors'],
    'JavaScript': ['DOM manipulation', 'ES6+ features', 'Async programming', 'Event handling', 'Closures'],
    'MongoDB': ['CRUD operations', 'Indexing', 'Aggregation', 'Replication', 'Sharding'],
    'Node.js': ['Event loop', 'Modules', 'File system', 'HTTP', 'Express.js'],
    'MySQL': ['SQL basics', 'Joins', 'Indexes', 'Stored procedures', 'Transactions'],
    'API': ['REST', 'GraphQL', 'Authentication', 'Rate limiting', 'Versioning']
}


def similar(a, b):
    return a.lower() == b.lower()


def extract_keywords(answer, num_keywords=3):
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(answer.lower())
    keywords = [word for word in word_tokens if word.isalnum()
                and word not in stop_words]
    return list(set(keywords))[:num_keywords]


def get_category_terms(category):
    terms = {
        'HTML': ['HTML', 'tag', 'element', 'attribute', 'DOM'],
        'CSS': ['CSS', 'style', 'selector', 'property', 'layout'],
        'JavaScript': ['JavaScript', 'function', 'variable', 'object', 'array', 'DOM'],
        'MongoDB': ['MongoDB', 'document', 'collection', 'query', 'database'],
        'Node.js': ['Node.js', 'server', 'module', 'npm', 'express'],
        'MySQL': ['MySQL', 'SQL', 'table', 'query', 'database'],
        'API': ['API', 'endpoint', 'request', 'response', 'REST']
    }
    return terms.get(category, [category])


def generate_unique_question(category, difficulty, subcategory, last_answer="", max_attempts=5):
    for _ in range(max_attempts):
        keywords = extract_keywords(last_answer) if last_answer else []

        input_text = f"generate {difficulty} {
            category} question about {subcategory}"
        if keywords:
            input_text += f" that relates to {', '.join(
                keywords)} from the previous answer, but explores a different aspect of {category}"

        input_ids = tokenizer.encode(input_text, return_tensors="pt")
        output = model.generate(
            input_ids, max_length=100, num_return_sequences=1, temperature=0.6, do_sample=True)
        question = tokenizer.decode(output[0], skip_special_tokens=True)

        category_terms = get_category_terms(category)
        if any(term.lower() in question.lower() for term in category_terms) and (not keywords or any(keyword.lower() in question.lower() for keyword in keywords)):
            if not any(similar(question, asked) for asked in asked_questions):
                asked_questions.add(question)
                return question

    return f"Building on your previous answer about {', '.join(keywords) if keywords else subcategory}, can you explain another {difficulty} concept related to {subcategory} in {category}?"


def evaluate_answer(user_answer, expected_answer):
    return random.uniform(0, 1)  # Replace with actual evaluation logic


def format_time(seconds):
    minutes = seconds // 60
    seconds = seconds % 60
    return f"{int(minutes)}:{int(seconds):02d}"


def generate_category_questions(category, difficulty, last_answer=None):
    subcategory = random.choice(subcategories[category])
    question = generate_unique_question(
        category, difficulty, subcategory, last_answer)
    return [(difficulty, subcategory, question)]


def conduct_interview():
    total_score = 0
    start_time = time.time()
    total_time_limit = 2700  # 45 minutes
    last_answer = None

    frontend_categories = ['HTML', 'CSS', 'JavaScript']
    backend_categories = ['MongoDB', 'Node.js', 'MySQL', 'API']

    all_categories = frontend_categories + backend_categories

    # Initialize the speech recognizer and TTS engine
    recognizer = sr.Recognizer()
    tts_engine = pyttsx3.init()

    for category in all_categories:
        time_limit = categories[category]
        print(
            f"\n--- Starting {category} section (Time limit: {time_limit // 60} minutes) ---")
        category_start_time = time.time()
        category_score = 0
        difficulty = 'Easy'
        easy_score = 0
        subcategory_index = 0

        while time.time() - category_start_time < time_limit:
            remaining_category_time = time_limit - \
                (time.time() - category_start_time)
            remaining_total_time = total_time_limit - \
                (time.time() - start_time)

            print(f"\nTime left for {category}: {
                  format_time(remaining_category_time)}")
            print(f"Total time left: {format_time(remaining_total_time)}")

            subcategory = subcategories[category][subcategory_index]
            questions = generate_category_questions(
                category, difficulty, last_answer)
            difficulty, _, question = questions[0]

            # Convert the question to speech using pyttsx3
            print(f"\nQuestion ({difficulty}): {question}")
            tts_engine.say(question)
            tts_engine.runAndWait()  # Wait for speech to finish

            # Capture user's answer through speech
            print("\nPlease provide your answer by speaking...")
            with sr.Microphone() as source:
                recognizer.adjust_for_ambient_noise(source)
                audio = recognizer.listen(source)

            try:
                user_answer = recognizer.recognize_google(audio)
                print(f"Your answer: {user_answer}")
            except sr.UnknownValueError:
                print("Sorry, I could not understand your speech. Please try again.")
                continue  # Skip this round if the answer is not recognized
            except sr.RequestError as e:
                print(
                    f"Could not request results from Google Speech Recognition service; {e}")
                break

            expected_answer = generate_unique_question(
                category, difficulty, subcategory)

            score = evaluate_answer(
                user_answer, expected_answer) * difficulty_scores[difficulty]
            category_score += score

            last_answer = user_answer

            if difficulty == 'Easy':
                easy_score += score
                if easy_score > 1.5:
                    difficulty = 'Medium'
                    print("\nProgressing to Medium difficulty questions.")
            elif difficulty == 'Medium':
                if score >= 2:
                    difficulty = 'Hard'
                    print("\nProgressing to Hard difficulty questions.")

            subcategory_index = (subcategory_index +
                                 1) % len(subcategories[category])

            if time.time() - category_start_time >= time_limit:
                break

        total_score += category_score

        if time.time() - start_time >= total_time_limit:
            break

    remaining_time = max(0, total_time_limit - (time.time() - start_time))
    print(f"\nInterview completed. Total score: {total_score:.2f}")
    print(f"Time remaining: {format_time(remaining_time)}")


# Run the interview
conduct_interview()
