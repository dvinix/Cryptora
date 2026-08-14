"""
AWS Lambda handler for Cryptora backend.
Uses Mangum to adapt FastAPI for Lambda execution.
"""
from mangum import Mangum
from app.main import app

# Create Lambda handler
# lifespan="off" prevents startup/shutdown events from running on every request
handler = Mangum(app, lifespan="off")

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
