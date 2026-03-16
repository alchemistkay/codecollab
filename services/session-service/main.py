from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DBSession
from typing import List
from contextlib import asynccontextmanager
import os

from database import get_db, init_db
from models import Session
from schemas import SessionCreate, SessionUpdate, SessionResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (cleanup if needed)

app = FastAPI(
    title="CodeCollab Session Service",
    description="Manages coding session lifecycle",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "session-service",
        "version": "1.0.0"
    }

@app.post("/sessions", response_model=SessionResponse, status_code=201)
def create_session(session_data: SessionCreate, db: DBSession = Depends(get_db)):
    """Create a new coding session"""
    session = Session(
        title=session_data.title,
        language=session_data.language,
        code=session_data.code
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, db: DBSession = Depends(get_db)):
    """Get session by ID"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.get("/sessions", response_model=List[SessionResponse])
def list_sessions(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: DBSession = Depends(get_db)
):
    """List all sessions"""
    query = db.query(Session)
    if active_only:
        query = query.filter(Session.is_active == True)
    sessions = query.offset(skip).limit(limit).all()
    return sessions

@app.patch("/sessions/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: str,
    session_update: SessionUpdate,
    db: DBSession = Depends(get_db)
):
    """Update session"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    update_data = session_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)
    
    db.commit()
    db.refresh(session)
    return session

@app.delete("/sessions/{session_id}", status_code=204)
def delete_session(session_id: str, db: DBSession = Depends(get_db)):
    """Soft delete session"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.is_active = False
    db.commit()
    return None

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)
