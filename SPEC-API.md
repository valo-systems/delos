# Delos — API Project Spec

## Overview

Split the current monolith into two co-located projects inside the same repo:

```
Delos/
├── ui/       ← Next.js static site (current src/ moved here)
└── api/      ← Node.js Lambda functions + DynamoDB + API Gateway
```

The UI stays on S3 + CloudFront (static export, no server). The API runs on AWS Lambda behind API Gateway and owns all persistence via DynamoDB. Both projects share nothing except the TypeScript types, which are extracted to a `shared/` package.

---

## Repo Structure

```
Delos/
├── ui/
│   ├── src/
│   ├── public/
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── api/
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── orders/
│   │   │   │   ├── create.ts          POST /orders
│   │   │   │   ├── list.ts            GET  /orders
│   │   │   │   ├── get.ts             GET  /orders/{id}
│   │   │   │   └── updateStatus.ts    PATCH /orders/{id}
│   │   │   └── reservations/
│   │   │       ├── create.ts          POST /reservations
│   │   │       ├── list.ts            GET  /reservations
│   │   │       ├── get.ts             GET  /reservations/{id}
│   │   │       └── updateStatus.ts    PATCH /reservations/{id}
│   │   ├── lib/
│   │   │   ├── db.ts                  DynamoDB client + helpers
│   │   │   ├── response.ts            Standard Lambda response builder
│   │   │   ├── validate.ts            Input validation helpers
│   │   │   └── menu.ts                Canonical menu (copied from ui)
│   │   └── middleware/
│   │       └── cors.ts                CORS headers for CloudFront origin
│   ├── template.yaml                  AWS SAM template
│   ├── samconfig.toml                 SAM deploy config
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   └── types.ts                       Single source of truth for Order, Reservation, etc.
│
├── SPEC-API.md                        This file
└── LAUNCH_CHECKLIST.md
```

---

## Technology Choices

| Concern | Choice | Reason |
|---------|--------|--------|
| Runtime | Node.js 22 on Lambda | Matches existing TypeScript codebase |
| Framework | Raw Lambda handlers (no Express) | Minimal cold-start, no extra deps |
| IaC | AWS SAM | Native AWS, YAML config, free, great local dev via `sam local` |
| Database | DynamoDB | Permanent free tier, serverless, no connection management |
| Auth (admin) | API key via API Gateway | Simple, no user management needed for demo |
| CORS | Lambda response headers | Allows CloudFront domain to call the API |

---

## DynamoDB Schema

### Table: `delos-orders`

| Attribute | Type | Role |
|-----------|------|------|
| `id` | String | Partition key (`ORD-XXXXX`) |
| `status` | String | `received` \| `accepted` \| `preparing` \| `ready` \| `out_for_delivery` \| `completed` \| `cancelled` |
| `customerName` | String | |
| `phone` | String | |
| `email` | String | Optional |
| `fulfilmentType` | String | `collection` \| `delivery` |
| `deliveryAddress` | String | Optional, required if delivery |
| `items` | List | `[{ menuItemId, name, price, quantity }]` |
| `orderNotes` | String | Optional |
| `subtotal` | Number | In ZAR cents (avoids float rounding) |
| `serviceFee` | Number | In ZAR cents |
| `deliveryFee` | Number | In ZAR cents |
| `total` | Number | In ZAR cents |
| `createdAt` | String | ISO 8601 |
| `updatedAt` | String | ISO 8601 |

**GSI: `status-createdAt-index`**
- Partition key: `status`
- Sort key: `createdAt`
- Use: admin dashboard filtered by status, today's orders

---

### Table: `delos-reservations`

| Attribute | Type | Role |
|-----------|------|------|
| `id` | String | Partition key (`RES-XXXXX`) |
| `status` | String | `pending` \| `accepted` \| `declined` \| `contacted` |
| `name` | String | |
| `phone` | String | |
| `date` | String | `YYYY-MM-DD` |
| `time` | String | `HH:MM` |
| `guestCount` | Number | 1–50 |
| `occasion` | String | Optional |
| `notes` | String | Optional |
| `createdAt` | String | ISO 8601 |

**GSI: `date-time-index`**
- Partition key: `date`
- Sort key: `time`
- Use: list reservations by date, conflict detection

---

## API Endpoints

