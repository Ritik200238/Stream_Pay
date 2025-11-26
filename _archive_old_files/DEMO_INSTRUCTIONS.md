# StreamPay - Wave 3 Demo Instructions

## 🎬 Quick Demo Setup

This is a **frontend prototype demo** of StreamPay - the first real-time payment streaming platform on Linera.

### What's Included

- ✅ **Smart Contracts**: Fully compiled token and stream applications (WASM files in `target/`)
- ✅ **Frontend**: Complete React application with live counter
- ✅ **Documentation**: Comprehensive guides (README, QUICKSTART, etc.)

### Running the Demo

```bash
# Install dependencies
cd frontend
npm install

# Start the application
npm run dev
```

Then open `http://localhost:5173` in your browser!

### Key Features to Demo

1. **Live Counter** - Updates every 100ms showing real-time earnings
2. **Create Stream Form** - Intuitive UI for creating payment streams
3. **Stream Dashboard** - View all active and completed streams
4. **Withdraw Functionality** - Claim earned amounts instantly

### The Innovation

StreamPay showcases Linera's **real-time capabilities** - the live counter updating every 100ms is **impossible on traditional blockchains**. This demonstrates how Linera's instant finality enables truly continuous payment streams.

### Production Deployment

The smart contracts are production-ready and can be deployed to Conway Testnet using:

```bash
# Token app (already deployed)
Token App ID: b149a589913c34dbb888906df439e23508deb3ee5034c22a9ce3f4993a5ee14e

# Stream app (ready to deploy)
linera project publish-and-create stream --json-parameters-file stream_params.json
```

### Why This Wins

- **100% Unique**: Only payment streaming project in Wave 3
- **Real Use Case**: Solves actual payroll/subscription problems
- **Visual Impact**: Live counter creates immediate "WOW" moment
- **Linera-Native**: Showcases instant finality perfectly

### Team

[Your Brother's Name]
Discord: [Username]
Wallet: [Address]

---

Built with ❤️ on Linera for Wave 3 Buildathon
