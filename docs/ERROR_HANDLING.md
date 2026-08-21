# Error Handling Architecture

## 1. Centralized Error Envelope

All API errors return a standardized response structure:

```json
{
  "success": false,
  "message": "Human readable error description",
  "code": "ERROR_CODE_STRING",
  "errors": [
    {
      "field": "startDate",
      "message": "Outfit is already booked on this date"
    }
  ]
}
```

## 2. Standard Operational Error Codes

| HTTP Status | Error Code | Description |
| :--- | :--- | :--- |
| `400` | `BAD_REQUEST` | Malformed request or illegal state transition |
| `401` | `UNAUTHORIZED` | Missing, invalid, or expired authentication token |
| `403` | `FORBIDDEN` | Insufficient role permissions or object ownership violation |
| `404` | `NOT_FOUND` | Requested outfit, order, claim, or user not found |
| `409` | `CONFLICT` | Resource collision (e.g. duplicate email, overlapping booking dates) |
| `422` | `VALIDATION_ERROR` | Schema or type validation failure on request payload |
| `429` | `TOO_MANY_REQUESTS` | Rate limit threshold exceeded |
| `500` | `INTERNAL_ERROR` | Unexpected server exception (masked from client in production) |

## 3. Operational Error Hierarchy (`AppError`)
- All anticipated domain exceptions throw subclasses of `AppError` with explicit `statusCode` and `isOperational = true`.
- Uncaught exceptions or programmer bugs are captured by the global error middleware, logged to the structured logger, and converted to a safe generic `500 Internal Server Error` message.
