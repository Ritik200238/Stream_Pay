#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{AccountOwner, WithServiceAbi},
    views::View,
    Service, ServiceRuntime,
};

use token::{TokenAbi, TokenOperation};

use self::state::TokenState;

#[derive(Clone)]
pub struct TokenService {
    state: Arc<TokenState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(TokenService);

impl WithServiceAbi for TokenService {
    type Abi = TokenAbi;
}

impl Service for TokenService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = TokenState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        TokenService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            self.clone(),
            TokenOperation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

#[Object]
impl TokenService {
    async fn balance(&self, owner: String) -> String {
        let account_owner: AccountOwner = match owner.parse() {
            Ok(o) => o,
            Err(_) => return "0".to_string(),
        };

        match self.state.accounts.get(&account_owner).await {
            Ok(Some(balance)) => balance.to_string(),
            _ => "0".to_string(),
        }
    }

    async fn total_supply(&self) -> String {
        self.state.total_supply.get().to_string()
    }
}
