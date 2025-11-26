# StreamPay - Wave 3 Buildathon Submission

## Project Information

**Project Name**: StreamPay
**Tagline**: Get paid by the second, not by the month
**Category**: DeFi / Payments

---

## What is StreamPay?

StreamPay is a real-time payment streaming platform that enables continuous, second-by-second payment flows on Linera blockchain. Unlike traditional payroll (30 days) or Ethereum transactions (12+ seconds), StreamPay leverages Linera's microchains to deliver sub-50ms payment updates.

---

## The Problem

Traditional payment systems have three major issues:

1. **Long Wait Times**: Employees wait 30 days for payroll
2. **High Transaction Costs**: Ethereum gas fees make micro-payments impossible
3. **Slow Finality**: 12+ second block times feel sluggish for real-time apps

---

## The Solution

StreamPay uses Linera's microchain architecture to enable:

- **Real-Time Streaming**: Money flows every second, visible in real-time
- **Sub-50ms Updates**: Leveraging Linera's parallel execution
- **Zero Gas Anxiety**: Predictable costs, no surprise fees
- **Live Balance Counter**: Users watch their earnings grow in real-time

---

## Technical Architecture

### Smart Contracts (Rust)

**Token Application**:
- Handles token transfers and balance management
- Deployed as reusable application on Conway Testnet
- Application ID: `b149a589913c34dbb888906df439e23508deb3ee5034c22a9ce3f4993a5ee14e`

**Stream Application**:
- Manages payment stream lifecycle
- Calculates streamed amounts based on time elapsed
- Handles withdrawals and stream termination
- Application ID: `fc1399cef978d6d7c074bcf8c437281a2382554a89b30b93caecc890e380d4cb`

### Frontend (React + TypeScript)

- Real-time counter updating every 100ms using `setInterval`
- GraphQL integration with Linera service
- Backend connection verification (green banner when connected)
- Framer Motion animations for smooth UX
- Responsive design with gradient effects

### Deployment

- **Network**: Conway Testnet
- **Chain ID**: `ff869722e5434effbdcb533eae9979085f0ee8283aa711a9c2501838683ff54f`
- **GraphQL Endpoint**: `http://localhost:8080`
- **Status**: Fully deployed and operational

---

## Key Features

### 1. Live Balance Counter (The Killer Feature)
Real-time visualization of money flowing second-by-second. Updates every 100ms for smooth animation.

### 2. Create Payment Streams
Users can create new streams by specifying:
- Recipient address
- Rate per second (in atto)
- Duration (or infinite)

### 3. Withdraw Anytime
Recipients can withdraw accumulated funds at any time without waiting for stream completion.

### 4. Backend Connection Status
Visual indicator showing whether frontend is connected to live Conway Testnet or running in demo mode.

---

## Use Cases

1. **Payroll**: Pay employees by the second they work, not monthly
2. **Subscriptions**: Pay only for actual usage time, cancel anytime
3. **Freelancing**: Get paid in real-time as you complete work
4. **Grants**: Continuous funding distribution for projects
5. **Streaming Services**: Pay per second of content consumed

---

## What Makes This Special on Linera?

### Speed
Linera's microchains enable sub-50ms updates, making real-time payment streaming feel truly instantaneous. On Ethereum, this would be impractical due to 12+ second block times.

### Cost
No gas fee surprises. Predictable, minimal costs enable micro-payments at scale.

### Scalability
Each stream could run on its own microchain if needed, enabling unlimited parallel payment streams without congestion.

---

## Demo Video

**YouTube URL**: https://youtu.be/_CmqB1fz7sg

**Demo shows**:
- Live backend connection to Conway Testnet
- Real-time counter ticking up every second
- Creating a new payment stream
- Withdrawal functionality
- Complete deployed stack

---


## Deployment Information

### Smart Contract Deployment

```bash
# Token App
linera project publish-and-create token

# Stream App (with token reference)
linera project publish-and-create stream --json-parameters-path stream_params.json

# Start GraphQL Service
linera service --port 8080
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Configuration

```env
VITE_GRAPHQL_ENDPOINT=http://localhost:8080
VITE_STREAM_APP_ID=fc1399cef978d6d7c074bcf8c437281a2382554a89b30b93caecc890e380d4cb
VITE_TOKEN_APP_ID=b149a589913c34dbb888906df439e23508deb3ee5034c22a9ce3f4993a5ee14e
VITE_CHAIN_ID=ff869722e5434effbdcb533eae9979085f0ee8283aa711a9c2501838683ff54f
```

---

## Technical Achievements

1. **Full Stack Deployment**: Both smart contracts deployed to Conway Testnet
2. **GraphQL Integration**: Frontend successfully connects to Linera service
3. **Real-Time Updates**: 100ms interval counter demonstrating Linera's speed
4. **Production Ready**: Error handling, connection checks, user feedback
5. **Clean Architecture**: Separation of concerns between Token and Stream apps

---

## Testing Instructions for Judges

### Prerequisites
- Node.js v18+ installed
- Linera CLI v0.15.6+ installed

### Quick Start

1. **Clone Repository**:
```bash
git clone [YOUR_REPO_URL]
cd streampay
```

2. **Start Backend** (if not already running):
```bash
linera service --port 8080
```

3. **Start Frontend**:
```bash
cd frontend
npm install
npm run dev
```

4. **Open Browser**:
```
http://localhost:3000
```

5. **Verify Connection**:
Look for green banner: "✅ Connected to Conway Testnet"

6. **Test Features**:
- Watch live counters tick up on existing streams
- Create a new stream with any recipient address
- Click "Withdraw Available" to test withdrawal

---

## Future Enhancements (Wave 4 & Beyond)

1. **Enhanced UI**: Cyberpunk "Future-Fi" design with glassmorphism
2. **Multi-Token Support**: Stream any token, not just native
3. **Scheduled Streams**: Start streams at future dates
4. **Stream Templates**: Common presets (hourly rate, monthly salary, etc.)
5. **Notification System**: Alerts for low balance, completed streams
6. **Analytics Dashboard**: Historical stream data and charts
7. **Mobile App**: React Native version for iOS/Android

---

## Why StreamPay Deserves to Win

1. **Real-World Problem**: Addresses actual pain points in payments and payroll
2. **Fully Deployed**: Not just code - actually running on Conway Testnet
3. **Demonstrates Linera's Strengths**: Speed and scalability shine here
4. **Polished UX**: Real-time counter creates "wow" moment for users
5. **Production Quality**: Error handling, connection checks, professional design
6. **Clear Use Cases**: Multiple real-world applications identified
7. **Scalable Architecture**: Built for growth with clean separation of concerns

---

## Team & Acknowledgments

Built with ❤️ on Linera blockchain for the Wave 3 Buildathon, November 2025.

Special thanks to:
- Linera team for excellent documentation
- Conway Testnet for reliable infrastructure
- Wave 3 Buildathon organizers

---





---

**Don't wait. Stream.** ⚡

---

Built on Linera | Wave 3 Buildathon | November 2025
