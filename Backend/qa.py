from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

router = APIRouter()

# -----------------------------
# Load model ONCE at startup
# -----------------------------
model_name = "google/flan-t5-base"

print("🔄 Loading FLAN-T5...")

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

print(f"✅ Model loaded on {device}")


# -----------------------------
# Request schema
# -----------------------------
class Query(BaseModel):
    question: str


# -----------------------------
# QA endpoint
# -----------------------------
@router.post("/ask")
def ask_question(data: Query):
    try:
        prompt = (
            "Explain the following financial concept in simple terms.\n\n"
            f"Question: {data.question}\n\n"
            "Give a clear paragraph explanation suitable for beginners.\n"
            "Answer:"
        )

        inputs = tokenizer(prompt, return_tensors="pt").to(device)

        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.6,
            top_p=0.9,
            do_sample=True,
            repetition_penalty=1.2,
            length_penalty=1.1,
            min_new_tokens=60,   # ⭐ IMPORTANT: forces longer answer
        )

        answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

        return {"answer": answer.strip()}

    except Exception as e:
        return {"error": str(e)}