Base URL: `https://{api-id}.execute-api.{region}.amazonaws.com/prod`

The UI stores this as `NEXT_PUBLIC_API_URL` in its `.env.production`.

---

### Orders

#### `POST /orders`
Create a new order.

**Auth:** None (public — customer-facing)

**Request body:**
```json
{
  "customerName": "Jane Dlamini",
  "phone": "082 000 0000",
  "email": "jane@example.com",
  "fulfilmentType": "delivery",
  "deliveryAddress": "12 Smith St, Morningside",
  "items": [
    { "menuItemId": "oxtail-stew", "quantity": 2 },
    { "menuItemId": "pap-and-chakalaka", "quantity": 1 }
  ],
  "orderNotes": "Extra spicy please"
}
```

**Validations:**
- `customerName`, `phone`, `fulfilmentType`, `items` — required
- `deliveryAddress` — required if `fulfilmentType === "delivery"`
- Each `menuItemId` must exist in canonical menu (server re-validates prices)
- Each quantity: integer 1–50
- Subtotal must be >= R80 (min order)
- Prices stored in cents (multiply rand × 100)

**Pricing logic (server-side only, never trust client):**
- `subtotal` = sum of (menu price × qty) for each item
- `serviceFee` = floor(subtotal × 0.05)
- `deliveryFee` = fulfilment is delivery ? (subtotal >= 50000 ? 0 : 3500) : 0
- `total` = subtotal + serviceFee + deliveryFee

**Response `201`:**
```json
{
  "order": { ...Order }
}
```

**Error responses:**
- `400` — validation failure, body: `{ "error": "message" }`
- `500` — DynamoDB write failure

---

#### `GET /orders`
List all orders, newest first.

**Auth:** API key required (admin only)

**Query params:**
- `status` (optional) — filter by status
- `date` (optional) — filter by `createdAt` date prefix `YYYY-MM-DD`

**Response `200`:**
```json
{
  "orders": [ ...Order[] ]
}
```

---

#### `GET /orders/{id}`
Fetch a single order.

**Auth:** None (customers use this to check their order after creation — the ID is unguessable)

**Response `200`:** `{ "order": Order }`
**Response `404`:** `{ "error": "Order not found" }`

---

#### `PATCH /orders/{id}`
Update order status.

**Auth:** API key required (admin only)

**Request body:**
```json
{ "status": "accepted" }
```

**Allowed transitions:**

| Current | May transition to |
|---------|------------------|
| received | accepted, cancelled |
| accepted | preparing, cancelled |
| preparing | ready, out_for_delivery, cancelled |
| ready | completed, cancelled |
| out_for_delivery | completed, cancelled |
| completed | — |
| cancelled | — |

**Response `200`:** `{ "order": Order }`
**Response `400`:** invalid status or invalid transition
**Response `404`:** order not found

---

### Reservations

#### `POST /reservations`
Create a new reservation.

**Auth:** None (public — customer-facing)

**Request body:**
```json
{
  "name": "Sipho Ndlovu",
  "phone": "083 000 0000",
  "date": "2026-05-15",
  "time": "19:00",
  "guestCount": 4,
  "occasion": "Birthday",
  "notes": "Window seat preferred"
}
```

**Validations:**
- `name`, `phone`, `date`, `time`, `guestCount` — required
- `date` — must be today or later (compare YYYY-MM-DD strings)
- `guestCount` — integer 1–50
- `time` — must match `HH:MM` format

**Response `201`:**
```json
{
  "reservation": { ...Reservation }
}
```

---

#### `GET /reservations`
List reservations.

**Auth:** API key required (admin only)

**Query params:**
- `date` (optional) — filter by specific date `YYYY-MM-DD`

**Response `200`:**
```json
{
  "reservations": [ ...Reservation[] ]
}
```
Sorted by date ascending, then time ascending.

---

#### `GET /reservations/{id}`
Fetch a single reservation.

**Auth:** None (same reasoning as orders — ID is unguessable)

**Response `200`:** `{ "reservation": Reservation }`
**Response `404`:** `{ "error": "Reservation not found" }`

---

#### `PATCH /reservations/{id}`
Update reservation status.

**Auth:** API key required (admin only)

**Request body:**
```json
{ "status": "accepted" }
```

**Allowed statuses:** `pending`, `accepted`, `declined`, `contacted`
(no enforced transition graph — admin can set any status freely)

