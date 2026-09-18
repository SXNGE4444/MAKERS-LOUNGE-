/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/travel-safe/v1/health", (e) => {
  return e.json(200, {
    status: "ok",
    service: "travel-safe-safety-api",
    version: "0.1.0"
  });
});

routerAdd("GET", "/api/travel-safe/v1/incidents", (e) => {
  const q = e.request.url.query();
  const rawBbox = q.get("bbox");
  if (!rawBbox) {
    throw e.badRequestError("bbox is required as west,south,east,north");
  }

  const bbox = rawBbox.split(",").map((value) => Number(value.trim()));
  if (
    bbox.length !== 4 ||
    bbox.some((value) => !Number.isFinite(value)) ||
    bbox[0] >= bbox[2] ||
    bbox[1] >= bbox[3] ||
    bbox[0] < -180 ||
    bbox[2] > 180 ||
    bbox[1] < -90 ||
    bbox[3] > 90
  ) {
    throw e.badRequestError("bbox must be valid WGS84 west,south,east,north coordinates");
  }

  const hoursRaw = Number(q.get("hours") || "720");
  const hours = Math.max(1, Math.min(8760, Number.isFinite(hoursRaw) ? Math.floor(hoursRaw) : 720));
  const limitRaw = Number(q.get("limit") || "250");
  const limit = Math.max(1, Math.min(500, Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 250));
  const includeUnverified = q.get("includeUnverified") === "true";
  const includeSynthetic = q.get("includeSynthetic") === "true";
  const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const rows = arrayOf(new DynamicModel({
    id: "",
    sourceCode: "",
    sourceType: "",
    occurredAt: "",
    lat: -0,
    lng: -0,
    areaCode: "",
    category: "",
    severity: 0,
    status: "",
    confidence: -0,
    title: ""
  }));

  const statusClause = includeUnverified ? "status != 'removed'" : "status = 'verified'";
  const syntheticClause = includeSynthetic ? "1 = 1" : "source_type != 'synthetic'";
  const sql = [
    "SELECT",
    "  id,",
    "  source_code AS sourceCode,",
    "  source_type AS sourceType,",
    "  occurred_at AS occurredAt,",
    "  lat,",
    "  lng,",
    "  area_code AS areaCode,",
    "  category,",
    "  severity,",
    "  status,",
    "  confidence,",
    "  title",
    "FROM incidents",
    "WHERE lng >= {:west}",
    "  AND lng <= {:east}",
    "  AND lat >= {:south}",
    "  AND lat <= {:north}",
    "  AND occurred_at >= {:from}",
    "  AND " + statusClause,
    "  AND " + syntheticClause,
    "ORDER BY occurred_at DESC",
    "LIMIT {:limit}"
  ].join("\n");

  e.app.db().newQuery(sql).bind({
    west: bbox[0],
    south: bbox[1],
    east: bbox[2],
    north: bbox[3],
    from,
    limit
  }).all(rows);

  const items = rows.map((row) => ({
    id: row.id,
    sourceCode: row.sourceCode,
    sourceType: row.sourceType,
    occurredAt: row.occurredAt,
    lat: Math.round(row.lat * 1000) / 1000,
    lng: Math.round(row.lng * 1000) / 1000,
    areaCode: row.areaCode,
    category: row.category,
    severity: row.severity,
    status: row.status,
    confidence: row.confidence,
    title: row.title,
    locationPrecisionM: 120
  }));

  return e.json(200, {
    items,
    meta: {
      generatedAt: new Date().toISOString(),
      count: items.length,
      bbox,
      windowHours: hours,
      privacy: "Public incident coordinates are rounded to approximately 100m scale."
    }
  });
});

