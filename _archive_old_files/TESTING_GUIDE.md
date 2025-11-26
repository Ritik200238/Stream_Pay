# 🧪 StreamPay Testing Guide

Complete guide to testing StreamPay locally and on Conway testnet.

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Local Testing (Fastest)

```bash
# 1. Start local Linera network
linera net up

# 2. Build and deploy (from streampay directory)
make build
./deploy.sh

# 3. Start GraphQL service
linera service --port 8080

# 4. Open GraphQL Playground
# Visit: http://localhost:8080/graphql
```

### Option 2: Conway Testnet

```bash
# 1. Initialize wallet for testnet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# 2. Request a chain
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net

# 3. Build and deploy
make build
./deploy.sh

# 4. Start service
linera service --port 8080
```

---

## 📝 Testing Scenarios

### Scenario 1: Create and Watch a Stream

**Goal:** See money increment in real-time

**Steps:**

1. **Create a stream (GraphQL Playground)**
```graphql
mutation {
  createStream(
    recipient: "User:0x1234567890abcdef1234567890abcdef12345678",
    ratePerSecond: "278",  # ~$1/hour
    durationSeconds: 3600
  )
}
```

Expected response:
```json
{
  "data": {
    "createStream": 1
  }
}
```

2. **Query the stream**
```graphql
query {
  stream(id: 1) {
    id
    sender
    recipient
    ratePerSecond
    startTime
    status
  }
}
```

3. **Wait 10 seconds**

4. **Check earned amount**
```graphql
query {
  earnedAmount(streamId: 1)
}
```

Should show ~2780 atto (10 seconds × 278/s)

5. **Open frontend**
```bash
cd frontend
npm run dev
```
Visit http://localhost:3000 and watch the counter!

---

### Scenario 2: Pause and Resume

**Goal:** Test stream control

**Steps:**

1. **Pause the stream**
```graphql
mutation {
  pauseStream(streamId: 1)
}
```

2. **Wait 5 seconds**

3. **Check earned amount** - Should not increase

4. **Resume the stream**
```graphql
mutation {
  resumeStream(streamId: 1)
}
```

5. **Check earned amount again** - Should start increasing

---

### Scenario 3: Withdraw Funds

**Goal:** Test withdrawal

**Steps:**

1. **Create stream and wait 30 seconds**

2. **Check available balance**
```graphql
query {
  earnedAmount(streamId: 1)
}
```

Should show ~8340 atto (30s × 278/s)

3. **Withdraw partial amount**
```graphql
mutation {
  withdrawFromStream(
    streamId: 1,
    amount: "5000"
  )
}
```

4. **Check again**
```graphql
query {
  earnedAmount(streamId: 1)
}
```

Should show ~3340 atto (8340 - 5000)

5. **Withdraw all remaining**
```graphql
mutation {
  withdrawFromStream(streamId: 1)
}
```

---

### Scenario 4: Multiple Streams

**Goal:** Test scalability

**Steps:**

1. **Create 3 streams with different rates**
```graphql
mutation {
  s1: createStream(recipient: "User:0x111...", ratePerSecond: "100", durationSeconds: 600)
  s2: createStream(recipient: "User:0x222...", ratePerSecond: "200", durationSeconds: 600)
  s3: createStream(recipient: "User:0x333...", ratePerSecond: "300", durationSeconds: 600)
}
```

2. **Query all streams**
```graphql
query {
  allStreams {
    id
    ratePerSecond
    status
  }
}
```

3. **View in frontend** - Should see all 3 counters updating

---

### Scenario 5: Stop Stream

**Goal:** Permanently end a stream

**Steps:**

1. **Stop the stream**
```graphql
mutation {
  stopStream(streamId: 1)
}
```

2. **Try to resume** - Should fail
```graphql
mutation {
  resumeStream(streamId: 1)
}
```

Expected: Error response

---

## 🎯 Frontend Testing

### Test 1: Live Counter

1. Start frontend: `npm run dev`
2. Create a stream via GraphQL
3. Watch the counter increment every second
4. Verify the math: Rate × Seconds Elapsed

### Test 2: Create Stream Form

