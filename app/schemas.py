from typing import List
from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
  topic: str = Field(
      ...,
      min_length=3,
      description="The research topic or question you want the agent to investigate.",
      example="Latest developments in Agentic AI",
  )


class ResearchResponse(BaseModel):
  topic: str = Field(..., description="The original research topic.")
  key_findings: List[str] = Field(
      ..., description="Bulleted key insights synthesized by the LLM."
  )
  sources: List[str] = Field(
      ..., description="List of source URLs retrieved by Tavily."
  )
  final_summary: str = Field(
      ..., description="Comprehensive final summary narrative."
  )