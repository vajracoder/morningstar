# KrishiPulse — Architecture Decision Records (ADRs)

## ADR 001: Three Parallel Independent Workstreams
- **Context**: Developing a multi-faceted agri-fintech platform across 3 team members (Tilak, Kuldeep, Ishan) requires rapid progress without merge conflicts and blocking dependencies.
- **Decision**: Split repository ownership into `frontend/` (Tilak), `backend/market/`, `backend/intelligence/`, `backend/forecasting/`, `ml/` (Kuldeep), and `backend/marketplace/`, `backend/transactions/` (Ishan).
- **Consequence**: Each member relies on agreed API contracts in `docs/API_CONTRACTS.md` and mock/seeded data during parallel development.

## ADR 002: Abstract Data & ML Provider Interfaces
- **Context**: External data sources (Agmarknet, OpenMeteo, proprietary ML models) can be slow, rate-limited, or unstable during local dev and testing.
- **Decision**: All market data, weather observations, and forecast models must implement abstract base interfaces (`MarketDataProvider`, `WeatherProvider`, `ForecastService`).
- **Consequence**: The system seamlessly switches between seeded test providers and live external providers without changing business logic or API contracts.

## ADR 003: Transparent Explainable Intelligence Over Black-Box Models
- **Context**: Agricultural financial decisions (Sell vs Wait, Net Realisation, Buyer Matching) directly impact farmers' livelihoods.
- **Decision**: Implement transparent rule + ML hybrid calculations. Net Realisation displays line-item cost deductions; Buyer Matching displays 7 weighted factor scores and explicit match reasons.
- **Consequence**: Farmers and FPOs understand *why* a recommendation is made, fostering high trust.
