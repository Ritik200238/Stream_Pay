#!/bin/bash
set -e

echo "🚀 Deploying StreamPay to Conway Testnet..."

# Build everything first
echo "📦 Building applications..."
cargo build --release --target wasm32-unknown-unknown

echo ""
echo "💰 Deploying Token app..."
TOKEN_OUTPUT=$(linera publish-and-create \
  target/wasm32-unknown-unknown/release/token_contract.wasm \
  target/wasm32-unknown-unknown/release/token_service.wasm \
  --json-argument "{}" 2>&1)

TOKEN_APP_ID=$(echo "$TOKEN_OUTPUT" | grep -oP 'ApplicationId\(\K[^)]+' | head -1)

if [ -z "$TOKEN_APP_ID" ]; then
    echo "❌ Failed to extract Token App ID"
    echo "Output: $TOKEN_OUTPUT"
    exit 1
fi

echo "✅ Token App ID: $TOKEN_APP_ID"

# Create stream params
cat > stream_params.json <<EOF
{
  "token_app": "$TOKEN_APP_ID"
}
EOF

echo ""
echo "💸 Deploying Stream app..."
STREAM_OUTPUT=$(linera publish-and-create \
  target/wasm32-unknown-unknown/release/stream_contract.wasm \
  target/wasm32-unknown-unknown/release/stream_service.wasm \
  --json-parameters-file stream_params.json \
  --json-argument "{}" 2>&1)

STREAM_APP_ID=$(echo "$STREAM_OUTPUT" | grep -oP 'ApplicationId\(\K[^)]+' | head -1)

if [ -z "$STREAM_APP_ID" ]; then
    echo "❌ Failed to extract Stream App ID"
    echo "Output: $STREAM_OUTPUT"
    exit 1
fi

echo "✅ Stream App ID: $STREAM_APP_ID"

# Save to config file for frontend
cat > app_ids.txt <<EOF
TOKEN_APP_ID=$TOKEN_APP_ID
STREAM_APP_ID=$STREAM_APP_ID
EOF

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Application IDs saved to app_ids.txt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Token App:  $TOKEN_APP_ID"
echo "Stream App: $STREAM_APP_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Start GraphQL service:"
echo "   linera service --port 8080"
echo ""
echo "📊 Access GraphQL playground:"
echo "   http://localhost:8080/graphql"
