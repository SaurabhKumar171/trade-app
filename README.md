# 📊 Orderbook App (NestJS + React + Vite + TS)

This project implements a simple **orderbook and trade matching system** with a **NestJS backend**, **React (Vite + TypeScript) frontend**, and **PostgreSQL database**.

It supports **placing buy/sell orders, previewing matches, executing trades, and viewing orderbooks/trade history**.

---

## 🚀 Run Locally (Without Docker)

### 1. Backend (NestJS)

```bash
# clone repo & go to backend folder
cd backend

# install dependencies
npm install

# install dependencies (Refer env_example to create .env file)
touch .env

# start dev server
npm run start:dev
```

Backend runs at: `http://localhost:3000`

---

### 2. Frontend (React + Vite + TS)

```bash
cd frontend

# install dependencies
npm install

# install dependencies (Refer env_example to create .env file)
touch .env

# run dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

👉 You can configure backend URL by editing `.env` in frontend:

```env
VITE_API_BASE=http://localhost:3000
```

---

## 🐳 Run with Docker

This project includes a `docker-compose.yml` that runs:

- **Backend** (NestJS, port `3000`)  
- **Frontend** (React + Vite build served via Nginx, port `5173`)  
- **Database** (PostgreSQL, port `5432`)  

### 1. Build & Start

```bash
docker-compose up --build
```

### 2. Access

- **Frontend (React UI):** [http://localhost:5173](http://localhost:5173)  
- **Backend (NestJS APIs):** [http://localhost:3000](http://localhost:3000)  
- **Database (Postgres):** `localhost:5432`  

Default DB credentials (from `docker-compose.yml`):  
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tradeAppDB
```

### 3. Running in Background

```bash
docker-compose up -d
```

### 4. Stopping Services

```bash
docker-compose down
```

### 5. Check Logs

```bash
docker logs orderbook-backend
docker logs orderbook-frontend
docker logs orderbook-db
```

⚠️ On first startup, run DB migrations inside backend container:

```bash
docker exec -it orderbook-backend npm run typeorm migration:run
```

---

## 📡 API Documentation

### 1. **Preview Trade**

**Endpoint:** `POST /order/preview`

**Body:**
```json
{
  "user_id": 1,
  "price": 100,
  "quantity": 10
}
```

**Response:**
```json
{
  "possible": true,
  "trades": [
    { "price": 100, "quantity": 5, "counterparty_id": 2 }
  ],
  "remaining_quantity": 5
}
```

---

### 2. **Place Buy Order**

**Endpoint:** `POST /order/buy`

**Body:**
```json
{
  "user_id": 2,
  "price": 100,
  "quantity": 5
}
```

**Response:**
```json
{
  "status": "EXECUTED",
  "remaining_quantity": 0
}
```

---

### 3. **Place Sell Order**

**Endpoint:** `POST /order/sell`

**Body:**
```json
{
  "user_id": 3,
  "price": 100,
  "quantity": 5
}
```

**Response:**
```json
{
  "status": "PARTIAL",
  "remaining_quantity": 2
}
```

---

### 4. **Get Orderbook**

**Endpoint:** `GET /order/orderbook`

**Response:**
```json
{
  "buy_orders": [
    { "price": 101, "remaining_quantity": 5 },
    { "price": 100, "remaining_quantity": 3 }
  ],
  "sell_orders": [
    { "price": 102, "remaining_quantity": 4 },
    { "price": 103, "remaining_quantity": 6 }
  ]
}
```

---

### 5. **Get Trade History**

**Endpoint:** `GET /order/trades`

**Optional:** `?user_id=2`

**Response:**
```json
[
  {
    "trade_id": 1,
    "price": 100,
    "quantity": 5,
    "buyer_id": 2,
    "seller_id": 3,
    "created_at": "2025-09-26T12:00:00.000Z"
  }
]
```

---

## ⚖️ Matching Logic

1. **New Order Created** → compared with existing opposite orders.  
   - BUY matches with lowest-priced SELL.  
   - SELL matches with highest-priced BUY.  

2. **Conditions:**  
   - BUY price ≥ SELL price → trade executes.  
   - Quantity = `min(new order remaining, opposite order remaining)`.  

3. **Execution:**  
   - Trade record created.  
   - Reduce opposite order’s quantity.  
   - Remove order if filled.  
   - Continue until fully matched or no matches remain.  

4. **Status Returned:**  
   - `EXECUTED` → fully matched.  
   - `PARTIAL` → partially matched.  
   - `OPEN` → no matches.  


✅ That’s it! You now have a working **orderbook trading simulation** system with REST APIs, React frontend, PostgreSQL, and Docker support.
