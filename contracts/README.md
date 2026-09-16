# Shared API Contracts

This folder becomes the handshake between frontend and backend once the hackathon challenge is known.

## Rule
Write the contract before either side depends on implementation details. Frontend fixtures and backend tests should represent the same documented shape.

## Suggested structure

```text
contracts/
  openapi.yaml           # use when an OpenAPI spec adds value
  examples/
    create-item.request.json
    create-item.response.json
  fixtures/
    items.json
```

## Minimum contract record

```md
### POST /api/v1/items
Auth: none | bearer | session

Request
```json
{ "name": "Example" }
```

200 response
```json
{ "id": "item_123", "name": "Example" }
```

Errors
- 400 — invalid input
- 401 — unauthenticated
- 500 — unexpected server error
```

If the contract changes, update fixtures/tests and explicitly notify the consuming owner in the PR.
