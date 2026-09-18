# Travel Safe — Safety Data Source Research

## Source of truth

Product repository: https://github.com/MargaretThomas/travel-safe

The product already has:
- Python 3.12 + FastAPI backend in `backend/code`;
- Expo / React Native frontend in `frontend/code`;
- backend contract ownership in `backend/docs/architecture.md`;
- backend owners: Lathithaa + Zoe;
- frontend owners: Sibongiseni + Margaret;
- CODEOWNERS and test-only PR workflows.

Do not create a competing public API inside Makers Lounge. New safety endpoints belong in the FastAPI backend and must update `backend/docs/architecture.md` first.

## Data-source decision

### 1. SAPS — primary factual source

Use SAPS quarterly crime statistics as the canonical crime-count source.

Current SAPS material confirms quarterly crime-statistics publication and a Q1 2026/27 release dated 28 August 2026.

Recommended use:
- ingest station / precinct aggregate counts;
- retain SAPS category names and release period;
- store original source URL and import timestamp;
- never imply precinct counts are exact suburb-level incident data;
- never manufacture point-level incident coordinates from aggregate station totals.

### 2. SafeSuburb — licensed enrichment provider, not a scrape target

References:
- https://safesuburb.co.za/data/
- https://safesuburb.co.za/methodology/
- https://safesuburb.co.za/disclaimer/

SafeSuburb states:
- underlying SAPS figures are public;
- its maintained suburb-to-precinct mapping, cleaned compiled dataset and provenance/confidence grades are the commercial product;
- commercial use in an app or risk model requires a licence;
- its self-serve API is still in development and is not live;
- page-by-page scraping is not the licensed product route.

Integration rule:
- do not scrape SafeSuburb into Travel Safe;
- add a provider interface now;
- if the team obtains a SafeSuburb licence/feed, implement a `SafeSuburbProvider` behind that interface;
- until then, use official SAPS data and our own legally sourced mapping.

Useful methodology lessons:
- distinguish precinct from suburb;
- mark incomplete financial years clearly;
- compare like-for-like quarters;
- avoid per-capita precinct rates where population data is not defensible;
- avoid double-counting aggravated robbery and its component sub-types;
- preserve renamed-station history carefully.

### 3. SafetyBrief — methodology / UX benchmark unless permission is obtained

References:
- https://www.safetybrief.co.za/map
- https://www.safetybrief.co.za/methodology
- https://www.safetybrief.co.za/about

SafetyBrief states that its platform is based on official SAPS quarterly data and publishes a 0–100 safety score / A–F grade methodology.

Its published method estimates station-level population from district population divided across stations. That is useful as a benchmark but is not strong enough for us to silently treat as ground truth.

Integration rule:
- do not copy SafetyBrief's compiled dataset or safety grades into Travel Safe without an API/licence/permission;
- use its public methodology as a comparison point when designing our own explainable score;
- source factual crime counts directly from SAPS where practical;
- if SafetyBrief later offers a licensed feed, add it through the same provider interface.

## FastAPI integration shape

The existing public API remains FastAPI.

Recommended contract additions:

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Existing health check |
| `/api/v1/heatmap` | GET | Map-ready aggregate cells for a bounding box |
| `/api/v1/areas/{area_code}/safety` | GET | Confidence-aware derived area signal |
| `/api/v1/stats` | GET | Official aggregate crime statistics |
| `/api/v1/sources` | GET | Provenance, freshness and source metadata |

Suggested backend package layout:

```text
backend/code/src/
  api/routes/
    heatmap.py
    safety.py
    stats.py
    sources.py
  core/
    config.py
  models/
    safety.py
  services/
    safety_service.py
    heatmap_service.py
  providers/
    base.py
    saps.py
    safesuburb.py        # disabled unless licensed/configured
    safetybrief.py       # disabled unless permission/API exists
  repositories/
    safety_repository.py
```

## Provider boundary

Frontend code must not know whether data came from SAPS, SafeSuburb, SafetyBrief, PocketBase, Supabase, or a local fixture.

Provider interface concept:

```python
class CrimeDataProvider(Protocol):
    async def get_area_stats(self, area_code: str, period: str): ...
    async def get_sources(self): ...
```

The FastAPI service normalises every provider result to one Travel Safe contract.

## PocketBase / persistence

The upstream scaffold currently documents optional Supabase Postgres. Do not replace that architectural choice from Makers Lounge.

If PocketBase is still desired:
- use it as an internal persistence/provider option behind FastAPI;
- do not expose PocketBase collection endpoints directly to the mobile client;
- do not make the frontend depend on PocketBase-specific record shapes;
- agree the persistence choice with the backend owners before merging.

For the hackathon MVP, deterministic fixtures + an official SAPS adapter may be faster and safer than introducing two backend systems.

## Heat-map honesty

Official SAPS crime releases are precinct aggregates. They do not provide the exact location of each reported crime.

Therefore:
- precinct statistics can colour precinct/grid areas;
- point-level heat spots require a separate lawful point-event source;
- do not invent random point coordinates inside a precinct to make the map look more detailed;
- expose data resolution and confidence in every derived response.

## Safety signal

Travel Safe should not copy a third party's label verbatim.

A derived signal should expose:
- score or level;
- confidence;
- period;
- source mix;
- explanation;
- limitations.

When the denominator or mapping is weak, return `insufficient_data` instead of pseudo-precision.

## Immediate team sequence

1. Zoe + Lathithaa update `backend/docs/architecture.md` with the agreed safety endpoints.
2. Backend adds Pydantic response models and deterministic fixtures/tests.
3. Frontend creates typed wrappers against that contract.
4. Backend adds the SAPS ingestion/provider.
5. Seek a SafeSuburb data-licensing conversation if its suburb-to-precinct feed materially improves the demo.
6. Treat SafetyBrief as methodology/UX reference unless a licensed programmatic feed is confirmed.
