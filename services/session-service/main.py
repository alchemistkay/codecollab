from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DBSession
from typing import List
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import asyncio
import os

from database import get_db, init_db, SessionLocal
from models import Session
from schemas import SessionCreate, SessionUpdate, SessionResponse

async def cleanup_expired_sessions():
    while True:
        await asyncio.sleep(3600)  # run every hour
        try:
            db = SessionLocal()
            db.query(Session).filter(
                Session.expires_at < datetime.utcnow(),
                Session.is_active == True
            ).update({'is_active': False})
            db.commit()
            db.close()
        except Exception as e:
            print(f"Session cleanup error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    task = asyncio.create_task(cleanup_expired_sessions())
    yield
    task.cancel()

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
        code=session_data.code,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/sessions/view/{view_id}", response_model=SessionResponse)
def get_session_by_view_id(view_id: str, db: DBSession = Depends(get_db)):
    """Get session by view_id (read-only token)"""
    session = db.query(Session).filter(Session.view_id == view_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.expires_at and session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Session expired")
    return session

@app.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, db: DBSession = Depends(get_db)):
    """Get session by ID"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.expires_at and session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Session expired")
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
    """Update session and reset expiry"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    update_data = session_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    # Reset expiry on every update (7-day rolling TTL)
    session.expires_at = datetime.utcnow() + timedelta(days=7)

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
