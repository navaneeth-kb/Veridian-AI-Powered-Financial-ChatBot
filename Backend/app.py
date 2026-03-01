from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router
from qa import router as qa_router  # ← ADD THIS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(api_router)
app.include_router(qa_router)  # ← ADD THIS