routerAdd("GET", "/api/travel-safe/v1/heatmap", (e) => {
  const q = e.request.url.query();
  const rawBbox = q.get("bbox");
  if (!rawBbox) {
    throw e.badRequestError("bbox is required as west,south,east,north");
  }

  const bbox = rawBbox.split(",").map((value) => Number(value.trim()));
  if (
    bbox.length !== 4 ||
    bbox.some((value) => !Number.isFinite(value)) ||
    bbox[0] >= bbox[2] ||
    bbox[1] >= bbox[3] ||
    bbox[0] < -180 ||
    bbox[2] > 180 ||
    bbox[1] < -90 ||
    bbox[3] > 90
  ) {
    throw e.badRequestError("bbox must be valid WGS84 west,south,east,north coordinates");
  }

  const hoursRaw = Number(q.get("hours") || "720");
  const hours = Math.max(1, Math.min(8760, Number.isFinite(hoursRaw) ? Math.floor(hoursRaw) : 720));
  const zoomRaw = Number(q.get("zoom") || "11");
  const zoom = Math.max(5, Math.min(18, Number.isFinite(zoomRaw) ? Math.floor(zoomRaw) : 11));
  const includeUnverified = q.get("includeUnverified") === "true";
  const includeSynthetic = q.get("includeSynthetic") === "true";
  const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  let grid = 0.02;
  if (zoom >= 14) grid = 0.0025;
  else if (zoom >= 12) grid = 0.005;
  else if (zoom >= 10) grid = 0.01;

  const rows = arrayOf(new DynamicModel({
    lat: -0,
    lng: -0,
    severity: 0,
    confidence: -0,
    sourceType: "",
    occurredAt: ""
  }));

  const statusClause = includeUnverified ? "status != 'removed'" : "status = 'verified'";
  const syntheticClause = includeSynthetic ? "1 = 1" : "source_type != 'synthetic'";
  const sql = [
    "SELECT",
    "  lat,",
    "  lng,",
    "  severity,",
    "  confidence,",
    "  source_type AS sourceType,",
    "  occurred_at AS occurredAt",
    "FROM incidents",
    "WHERE lng >= {:west}",
    "  AND lng <= {:east}",
    "  AND lat >= {:south}",
    "  AND lat <= {:north}",
    "  AND occurred_at >= {:from}",
    "  AND " + statusClause,
    "  AND " + syntheticClause,
    "ORDER BY occurred_at DESC",
    "LIMIT 5000"
  ].join("\n");

  e.app.db().newQuery(sql).bind({
    west: bbox[0],
    south: bbox[1],
    east: bbox[2],
    north: bbox[3],
    from
  }).all(rows);

  const cellsByKey = {};
  for (const row of rows) {
    const x = Math.floor((row.lng - bbox[0]) / grid);
    const y = Math.floor((row.lat - bbox[1]) / grid);
    const key = x + ":" + y;
    const sourceWeight =
      row.sourceType === "official" ? 1 :
      row.sourceType === "partner" ? 0.85 :
      row.sourceType === "community" ? 0.35 : 0;

    const occurred = new Date(row.occurredAt).getTime();
    const ageDays = Math.max(0, (Date.now() - occurred) / 86400000);
    const recencyWeight = Math.pow(0.5, ageDays / 14);
    const severityWeight = Math.max(1, Math.min(5, row.severity)) / 5;
    const confidence = Math.max(0, Math.min(1, row.confidence || 0));
    const risk = severityWeight * confidence * sourceWeight * recencyWeight;

    if (!cellsByKey[key]) {
      cellsByKey[key] = {
        lat: bbox[1] + (y + 0.5) * grid,
        lng: bbox[0] + (x + 0.5) * grid,
        count: 0,
        weightedRisk: 0,
        confidenceSum: 0,
        sourceMix: {}
      };
    }

    const cell = cellsByKey[key];
    cell.count += 1;
    cell.weightedRisk += risk;
    cell.confidenceSum += confidence;
    cell.sourceMix[row.sourceType] = (cell.sourceMix[row.sourceType] || 0) + 1;
  }

  const cells = Object.keys(cellsByKey).map((key) => cellsByKey[key]);
  let maxRisk = 0;
  for (const cell of cells) {
    if (cell.weightedRisk > maxRisk) maxRisk = cell.weightedRisk;
  }

  const result = cells.map((cell) => ({
    lat: Math.round(cell.lat * 1000000) / 1000000,
    lng: Math.round(cell.lng * 1000000) / 1000000,
    count: cell.count,
    weightedRisk: Math.round(cell.weightedRisk * 10000) / 10000,
    relativeIntensity: maxRisk > 0 ? Math.round((cell.weightedRisk / maxRisk) * 10000) / 10000 : 0,
    confidence: cell.count > 0 ? Math.round((cell.confidenceSum / cell.count) * 10000) / 10000 : 0,
    sourceMix: cell.sourceMix
  })).sort((a, b) => b.weightedRisk - a.weightedRisk);

  return e.json(200, {
    cells: result,
    meta: {
      generatedAt: new Date().toISOString(),
      count: result.length,
      eventCount: rows.length,
      bbox,
      windowHours: hours,
      zoom,
      gridDegrees: grid,
      relativeScale: true,
      note: "relativeIntensity is normalized inside this viewport; it is not an absolute national crime-risk score."
    }
  });
});