1. Fill in recipient address
2. Enter rate (try 278 for $1/hour)
3. Set duration (3600 = 1 hour)
4. Click "Start Streaming"
5. Should see new stream in dashboard

### Test 3: Withdraw Button

1. Click "Withdraw All" on an active stream
2. Should see confirmation
3. Counter should reset or reflect new balance

### Test 4: Responsive Design

1. Resize browser window
2. Check mobile view
3. Verify all elements are readable

---

## 🐛 Common Issues & Fixes

### Issue 1: "Stream not found"

**Cause:** Stream ID doesn't exist

**Fix:** Query `allStreams` to see available IDs

### Issue 2: "Only sender can pause"

**Cause:** Wrong wallet/signer

**Fix:** Make sure you're using the same account that created the stream

### Issue 3: "Insufficient earned amount"

**Cause:** Not enough time has passed

**Fix:** Wait longer or check `earnedAmount` first

### Issue 4: Frontend shows "Loading..."

**Cause:** GraphQL endpoint not running

**Fix:**
```bash
# Make sure service is running
linera service --port 8080
```

### Issue 5: Counter not updating

**Cause:** Frontend not connected

**Fix:** Check `src/config.ts` and ensure GRAPHQL_ENDPOINT is correct

---

## 📊 Performance Testing

### Test Latency

```bash
# Time a withdrawal
time curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { withdrawFromStream(streamId: 1) }"}'
```

Expected: < 100ms

### Test Concurrent Streams

Create 10 streams simultaneously and verify all update correctly

```graphql
mutation {
  s1: createStream(recipient: "User:0x1...", ratePerSecond: "100")
  s2: createStream(recipient: "User:0x2...", ratePerSecond: "100")
  s3: createStream(recipient: "User:0x3...", ratePerSecond: "100")
  # ... s4-s10
}
```

---

## ✅ Test Checklist

Before submission, verify:

- [ ] Build succeeds without warnings
- [ ] All 6 WASM files generated
- [ ] Deployment script works
- [ ] GraphQL service starts
- [ ] Can create stream
- [ ] Can pause stream
- [ ] Can resume stream
- [ ] Can withdraw funds
- [ ] Can stop stream
- [ ] Frontend connects to backend
- [ ] Live counter updates
- [ ] Create form works
- [ ] Withdraw button works
- [ ] Mobile responsive
- [ ] No console errors

---

## 🎬 Recording the Demo

### Setup

1. Clear all existing streams
2. Prepare two terminal windows
3. Have GraphQL Playground open
4. Have frontend open

### Recording Steps

1. **Show GraphQL (10s)**
   - Create a stream mutation
   - Show response

2. **Show Frontend (30s)**
   - Navigate to dashboard
   - Point to live counter
   - Let it increment for 5-10 seconds

3. **Show Withdrawal (20s)**
   - Click withdraw button
   - Show instant confirmation

4. **Show Use Cases (20s)**
   - Scroll through use cases section

5. **Show Comparison (10s)**
   - Point to Traditional vs Ethereum vs Linera

6. **Close (10s)**
   - "Only possible on Linera!"

---

## 📈 Advanced Testing

### Load Testing

```bash
# Create 100 streams (requires scripting)
for i in {1..100}; do
  curl -X POST http://localhost:8080/graphql \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"mutation { createStream(recipient: \\\"User:0x$i\\\", ratePerSecond: \\\"100\\\") }\"}"
done
```

### Stress Testing

Create streams with very high rates and verify calculations remain accurate

---

## 🔍 Debugging

### Enable Debug Logs

```bash
# Rust contracts
RUST_LOG=debug cargo build --release --target wasm32-unknown-unknown

# Linera service
RUST_LOG=debug linera service --port 8080
```

### Check State

```graphql
query {
  allStreams {
    id
    sender
    recipient
    ratePerSecond
    startTime
    endTime
    pausedAt
    totalDeposited
    totalWithdrawn
    status
  }
}
```

---

## 💡 Tips

1. **Use small rates** for testing (100-1000 atto)
2. **Keep durations short** (60-300 seconds)
3. **Test pause/resume** thoroughly
4. **Verify math** manually
5. **Record everything** for the demo video

---

**Happy Testing! 🚀**