**Response `200`:** `{ "reservation": Reservation }`
**Response `400`:** invalid status
**Response `404`:** reservation not found

---

## SAM Template (`api/template.yaml`) — Structure

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs22.x
    Timeout: 10
    MemorySize: 256
    Environment:
      Variables:
        ORDERS_TABLE: !Ref OrdersTable
        RESERVATIONS_TABLE: !ReservationsTable
        ALLOWED_ORIGIN: https://www.deloslounge.co.za

Resources:
  # --- DynamoDB Tables ---
  OrdersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: delos-orders
      BillingMode: PAY_PER_REQUEST     # on-demand = free tier friendly
      AttributeDefinitions:
        - { AttributeName: id, AttributeType: S }
        - { AttributeName: status, AttributeType: S }
        - { AttributeName: createdAt, AttributeType: S }
      KeySchema:
        - { AttributeName: id, KeyType: HASH }
      GlobalSecondaryIndexes:
        - IndexName: status-createdAt-index
          KeySchema:
            - { AttributeName: status, KeyType: HASH }
            - { AttributeName: createdAt, KeyType: RANGE }
          Projection: { ProjectionType: ALL }

  ReservationsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: delos-reservations
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - { AttributeName: id, AttributeType: S }
        - { AttributeName: date, AttributeType: S }
        - { AttributeName: time, AttributeType: S }
      KeySchema:
        - { AttributeName: id, KeyType: HASH }
      GlobalSecondaryIndexes:
        - IndexName: date-time-index
          KeySchema:
            - { AttributeName: date, KeyType: HASH }
            - { AttributeName: time, KeyType: RANGE }
          Projection: { ProjectionType: ALL }

  # --- API Gateway ---
  DelosApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Auth:
        ApiKeyRequired: false          # set per-route; public routes have no key
        UsagePlan:
          CreateUsagePlan: PER_API
          UsagePlanName: delos-admin-plan

  # --- Lambda Functions ---
  CreateOrderFunction: ...
  ListOrdersFunction: ...
  GetOrderFunction: ...
  UpdateOrderStatusFunction: ...
  CreateReservationFunction: ...
  ListReservationsFunction: ...
  GetReservationFunction: ...
  UpdateReservationStatusFunction: ...
```

---

## CORS Strategy

All Lambda handlers return these headers on every response:

```
Access-Control-Allow-Origin: https://www.deloslounge.co.za
Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, x-api-key
```

API Gateway handles `OPTIONS` preflight automatically via SAM's `Cors` property on the API resource.

During local dev, `ALLOWED_ORIGIN=*` is set in `env.json` for `sam local`.

---

## Admin Authentication

API Gateway API key passed as `x-api-key` header on all admin requests.

The UI stores the key in `.env.local` (never committed):
```
NEXT_PUBLIC_API_URL=https://...execute-api.af-south-1.amazonaws.com/prod
NEXT_PUBLIC_API_KEY=your-api-gateway-key
```

Admin pages attach the header on every fetch:
```typescript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
  headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY }
})
```

**Note:** This is demo-grade auth. The key is visible in the browser. For production, admin pages should be behind Cognito or a server-side session.

---

## Shared Types (`shared/types.ts`)

Extracted from the current `ui/src/lib/types.ts`. Both `ui` and `api` import from here via a relative path or workspace alias.

```typescript
export type OrderStatus =
  | "received" | "accepted" | "preparing" | "ready"
  | "out_for_delivery" | "completed" | "cancelled";

export type FulfilmentType = "collection" | "delivery";

export type ReservationStatus = "pending" | "accepted" | "declined" | "contacted";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;   // ZAR cents
  quantity: number;
}

export interface Order {
  id: string;                      // ORD-XXXXX
  customerName: string;
  phone: string;
  email?: string;
  fulfilmentType: FulfilmentType;
  deliveryAddress?: string;
  items: CartItem[];
  orderNotes?: string;
  status: OrderStatus;
  subtotal: number;                // ZAR cents
  serviceFee: number;              // ZAR cents
  deliveryFee: number;             // ZAR cents
  total: number;                   // ZAR cents
  createdAt: string;               // ISO 8601
  updatedAt: string;               // ISO 8601
}

