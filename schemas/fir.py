from pydantic import BaseModel


class FIRRequest(BaseModel):
    text: str


class FIRResponse(BaseModel):
    fir: str
