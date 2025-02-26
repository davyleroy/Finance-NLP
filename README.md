# Finance-NLP

## Overview

Finance-NLP is a comprehensive project that leverages Natural Language Processing (NLP) to analyze and extract valuable insights from financial documents such as 10-K filings. The project includes an AI model for processing financial data, a FastAPI backend for serving the model, and a React-based frontend for interacting with the chatbot.

## Project Structure

- **AI Model**: The AI model is built using transformers and is designed to process financial documents, extract relevant information, and answer questions based on the content.
- **Backend**: The backend is implemented using FastAPI, which serves the AI model and handles API requests from the frontend.
- **Frontend**: The frontend is a React application that provides a user-friendly interface for interacting with the chatbot.

## AI Model

The AI model is based on GPT-2 and fine-tuned on financial data to understand and respond to queries related to financial documents. The model is loaded and served using FastAPI.

### Key Components

- **Tokenizer and Model**: The GPT-2 tokenizer and model are loaded using the `transformers` library.
- **Chatbot Response Function**: A function to generate responses based on user input.
- **API Endpoint**: A FastAPI endpoint to handle POST requests and return the chatbot's response.

## Backend

The backend is implemented using FastAPI and includes the following key components:

- **CORS Middleware**: Configured to allow cross-origin requests from the frontend.
- **API Endpoint**: A POST endpoint `/chat/` that receives user input, processes it using the AI model, and returns the response.

### Example Code

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained("chatbot_model/checkpoint-3499")
tokenizer.pad_token = tokenizer.eos_token

class ChatRequest(BaseModel):
    user_input: str

def chatbot_response(user_input):
    input_text = f"User: {user_input}\nBot:"
    inputs = tokenizer(input_text, return_tensors="pt")
    input_ids = inputs.input_ids
    attention_mask = inputs.attention_mask

    with torch.no_grad():
        output = model.generate(input_ids, attention_mask=attention_mask, max_length=50, pad_token_id=tokenizer.eos_token_id)

    response = tokenizer.decode(output[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    return response.strip()

@app.post("/chat/")
def chat(request: ChatRequest):
    response = chatbot_response(request.user_input)
    return {"bot_response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```
