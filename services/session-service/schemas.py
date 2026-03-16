from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class SessionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Session title")
    language: str = Field(default="python", description="Programming language")
    code: Optional[str] = Field(default="", description="Initial code")
    
    @validator('language')
    def validate_language(cls, v):
        allowed = ['python', 'javascript', 'go', 'rust']
        if v.lower() not in allowed:
            raise ValueError(f'Language must be one of: {", ".join(allowed)}')
        return v.lower()

class SessionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = None
    is_active: Optional[bool] = None

class SessionResponse(BaseModel):
    id: str
    title: str
    language: str
    code: str
    created_at: datetime
    updated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
