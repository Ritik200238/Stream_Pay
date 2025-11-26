# StreamPay - Complete Conway Testnet Deployment Guide

## Prerequisites

- ✅ Rust 1.86.0 installed
- ✅ Linera CLI installed (`cargo install linera-service --locked`)
- ✅ WASM files built (already done!)

## Step-by-Step Deployment

### 1. Initialize Wallet for Conway Testnet

```powershell
# Initialize wallet with Conway faucet
linera wallet init --with-new-chain --faucet https://faucet.testnet-conway.linera.net

# This will:
# - Create a new wallet
# - Request a chain from the faucet
# - Get test tokens
```

**Expected output:**
```
Wallet initialized successfully
Chain ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
Owner: User:4321...
```

**Save this Chain ID!**

---

### 2. Navigate to Project Directory

```powershell
cd C:\Users\prate\linera\streampay
```

---

### 3. Deploy Token Application

```powershell
# Deploy token app
linera project publish-and-create token

# Expected output:
# Application published successfully!
# Application ID: abc123...
```

**Save the Token Application ID!**

Update `stream_params.json` with this ID:
```json
{
  "token_app": "YOUR_TOKEN_APP_ID_HERE"
}
```

---

### 4. Deploy Stream Application

```powershell
# Deploy stream app with token reference
linera project publish-and-create stream --json-parameters-file stream_params.json

# Expected output:
# Application published successfully!
# Application ID: xyz789...
```

**Save the Stream Application ID!**

---

### 5. Start GraphQL Service

```powershell
# Start the Linera service on port 8080
linera service --port 8080

# Keep this running in one PowerShell window
```

**Expected output:**
```
GraphQL API listening on http://localhost:8080
Node service ready
```

Open browser to: `http://localhost:8080/graphql`

You should see the GraphQL Playground! 🎉

---

### 6. Test Backend with GraphQL

In the GraphQL Playground, try these queries:

**Query 1: Check Token App**
```graphql
{
  applications {
    id
  }
}
```

**Query 2: Check Stream Functions**
```graphql
mutation {
  createStream(
    recipient: "User:0x123...",
    ratePerSecond: "278",
    durationSeconds: 3600
  )
}
```

---

### 7. Configure Frontend

Update `frontend/.env`:
```
VITE_GRAPHQL_ENDPOINT=http://localhost:8080/graphql
VITE_STREAM_APP_ID=YOUR_STREAM_APP_ID
VITE_TOKEN_APP_ID=YOUR_TOKEN_APP_ID
```

---

### 8. Run Frontend

```powershell
cd frontend
npm run dev
```

Open: `http://localhost:3000`

---

## Troubleshooting

### Issue: "linera: command not found"

**Solution:** Add Cargo bin to PATH:
```powershell
$env:PATH += ";$HOME\.cargo\bin"
```

### Issue: "Failed to connect to faucet"

**Solution:** Check internet connection and try again:
```powershell
linera wallet init --with-new-chain --faucet https://faucet.testnet-conway.linera.net
```

### Issue: "Application already exists"

**Solution:** This is fine! Just note the existing Application ID.

### Issue: GraphQL shows empty

**Solution:** Make sure service is running:
```powershell
linera service --port 8080
```

---

## Verification Checklist

- [ ] Wallet initialized with test chain
- [ ] Token app deployed (have App ID)
- [ ] Stream app deployed (have App ID)
- [ ] GraphQL service running on port 8080
- [ ] Frontend configured with App IDs
- [ ] Frontend running and connected
- [ ] Can create streams in UI
- [ ] Live counter updates in real-time
- [ ] Can withdraw from streams

---

## Application IDs (Fill these in!)

**Token App ID:**
```
_________________________________________________
```

**Stream App ID:**
```
_________________________________________________
```

**Chain ID:**
```
_________________________________________________
```

---

## For Submission

Include these in your buildathon submission:

1. **GitHub Repo:** https://github.com/YOUR_USERNAME/streampay
2. **Live Demo:** http://localhost:3000 (or deployed URL)
3. **GraphQL Endpoint:** http://localhost:8080/graphql
4. **Token App:** [Your Token App ID]
5. **Stream App:** [Your Stream App ID]
6. **Testnet:** Conway

---

Built with ❤️ on Linera | Wave 3 Buildathon | November 2025
