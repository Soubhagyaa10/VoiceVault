from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.gemini_service import generate_fir_from_testimony

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FIRRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}

@app.post("/generate-fir")
async def generate_fir(request: FIRRequest):
    text = request.text.strip()

    if not text or len(text) < 10:
        return {"success": False, "error": "Text too short"}

    try:
        result = generate_fir_from_testimony(text)
        return {
            "success": True,
            "fir_report": result
        }

    except Exception as e:
        print("ERROR:", str(e))  # terminal me actual error dikhega
        return {
            "success": False,
            "error": str(e)  # testing ke time real error show karo
        }

