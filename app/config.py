import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  GOOGLE_API_KEY: str
  TAVILY_API_KEY: str

  model_config = SettingsConfigDict(
      env_file=".env", env_file_encoding="utf-8", extra="ignore"
  )


# Instantiate settings
settings = Settings()

# Explicitly export keys to os.environ so Tavily and Google SDKs detect them automatically
os.environ["GOOGLE_API_KEY"] = settings.GOOGLE_API_KEY
os.environ["TAVILY_API_KEY"] = settings.TAVILY_API_KEY