routerAdd("GET", "/api/travel-safe/v1/areas/{areaCode}/safety", (e) => {
  const areaCode = e.request.pathValue("areaCode");
  const q = e.request.url.query();
  const windowRaw = Number(q.get("windowDays") || "90");
  const windowDays = Math.max(7, Math.min(365, Number.isFinite(windowRaw) ? Math.floor(windowRaw) : 90));

  const areaRows = arrayOf(new DynamicModel({
    areaCode: "",
    areaName: "",
    province: ""
  }));

  e.app.db().newQuery([
    "SELECT area_code AS areaCode, name AS areaName, province",
    "FROM areas",
    "WHERE area_code = {:areaCode}",
    "LIMIT 1"
  ].join("\n")).bind({ areaCode }).all(areaRows);

  const area = areaRows.length ? areaRows[0] : null;

  const snapshots = arrayOf(new DynamicModel({
    calculatedAt: "",
    score: -0,
    confidence: -0,
    officialRiskPercentile: -0,
    incidentRiskPercentile: -0,
    trendIndex: -0,
    sampleSize: 0,
    sourceMix: {},
    explanation: {},
    modelVersion: ""
  }));

  e.app.db().newQuery([
    "SELECT",
    "  calculated_at AS calculatedAt,",
    "  score,",
    "  confidence,",
    "  official_risk_percentile AS officialRiskPercentile,",
    "  incident_risk_percentile AS incidentRiskPercentile,",
    "  trend_index AS trendIndex,",
    "  sample_size AS sampleSize,",
    "  source_mix AS sourceMix,",
    "  explanation,",
    "  model_version AS modelVersion",
    "FROM area_safety_snapshots",
    "WHERE area_code = {:areaCode}",
    "  AND window_days = {:windowDays}",
    "ORDER BY calculated_at DESC",
    "LIMIT 1"
  ].join("\n")).bind({ areaCode, windowDays }).all(snapshots);

  const disclaimer = "This is a comparative planning signal based on available data, not a guarantee of personal safety or future crime.";

  if (!snapshots.length) {
    return e.json(200, {
      areaCode,
      areaName: area ? area.areaName : "",
      province: area ? area.province : "",
      windowDays,
      status: "insufficient_data",
      score: null,
      confidence: 0,
      calculatedAt: null,
      modelVersion: null,
      components: {
        officialRiskPercentile: null,
        incidentRiskPercentile: null,
        trendIndex: null
      },
      sourceMix: {},
      explanation: {
        reason: "No validated safety snapshot exists for this area/window yet."
      },
      disclaimer
    });
  }

  const snapshot = snapshots[0];
  return e.json(200, {
    areaCode,
    areaName: area ? area.areaName : "",
    province: area ? area.province : "",
    windowDays,
    status: "ready",
    score: snapshot.score,
    confidence: snapshot.confidence,
    calculatedAt: snapshot.calculatedAt,
    modelVersion: snapshot.modelVersion,
    components: {
      officialRiskPercentile: snapshot.officialRiskPercentile,
      incidentRiskPercentile: snapshot.incidentRiskPercentile,
      trendIndex: snapshot.trendIndex
    },
    sampleSize: snapshot.sampleSize,
    sourceMix: snapshot.sourceMix,
    explanation: snapshot.explanation,
    disclaimer
  });
});

