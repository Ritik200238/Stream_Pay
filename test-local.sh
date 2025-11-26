#!/bin/bash
set -e

echo "🧪 Testing StreamPay locally..."

# Start local network
echo "🌐 Starting local Linera network..."
linera net up &
LINERA_PID=$!

# Wait for network to start
sleep 5

# Build
echo "📦 Building..."
cargo build --release --target wasm32-unknown-unknown

# Deploy
echo "🚀 Deploying..."
./deploy.sh

echo ""
echo "✅ StreamPay is running locally!"
echo ""
echo "🎯 Next steps:"
echo "1. Open http://localhost:8080/graphql"
echo "2. Try creating a stream"
echo "3. Query your streams"
echo ""
echo "Press Ctrl+C to stop"

# Keep running
wait $LINERA_PID
