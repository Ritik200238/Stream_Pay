.PHONY: build deploy test clean

build:
	@echo "🔨 Building StreamPay..."
	@cargo build --release --target wasm32-unknown-unknown

deploy:
	@echo "🚀 Deploying to testnet..."
	@./deploy.sh

test:
	@echo "🧪 Running local tests..."
	@./test-local.sh

clean:
	@echo "🧹 Cleaning..."
	@cargo clean
	@rm -f stream_params.json app_ids.txt

check:
	@echo "✅ Checking code..."
	@cargo clippy --target wasm32-unknown-unknown -- -D warnings
	@cargo fmt --check

help:
	@echo "StreamPay - Available commands:"
	@echo "  make build   - Build WASM files"
	@echo "  make deploy  - Deploy to Conway testnet"
	@echo "  make test    - Test locally"
	@echo "  make clean   - Clean build artifacts"
	@echo "  make check   - Run linters"
