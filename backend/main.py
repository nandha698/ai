from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key from environment variable
REPLICATE_API_KEY = os.getenv("REPLICATE_API_KEY")

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate-image/")
def generate_image(request: PromptRequest):
    if not REPLICATE_API_KEY:
        raise HTTPException(status_code=500, detail="API Key is missing.")

    headers = {"Authorization": f"Token {REPLICATE_API_KEY}"}
    data = {"version": "latest", "input": {"prompt": request.prompt}}

    response = requests.post("https://api.replicate.com/v1/predictions", json=data, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Image generation failed.")
    
    return {"output": response.json().get("output")}