routerAdd("GET", "/api/travel-safe/v1/stats", (e) => {
  const q = e.request.url.query();
  const areaCode = q.get("areaCode");
  if (!areaCode) {
    throw e.badRequestError("areaCode is required");
  }

  const from = q.get("from") || "1900-01-01T00:00:00.000Z";
  const to = q.get("to") || "2999-12-31T23:59:59.999Z";

  const rows = arrayOf(new DynamicModel({
    sourceCode: "",
    areaCode: "",
    periodStart: "",
    periodEnd: "",
    category: "",
    count: -0,
    ratePer100k: -0,
    populationDenominator: -0,
    peerPercentile: -0,
    official: false,
    sourceUrl: ""
  }));

  e.app.db().newQuery([
    "SELECT",
    "  source_code AS sourceCode,",
    "  area_code AS areaCode,",
    "  period_start AS periodStart,",
    "  period_end AS periodEnd,",
    "  category,",
    "  count,",
    "  rate_per_100k AS ratePer100k,",
    "  population_denominator AS populationDenominator,",
    "  peer_percentile AS peerPercentile,",
    "  official,",
    "  source_url AS sourceUrl",
    "FROM crime_stats",
    "WHERE area_code = {:areaCode}",
    "  AND period_end >= {:from}",
    "  AND period_start <= {:to}",
    "ORDER BY period_end DESC, category ASC",
    "LIMIT 500"
  ].join("\n")).bind({ areaCode, from, to }).all(rows);

  return e.json(200, {
    items: rows.map((row) => ({
      sourceCode: row.sourceCode,
      areaCode: row.areaCode,
      periodStart: row.periodStart,
      periodEnd: row.periodEnd,
      category: row.category,
      count: row.count,
      ratePer100k: row.ratePer100k,
      populationDenominator: row.populationDenominator,
      peerPercentile: row.peerPercentile,
      official: row.official,
      sourceUrl: row.sourceUrl
    })),
    meta: {
      generatedAt: new Date().toISOString(),
      count: rows.length,
      areaCode,
      from,
      to
    }
  });
});

routerAdd("GET", "/api/travel-safe/v1/sources", (e) => {
  const rows = arrayOf(new DynamicModel({
    code: "",
    name: "",
    sourceType: "",
    authority: "",
    url: "",
    license: "",
    refreshCadence: "",
    lastFetchedAt: "",
    reliabilityWeight: -0,
    active: false
  }));

  e.app.db().newQuery([
    "SELECT",
    "  code,",
    "  name,",
    "  source_type AS sourceType,",
    "  authority,",
    "  url,",
    "  license,",
    "  refresh_cadence AS refreshCadence,",
    "  last_fetched_at AS lastFetchedAt,",
    "  reliability_weight AS reliabilityWeight,",
    "  active",
    "FROM data_sources",
    "WHERE active = TRUE",
    "ORDER BY source_type ASC, name ASC"
  ].join("\n")).all(rows);

  return e.json(200, {
    items: rows.map((row) => ({
      code: row.code,
      name: row.name,
      sourceType: row.sourceType,
      authority: row.authority,
      url: row.url,
      license: row.license,
      refreshCadence: row.refreshCadence,
      lastFetchedAt: row.lastFetchedAt || null,
      reliabilityWeight: row.reliabilityWeight,
      active: row.active
    }))
  });
});
