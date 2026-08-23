"""
KrishiPulse Market Intelligence & AI Engine — FastAPI Application Entry Point.
Owned by Kuldeep.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.core.config import settings
from backend.app.seed.seed_data import init_db_and_seed
from backend.app.market.router import router as market_router
from backend.app.intelligence.router import router as digital_twin_router, standalone_net_router
from backend.app.forecasting.router import router as forecasting_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and populate seed data
    init_db_and_seed()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="AI-powered Agricultural Market Intelligence and Decision Support Backend for KrishiPulse.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware for Tilak's frontend (Vite React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(market_router)
app.include_router(digital_twin_router)
app.include_router(standalone_net_router)
app.include_router(forecasting_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "KrishiPulse Intelligence Engine",
        "workstream": "Kuldeep (Market Intelligence + AI/ML)",
        "status": "online",
        "docs": "/docs"
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "database": "connected", "mode": "demo_active"}
