# Bytelingo: Programming Language Translation Tool 🦜

Bytelingo is a robust programming language translation tool powered by Large Language Models (LLMs). It offers a clean and minimalist design, providing a user-friendly experience for developers to translate code between different programming languages seamlessly.

## Features

- **User Registration and Login:** Bytelingo allows users to create accounts and securely log in to access the translation features.
- **Translation Page:** Users can specify the input and output programming languages and provide code snippets for translation. The output code will also support syntax highlighting, just like a regular IDE!
- **Quality Feedback:** After the translation is complete, users can provide feedback on the quality of the generated code, helping to improve the translation model over time.

## Installation

### Backend

1. Clone the repository: `git clone https://github.com/gauricb/mutate.git`
2. Navigate to the backend directory: `cd bytelingo/backend`
3. Install the required dependencies using pip: `pip install -r requirements.txt`
4. Start the backend server: `python main.py`

### Frontend

1. Navigate to the frontend directory: `cd bytelingo/frontend`
2. Install the required dependencies using npm: `npm install`
3. Start the development server: `npm start`

## Configuration

Create a `.env` file in the root directory and add the required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for accessing the LLM.
- `SUPABASE_URL`: The URL for your Supabase database instance.
- `SUPABASE_KEY`: The key for your Supabase database instance.

## Datasets

Bytelingo does not rely on any specific datasets. Though it could be useful to use a dataset to benchmark translation quality.
