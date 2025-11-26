#!/bin/bash
set -e

echo "🔨 Building StreamPay applications..."

# Build all applications
cargo build --release --target wasm32-unknown-unknown

echo "✅ Build complete!"
echo ""
echo "📦 WASM files generated:"
ls -lh target/wasm32-unknown-unknown/release/*.wasm | grep -E "(token|stream)_(contract|service)" || true
