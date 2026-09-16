# Skill — API Contract + Mock Data Workflow

## Trigger
Use whenever frontend depends on backend data, an endpoint changes, or integration work could block another teammate.

## Goal
Let frontend and backend move in parallel and connect late without surprises.

## Contract-first protocol
1. Write the request/response shape before implementation.
2. Include method, route, auth requirement, fields, types, example payloads, success response and expected error responses.
3. Store shared contracts under `contracts/` once the product API exists.
4. Frontend builds against fixtures that match the contract exactly.
5. Backend implements and tests against the same contract.
6. Integration replaces the mock transport, not the component model.

## Contract example
```json
{
  "method": "POST",
  "path": "/api/v1/items",
  "request": { "name": "Example" },
  "response": { "id": "item_123", "name": "Example" }
}
```

## Change rule
Breaking a contract requires updating the contract, fixtures, backend tests and affected frontend tests in the same coordinated change or explicitly sequencing the dependent PRs.

## Anti-patterns
Do not build UI around undocumented response guesses. Do not block UI on a real endpoint when a faithful fixture can unblock it. Do not silently rename fields during integration.
