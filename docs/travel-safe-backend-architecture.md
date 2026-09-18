# Travel Safe — South Africa Safety Intelligence Backend

## Product objective

Feed the Travel Safe web and mobile experience with map-ready safety intelligence while preserving a strict distinction between:

1. official aggregate statistics;
2. verified partner or event feeds;
3. community reports;
4. derived model outputs.

The backend should help a traveller understand relative risk signals, recency, evidence and uncertainty. It must not present a score as a guarantee that an area is safe.

## v1 architecture

    SAPS or public official stats ----+
    partner feeds --------------------+--> ingestion + normalisation
    community reports ----------------+             |
                                                    v
                                             PocketBase / SQLite
                                             - data_sources
                                             - areas
                                             - crime_stats
                                             - incidents
                                             - safety snapshots
                                                    |
                                                    v
                                         custom PocketBase API routes
                                                    |
                                 +------------------+------------------+
                                 v                                     v
                            web heat map                         mobile or web UI

Deployment target: one Fly.io Machine in Johannesburg with a persistent Fly Volume mounted at /pb/pb_data.

## Why PocketBase first

PocketBase gives the hackathon team a small operational surface: embedded SQLite, admin UI, auth, migration files, collection APIs and custom JavaScript routes. That makes it fast to ship while retaining a clean escape path to a larger analytical datastore later.

## API contract

The frontend integrates only against contracts/safety-api.openapi.yaml.

Primary routes:

- GET /api/travel-safe/v1/incidents
- GET /api/travel-safe/v1/heatmap
- GET /api/travel-safe/v1/areas/{areaCode}/safety
- GET /api/travel-safe/v1/stats
- GET /api/travel-safe/v1/sources

## Safety scoring model

Scores are stored as versioned area_safety_snapshots rather than calculated from arbitrary thresholds in a map request.

Recommended v1 model:

    relative_risk =
      0.65 * official_risk_percentile
    + 0.20 * verified_recent_incident_percentile
    + 0.10 * trend_component
    + 0.05 * validated_context_component

    safety_score = 100 * (1 - clamp(relative_risk, 0, 1))

Important constraints:

- Compare areas only against a defensible peer group and period.
- Official station or area rates should dominate the score.
- Community reports should be a weak supporting signal because reporting propensity is uneven.
- Missing denominators, stale periods, low sample sizes or conflicting sources reduce confidence.
- If confidence is below the product threshold, return insufficient_data rather than a pseudo-precise number.
- The UI should show score, confidence, data period and a short evidence explanation together.

## Heat-map model

Heat maps are not the same thing as area safety scores.

The v1 heat endpoint:

- filters by bounding box and time window;
- excludes synthetic data by default;
- uses verified records by default;
- weights severity, source type, record confidence and recency;
- aggregates to a zoom-aware grid;
- normalizes relativeIntensity inside the current viewport.

This makes the heat map useful for visual discovery without pretending its color scale is a national absolute crime rate.

## Privacy

Public incident endpoints reduce coordinate precision to approximately 100m scale. Exact addresses, victim identity and sensitive narrative should never be sent to the public client.

For school or minor-related safety data, use stronger aggregation and never expose person-level records.

## South African data sources

### SAPS crime statistics

SAPS publishes national crime statistics and quarterly or annual releases. Store each imported figure with period, category, source URL and source code so the frontend can show provenance.

### SAPS police-station boundaries

Treat SAPS boundary geometry as a separately licensed layer. Current SAPS download terms state that the spatial information remains State copyright and may not be made available to another person or entity without express SAPS permission. Do not commit or redistribute those shapefiles in this repository until permission or licensing is confirmed.

The v1 map therefore works with point or grid heat layers and optional geometry from a source whose redistribution terms are compatible with the product.

## Scaling path

PocketBase and SQLite are appropriate for the initial product, but Fly Volumes are attached to individual Machines. Keep one writable PocketBase instance in v1.

When data size or query load requires it:

1. keep PocketBase for users, admin and workflow if useful;
2. move analytical incident and stat tables to a datastore with stronger geospatial indexing support;
3. preserve the public API contract so the frontend does not need a rewrite.

## Definition of done for the backend milestone

- contract committed;
- PocketBase schema migration committed;
- map, stats, safety and source routes committed;
- synthetic contract fixture committed;
- Fly deployment template committed;
- production source and licensing rules documented;
- Maker Lounge dashboard points to the active Travel Safe build;
- PR includes smoke-test instructions and known limitations.
