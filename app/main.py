import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ResearchRequest, ResearchResponse
from app.services.agent import run_research_agent

# Configure logging to track API requests and agent activity in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Personal Research Assistant API",
    description="Backend API powered by FastAPI, LangChain, Gemini, and Tavily Search.",
    version="1.0.0",
)

# Enable CORS middleware (Crucial edge case: allows your future frontend to talk to this backend seamlessly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # In production, restrict this to your frontend domain (e.g., http://localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health Check"])
def root():
  """Health check endpoint to verify the API is online."""
  return {
      "status": "online",
      "message": "Personal Research Assistant API is running successfully.",
  }


@app.post(
    "/research",
    response_model=ResearchResponse,
    status_code=status.HTTP_200_OK,
    tags=["Research"],
)
async def conduct_research(payload: ResearchRequest):
  """Accepts a research topic, executes the LangChain agent with Tavily search and Gemini,

  and returns a structured research report with key findings and source links.
  """
  try:
    logger.info(f"Incoming research request for topic: '{payload.topic}'")

    # Execute the LangChain agent asynchronously
    result = await run_research_agent(payload.topic)

    logger.info(
        f"Research successfully completed for topic: '{payload.topic}'"
    )
    return ResearchResponse(**result)

  except Exception as e:
    logger.error(
        f"Error executing research agent for topic '{payload.topic}':"
        f" {str(e)}",
        exc_info=True,
    )
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"An error occurred while conducting research: {str(e)}",
    )