export interface Reservation {
  id: string;                      // RES-XXXXX
  name: string;
  phone: string;
  date: string;                    // YYYY-MM-DD
  time: string;                    // HH:MM
  guestCount: number;
  occasion?: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;               // ISO 8601
}
```

**Breaking change from current:** Prices change from rands (float) to cents (integer). The UI's `formatPrice()` utility needs to divide by 100 before formatting.

---

## UI Changes Required

### 1. Remove static-export workarounds
- Remove `output: "export"` from `next.config.ts` — no longer needed if deploying UI via Vercel, or keep it if staying on S3
- Remove `force-static` workarounds on API route files (the route files will be deleted entirely)
- Delete `src/app/api/` — the API now lives in the separate `api/` project
- Delete `src/app/order/[id]/` — replace with a simple polling page that calls `GET /orders/{id}`
- Delete `src/lib/store.ts` — no longer needed

### 2. Add environment variable
```
NEXT_PUBLIC_API_URL=https://...execute-api.af-south-1.amazonaws.com/prod
NEXT_PUBLIC_API_KEY=...    (admin pages only — consider moving admin to a separate Next.js app)
```

### 3. Update all fetch calls
Replace relative `/api/orders` with `${process.env.NEXT_PUBLIC_API_URL}/orders`.

### 4. Update price display
All prices returned from DynamoDB are in cents. Update `formatPrice(cents)` to divide by 100 first.

### 5. Re-enable order confirmation page
`/order/[id]` can now be a real page that calls `GET /orders/{id}` and polls for status updates. Remove the `[id]` directory exclusion from the build workaround.

### 6. Private functions enquiry form
Currently non-functional. Wire it up to a new `POST /enquiries` endpoint (or redirect to email/WhatsApp — out of scope for this phase).

---

## Local Development Workflow

```bash
# Terminal 1 — start DynamoDB locally
docker run -p 8000:8000 amazon/dynamodb-local

# Terminal 2 — start Lambda functions locally
cd api
sam build && sam local start-api --env-vars env.json

# Terminal 3 — start Next.js UI
cd ui
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev
```

`api/env.json` (not committed):
```json
{
  "Parameters": {
    "ORDERS_TABLE": "delos-orders",
    "RESERVATIONS_TABLE": "delos-reservations",
    "DYNAMODB_ENDPOINT": "http://localhost:8000",
    "ALLOWED_ORIGIN": "*"
  }
}
```

---

## Deployment

### API
```bash
cd api
sam build
sam deploy --guided   # first time — creates samconfig.toml
sam deploy            # subsequent deploys
```

SAM outputs the API Gateway URL. Copy it into `ui/.env.production`.

### UI
```bash
cd ui
npm run build                  # generates out/
aws s3 sync out/ s3://delos-lounge-website/ --region af-south-1 --delete
aws cloudfront create-invalidation --distribution-id E2LH36Y7GBUMP7 --paths "/*"
```

---

## AWS Costs (demo/free tier estimate)

| Service | Free tier | Expected demo usage |
|---------|-----------|---------------------|
| DynamoDB | 25 GB storage, 200M requests/month | < 1 MB, < 1K requests/month |
| Lambda | 1M requests + 400K GB-seconds/month | < 1K invocations/month |
| API Gateway | 1M calls/month (12-month free) | < 1K calls/month |
| S3 | 5 GB, 20K GET/2K PUT | Negligible |
| CloudFront | 1 TB transfer, 10M requests/month | Negligible |

**Expected monthly cost: $0** within free tier limits.

---

## Open Questions Before Implementation

1. **Monorepo tooling** — Use npm workspaces or keep `ui/` and `api/` as fully independent `package.json` projects with no workspace link?
2. **AWS region** — Deploy API to `af-south-1` (same as S3 bucket) for lowest latency, or `us-east-1` (Lambda is cheaper there)?
3. **Admin auth** — Keep API key for demo, or add Cognito/basic auth before sharing the admin URL with the Delos team?
4. **Cents vs rands** — Confirm the price unit change. All existing menu prices in `menu.ts` are in rands (e.g. `price: 180`). DynamoDB will store cents (18000). The API converts on write.
5. **WhatsApp order flow** — Keep the current WhatsApp-first flow on the order page, OR restore the full API-backed checkout now that the API exists?
6. **Private functions enquiry** — In scope for this phase or later?
