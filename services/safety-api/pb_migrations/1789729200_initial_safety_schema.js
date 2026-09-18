migrate((app) => {
  const sources = new Collection({
    type: "base",
    name: "data_sources",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: "text", name: "code", required: true, max: 80 },
      { type: "text", name: "name", required: true, max: 180 },
      { type: "select", name: "source_type", required: true, values: ["official", "partner", "community", "synthetic"], maxSelect: 1 },
      { type: "text", name: "authority", max: 180 },
      { type: "url", name: "url" },
      { type: "text", name: "license", max: 240 },
      { type: "text", name: "refresh_cadence", max: 80 },
      { type: "date", name: "last_fetched_at" },
      { type: "number", name: "reliability_weight", min: 0, max: 1 },
      { type: "bool", name: "active" },
      { type: "text", name: "notes", max: 2000 }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_data_sources_code ON data_sources (code)"]
  });
  app.save(sources);

  const areas = new Collection({
    type: "base",
    name: "areas",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: "text", name: "area_code", required: true, max: 100 },
      { type: "text", name: "name", required: true, max: 180 },
      { type: "select", name: "area_type", required: true, values: ["police_station", "municipality", "suburb", "province", "custom_grid"], maxSelect: 1 },
      { type: "text", name: "province", max: 100 },
      { type: "text", name: "parent_code", max: 100 },
      { type: "number", name: "centroid_lat", min: -90, max: 90 },
      { type: "number", name: "centroid_lng", min: -180, max: 180 },
      { type: "number", name: "population", min: 0 },
      { type: "json", name: "geometry" },
      { type: "text", name: "geometry_version", max: 80 }
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_areas_area_code ON areas (area_code)",
      "CREATE INDEX idx_areas_province_type ON areas (province, area_type)"
    ]
  });
  app.save(areas);

  const stats = new Collection({
    type: "base",
    name: "crime_stats",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: "text", name: "source_code", required: true, max: 80 },
      { type: "text", name: "area_code", required: true, max: 100 },
      { type: "date", name: "period_start", required: true },
      { type: "date", name: "period_end", required: true },
      { type: "text", name: "category", required: true, max: 120 },
      { type: "number", name: "count", min: 0 },
      { type: "number", name: "rate_per_100k", min: 0 },
      { type: "number", name: "population_denominator", min: 0 },
      { type: "number", name: "peer_percentile", min: 0, max: 1 },
      { type: "bool", name: "official" },
      { type: "url", name: "source_url" },
      { type: "json", name: "metadata" }
    ],
    indexes: [
      "CREATE INDEX idx_crime_stats_area_period ON crime_stats (area_code, period_end)",
      "CREATE INDEX idx_crime_stats_area_category ON crime_stats (area_code, category)"
    ]
  });
  app.save(stats);

  const incidents = new Collection({
    type: "base",
    name: "incidents",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: "text", name: "source_code", required: true, max: 80 },
      { type: "select", name: "source_type", required: true, values: ["official", "partner", "community", "synthetic"], maxSelect: 1 },
      { type: "text", name: "external_id", max: 140 },
      { type: "date", name: "occurred_at", required: true },
      { type: "date", name: "reported_at" },
      { type: "number", name: "lat", required: true, min: -90, max: 90 },
      { type: "number", name: "lng", required: true, min: -180, max: 180 },
      { type: "text", name: "area_code", max: 100 },
      { type: "text", name: "category", required: true, max: 120 },
      { type: "number", name: "severity", required: true, min: 1, max: 5 },
      { type: "select", name: "status", required: true, values: ["reported", "verified", "disputed", "removed"], maxSelect: 1 },
      { type: "number", name: "confidence", min: 0, max: 1 },
      { type: "text", name: "title", max: 160 },
      { type: "text", name: "description", max: 2000 },
      { type: "json", name: "metadata" }
    ],
    indexes: [
      "CREATE INDEX idx_incidents_bbox_time ON incidents (lat, lng, occurred_at)",
      "CREATE INDEX idx_incidents_area_time ON incidents (area_code, occurred_at)",
      "CREATE UNIQUE INDEX idx_incidents_source_external ON incidents (source_code, external_id) WHERE external_id != ''"
    ]
  });
  app.save(incidents);

  const snapshots = new Collection({
    type: "base",
    name: "area_safety_snapshots",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: "text", name: "area_code", required: true, max: 100 },
      { type: "number", name: "window_days", required: true, min: 7, max: 365 },
      { type: "date", name: "calculated_at", required: true },
      { type: "number", name: "score", min: 0, max: 100 },
      { type: "number", name: "confidence", min: 0, max: 1 },
      { type: "number", name: "official_risk_percentile", min: 0, max: 1 },
      { type: "number", name: "incident_risk_percentile", min: 0, max: 1 },
      { type: "number", name: "trend_index", min: -1, max: 1 },
      { type: "number", name: "sample_size", min: 0 },
      { type: "json", name: "source_mix" },
      { type: "json", name: "explanation" },
      { type: "text", name: "model_version", required: true, max: 40 }
    ],
    indexes: ["CREATE INDEX idx_safety_snapshot_area_window ON area_safety_snapshots (area_code, window_days, calculated_at)"]
  });
  app.save(snapshots);
}, (app) => {
  for (const name of ["area_safety_snapshots", "incidents", "crime_stats", "areas", "data_sources"]) {
    try {
      const collection = app.findCollectionByNameOrId(name);
      app.delete(collection);
    } catch (_) {}
  }
});
