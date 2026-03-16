from sqlalchemy import Column, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import secrets

Base = declarative_base()

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(String(12), primary_key=True, default=lambda: secrets.token_urlsafe(8))
    title = Column(String(255), nullable=False)
    language = Column(String(50), nullable=False, default="python")
    code = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Session {self.id}: {self.title}>"
